// src/routes/LocaleRedirect.jsx
import { useEffect, useMemo } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { getUserCountry, getUserLanguage } from "../utils/geo";

/**
 * LocaleRedirect rules:
 * - If URL already has a locale prefix "/:lang/:country" (e.g., /en/gb/...),
 *   DO NOT change it. Stay on the same page.
 * - If URL has no locale prefix (e.g., /, /login),
 *   redirect to "/{lang}/{country}{path}" using detected or fallback values.
 * - Non-localized routes should include this wrapper only when you want redirection.
 */
export default function LocaleRedirect({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();

  const hasLocale = useMemo(() => {
    const langOk = /^[a-z]{2}$/.test(params.lang || "");
    const countryOk = /^[a-z]{2}$/.test(params.country || "");
    return langOk && countryOk;
  }, [params.lang, params.country]);

  useEffect(() => {
    // If already localized, do nothing (stay on the same route)
    if (hasLocale) return;

    let cancelled = false;
    const doRedirect = async () => {
      // Detect values on client only
      const detectedCountry = await getUserCountry(); // e.g. "in"
      const detectedLang = getUserLanguage();         // e.g. "en"

      // Build new path with prefix + current path without any accidental locale prefix
      const suffix = location.pathname.replace(/^\/[a-z]{2}\/[a-z]{2}/, "");
      const nextPath =
        `/${detectedLang}/${detectedCountry}` +
        (suffix.startsWith("/") ? suffix : `/${suffix}`);

      if (!cancelled && location.pathname !== nextPath) {
        navigate(nextPath, { replace: true });
      }
    };

    // Only redirect when missing locale prefix
    doRedirect();
    return () => {
      cancelled = true;
    };
  }, [hasLocale, location.pathname, navigate]);

  return children;
}
