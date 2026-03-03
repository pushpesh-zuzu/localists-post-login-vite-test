const WIDGET_BASE_URL = (function () {
  const script = document.currentScript;
  if (script && script.src) {
    return new URL(script.src).origin;
  }
  return "https://dev-app.localists.com";
})();

function initLocalistsWidget() {
  const widgets = Array.from(document.querySelectorAll(".localists-widget"));
  
  widgets.forEach((el) => {
    const sizeAttr = el.getAttribute("data-size") || "large";
    const colorAttr = el.getAttribute("data-color") || "navy";

    // ✅ SCALE SYSTEM
    let scale = 1;
    if (sizeAttr === "medium") scale = 0.85;
    if (sizeAttr === "small") scale = 0.7;

    const baseWidth = 260;
    const width = baseWidth * scale;

    // ✅ COLOR
    let color = "#00afe3";
    if (colorAttr === "gold") color = "#d4af37";

    // ✅ FIX: <a> tag Shadow DOM support nahi karta
    let target = el;
    if (el.tagName.toLowerCase() === "a") {
      el.style.textDecoration = "none";
      el.style.display = "inline-block";
      el.innerHTML = "";
      const wrapper = document.createElement("div");
      el.appendChild(wrapper);
      target = wrapper;
    }

    let shadow = target.shadowRoot;
    if (!shadow) {
      shadow = target.attachShadow({ mode: "open" });
    }

    shadow.innerHTML = "";

    shadow.innerHTML = `
      <style>
        .card {
          width:${width}px;
          border-radius:${24 * scale}px;
          overflow:hidden;
          border:${4 * scale}px solid ${color};
          cursor:pointer;
        }

        .top {
          background:${color};
          color:white;
          text-align:center;
          padding:${16 * scale}px ${10 * scale}px;
        }

        .title {
          font-size:${18 * scale}px;
          font-weight:700;
          line-height:${24 * scale}px;
          text-shadow: 0 ${1 * scale}px ${2 * scale}px rgba(0,0,0,0.3);
        }

        .bottom {
          background:white;
          display:flex;
          align-items:center;
          justify-content:center;
          padding:${10 * scale}px;
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
          <img src="${WIDGET_BASE_URL}/assets/localist_logo.png" class="logo" />
        </div>
      </div>
    `;
  });
}

window.initLocalistsWidget = initLocalistsWidget;
initLocalistsWidget();