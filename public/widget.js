
function initLocalistsWidget() {
  const POST_LOGIN_BASE_URL = window.location.origin;
  const widgets = Array.from(document.querySelectorAll(".localists-widget"));
  widgets.forEach((el) => {

    const sizeAttr = el.getAttribute("data-size") || "large";
    const colorAttr = el.getAttribute("data-color") || "navy";

    // ✅ SCALE SYSTEM
    let scale = 1; // Large = max size

    if (sizeAttr === "medium") scale = 0.85;
    if (sizeAttr === "small") scale = 0.7;

    const baseWidth = 260; // 🔥 MAX width
    const width = baseWidth * scale;

    // ✅ COLOR
    let color = "#00afe3";
    if (colorAttr === "gold") color = "#d4af37";

    let shadow = el.shadowRoot;

    if (!shadow) {
      shadow = el.attachShadow({ mode: "open" });
    }

    shadow.innerHTML = "";

    shadow.innerHTML = `
      <style>
        .card {
          width:${width}px;
          border-radius:${24 * scale}px;
          overflow:hidden;
          border:${4 * scale}px solid ${color};
        }

        .top {
          background:${color};
          color:white;
          text-align:center;
          padding:${16 * scale}px ${10 * scale}px;
        }

        .title {
          font-size:${18 * scale}px;
          font-weight:700; /* 🔥 Extra Bold */
          line-height:${24 * scale}px;
          text-shadow: 0 ${1 * scale}px ${2 * scale}px rgba(0,0,0,0.3); /* 🔥 Soft Shadow */
        }

        .bottom {
          background:white;
          display:flex;
          align-items:center;
          justify-content:center;
          padding:${15 * scale}px;
        }

        .logo {
          height:${40 * scale}px;
        }
      </style>

      <div class="card">
        <div class="top">
          <div class="title">
            VERIFIED SERVICE<br/>PROVIDER
          </div>
        </div>
        <div class="bottom">
          <img src="${POST_LOGIN_BASE_URL}/assets/localist_logo.png" class="logo" />
        </div>
      </div>
    `;
  });
}

window.initLocalistsWidget = initLocalistsWidget;
initLocalistsWidget();