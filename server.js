import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import express from "express";
import compression from "compression";
import NodeCache from "node-cache";
import { createServer as createViteServer } from "vite";
import { OAuth2Client } from "google-auth-library";
import axios from "axios";
import { google } from "googleapis";
import cors from "cors";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const resolve = (p) => path.resolve(__dirname, p);

const app = express();
app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);

app.use(
  cors({
    origin: "http://localhost:5100",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // Allow all origins
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT,PATCH, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

const oAuth2Client = new OAuth2Client(
  process.env.VITE_GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

const cache = new NodeCache({ stdTTL: 60 });

async function fetchWithCache(key, url, headers) {
  if (cache.has(key)) {
    return cache.get(key);
  }
  const res = await fetch(url, { headers });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} - ${await res.text()}`);
  }
  const data = await res.json();
  cache.set(key, data);
  return data;
}

app.post("/google/get-auth-token", async (req, res) => {
  try {
    const { code } = req.body;

    const tokenResponse = await axios.post(
      "https://oauth2.googleapis.com/token",
      {
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: "http://localhost:5100",
        grant_type: "authorization_code",
      }
    );

    const { access_token, refresh_token, expires_in } = tokenResponse.data;

    res.json({
      success: true,
      message: "Google authentication successful",
      data: {
        access_token,
        refresh_token,
        expires_in,
      },
    });
  } catch (error) {
    console.error(
      "Token exchange error:",
      error.response?.data || error.message
    );
    res.status(500).json({
      success: false,
      error: "Failed to get access token",
      details: error.response?.data,
    });
  }
});

const fetchAccountDetails = async (accessToken) => {
  const accountsEndpoint =
    "https://mybusinessaccountmanagement.googleapis.com/v1/accounts";

  try {
    const response = await axios.get(accountsEndpoint, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    const accounts = response.data.accounts;

    if (accounts && accounts.length > 0) {
      const accountResourceName = accounts[0].name;

      const accountId = accountResourceName.split("/")[1];

      return accountId;
    } else {
      return null;
    }
  } catch (error) {
    console.error(
      "Error fetching Google Business Profile accounts:",
      error.response ? error.response.data : error.message
    );
    throw new Error("Failed to fetch account ID from Google API.");
  }
};

app.post("/api/google/account-id", async (req, res) => {
  const { accessToken } = req.body;

  if (!accessToken) {
    return res
      .status(400)
      .json({ error: "Access token is required in the request body." });
  }

  try {
    const accountId = await fetchAccountDetails(accessToken);

    if (accountId) {
      res.json({
        success: true,
        accountId: accountId,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "No business accounts found for this user.",
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      error: "Internal server error while communicating with Google API.",
      details: err.message,
    });
  }
});

app.post("/api/google/get-reviews", async (req, res) => {
  try {
    const { access_token, refresh_token } = req.body;

    oAuth2Client.setCredentials({
      access_token: access_token,
      refresh_token: refresh_token,
    });

    // 2. Get Account ID
    const accountApi = google.mybusinessaccountmanagement({
      version: "v1",
      auth: oAuth2Client,
    });

    const accountsRes = await accountApi.accounts.list();
    if (!accountsRes.data.accounts || accountsRes.data.accounts.length === 0) {
      throw new Error("No accounts found for this user.");
    }
    const accountId = accountsRes.data.accounts[0].name; // e.g. "accounts/1234567890"

    // 3. Get Location ID
    const locationApi = google.mybusinessbusinessinformation({
      version: "v1",
      auth: oAuth2Client,
    });

    const locationsRes = await locationApi.accounts.locations.list({
      parent: accountId,
    });

    if (
      !locationsRes.data.locations ||
      locationsRes.data.locations.length === 0
    ) {
      throw new Error("No locations found for this account.");
    }
    const locationId = locationsRes.data.locations[0].name.split("/")[2]; // extracts 987654321

    // 4. Get Reviews
    const reviewsRes = await locationApi.accounts.locations.reviews.list({
      parent: `${accountId}/locations/${locationId}`,
    });

    return reviewsRes.data; // contains reviews
  } catch (err) {
    console.error("Error fetching Google Reviews:", err.message);
    throw err;
  }
});

// 3. Refresh token route (optional)
app.post("/google/refresh-token", async (req, res) => {
  try {
    const { refresh_token } = req.body;

    const tokenResponse = await axios.post(
      "https://oauth2.googleapis.com/token",
      {
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        refresh_token: refresh_token,
        grant_type: "refresh_token",
      }
    );

    res.json({
      success: true,
      data: tokenResponse.data,
    });
  } catch (error) {
    console.error(
      "Token refresh error:",
      error.response?.data || error.message
    );
    res.status(500).json({
      success: false,
      error: "Failed to refresh token",
    });
  }
});

const PORT = process.env.PORT || 5100;
app.listen(PORT, () => {});

async function createServer() {
  app.set("etag", "strong");
  app.use(compression({ threshold: 1024 }));
  const isProd = process.env.NODE_ENV === "production";

  let vite, template, render;
  let manifest = {};
  const ssrCache = new NodeCache({ stdTTL: 60, checkperiod: 120 });

  if (isProd) {
    template = fs.readFileSync(resolve("dist/client/index.html"), "utf-8");

    const manifestPath = resolve("dist/client/.vite/manifest.json");
    if (fs.existsSync(manifestPath)) {
      manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));
    }

    // Resolve SSR entry built by Vite (hashed path under dist/server/assets via SSR manifest)
    let serverEntryFile = resolve("dist/server/entry-server.js");
    const ssrManifestPath = resolve("dist/server/.vite/manifest.json");
    try {
      if (fs.existsSync(ssrManifestPath)) {
        const ssrManifest = JSON.parse(
          fs.readFileSync(ssrManifestPath, "utf-8")
        );
        const entryKey =
          Object.keys(ssrManifest).find(
            (k) =>
              k.endsWith("src/entry-server.jsx") ||
              k.endsWith("src/entry-server.js")
          ) || "src/entry-server.jsx";
        const mapped = ssrManifest[entryKey];
        if (mapped && mapped.file) {
          serverEntryFile = resolve(path.join("dist/server", mapped.file));
        }
      } else {
        const assetsDir = resolve("dist/server/assets");
        if (fs.existsSync(assetsDir)) {
          const files = fs.readdirSync(assetsDir);
          const match = files.find((f) => /^entry-server.*\.js$/.test(f));
          if (match) {
            serverEntryFile = resolve(path.join("dist/server/assets", match));
          }
        }
      }
    } catch (_) {}

    const mod = await import(pathToFileURL(serverEntryFile).href);
    render = mod.render;

    app.use(
      "/assets",
      express.static(resolve("dist/client/assets"), {
        maxAge: "1y",
        immutable: true,
      })
    );
    app.use(
      express.static(resolve("dist/client"), {
        maxAge: "1y",
        index: false,
        immutable: true,
      })
    );
  } else {
    vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "custom",
    });
    app.use(vite.middlewares);
  }

  app.use(async (req, res, next) => {
    try {
      const url = req.originalUrl;
      const hostname = req.hostname;

      const accept = req.headers.accept || "";
      if (isProd && req.method === "GET" && accept.includes("text/html")) {
        const cacheKey = `${hostname}|${url}`;
        const cached = ssrCache.get(cacheKey);
        if (cached) {
          return res
            .status(200)
            .set({ "Content-Type": "text/html", "X-Cache": "HIT" })
            .end(cached);
        }
      }

      let tpl = template;
      if (!isProd) {
        tpl = fs.readFileSync(resolve("index.html"), "utf-8");
        tpl = await vite.transformIndexHtml(url, tpl);
        const { render: devRender } = await vite.ssrLoadModule(
          "/src/entry-server.jsx"
        );
        render = devRender;
      }

      const rendered = await render(url, hostname);
      const appHtml =
        typeof rendered === "string" ? rendered : rendered.html || "";
      const headContent = (rendered && rendered.head) || "";

      let cssInline = "";
      if (isProd && manifest) {
        Object.values(manifest).forEach((entry) => {
          if (entry?.css) {
            entry.css.forEach((href) => {
              const cssPath = resolve(path.join("dist/client", href));
              if (fs.existsSync(cssPath)) {
                cssInline += `<style>${fs.readFileSync(
                  cssPath,
                  "utf-8"
                )}</style>\n`;
              }
            });
          }
        });
      }
      const preloadedState = rendered.state || {};
      const stateScript = `<script>
  window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState).replace(
    /</g,
    "\\u003c"
  )};
</script>`;

      let processedTpl = tpl;
      let clientScripts = "";
      if (isProd) {
        processedTpl = processedTpl
          .replace(/<link[^>]+href="\/src\/index\.css"[^>]*>\s*/g, "")
          .replace(/<link[^>]+href="\/src\/App\.css"[^>]*>\s*/g, "")
          .replace(
            /<noscript>\s*<link[^>]+href="\/src\/index\.css"[^>]*>\s*<\/noscript>\s*/g,
            ""
          )
          .replace(
            /<noscript>\s*<link[^>]+href="\/src\/App\.css"[^>]*>\s*<\/noscript>\s*/g,
            ""
          )
          .replace(
            /<link[^>]+rel="modulepreload"[^>]+href="\/src\/entry-client\.jsx"[^>]*>\s*/g,
            ""
          )
          .replace(
            /<script[^>]+type="module"[^>]+src="\/src\/entry-client\.jsx"[^>]*>\s*<\/script>\s*/g,
            ""
          );

        const entries = Object.values(manifest).filter(
          (e) =>
            e &&
            e.isEntry &&
            typeof e.file === "string" &&
            e.file.endsWith(".js")
        );
        entries.forEach((entry) => {
          clientScripts += `<script type="module" src="/${entry.file}" crossorigin></script>\n`;
        });
      }

      const html = (isProd ? processedTpl : tpl)
        .replace("<!--ssr-outlet-->", appHtml)
        .replace("<!--css-outlet-->", `${headContent}\n${cssInline}`)
        .replace("</body>", `${stateScript}\n${clientScripts}</body>`);

      if (isProd) {
        const cacheKey = `${hostname}|${url}`;
        ssrCache.set(cacheKey, html);
      }

      res
        .status(200)
        .set({ "Content-Type": "text/html", "X-Cache": "MISS" })
        .end(html);
    } catch (e) {
      if (!isProd && vite) {
        vite.ssrFixStacktrace(e);
      }
      next(e);
    }
  });

  const port = isProd ? process.env.SSR_PORT || 5102 : process.env.PORT || 5100;
  const host = isProd
    ? process.env.SSR_HOST || "127.0.0.1"
    : process.env.HOST || "127.0.0.1";
  const serverType = isProd ? "SSR server" : "Server";

  app.listen(port, host, () => {
    console.log(
      `${serverType} running at http://${host}:${port} (mode: ${
        isProd ? "production" : "development"
      })`
    );
  });
}

createServer();
