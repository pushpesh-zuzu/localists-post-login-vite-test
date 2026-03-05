const WIDGET_BASE_URL = (function () {
  const script = document.currentScript;
  if (script && script.src) {
    return new URL(script.src).origin;
  }
  return "https://app.localists.com";
})();

function initLocalistsWidget() {
  if (!document.querySelector("#localists-font")) {
    const link = document.createElement("link");
    link.id = "localists-font";
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Poppins:wght@700;800&display=swap";
    document.head.appendChild(link);
  }

  const widgets = Array.from(document.querySelectorAll(".localists-widget"));
  
  widgets.forEach((el) => {
    const sizeAttr = el.getAttribute("data-size") || "large";
    const colorAttr = el.getAttribute("data-color") || "navy";

    let scale = 1;
    if (sizeAttr === "medium") scale = 0.85;
    if (sizeAttr === "small") scale = 0.7;

    const baseWidth = 260;
    const width = baseWidth * scale;

    let color = "#00afe3";
    if (colorAttr === "gold") color = "#d4af37";

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
          font-family: 'Poppins', Arial, sans-serif;
        }

        .top {
          background:${color};
          color:white;
          text-align:center;
          padding:${16 * scale}px ${10 * scale}px;
          font-family: 'Poppins', Arial, sans-serif;
        }

        .title {
          font-size:${18 * scale}px;
          font-weight:800;
          line-height:${24 * scale}px;
          font-family: 'Poppins', Arial, sans-serif;
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