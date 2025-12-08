import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const ConversionRedirect = () => {
  const navigate = useNavigate();
  const { requestId } = useParams();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate(`/bids-list/${requestId}`, { replace: true });
    }, 1000);

    return () => clearTimeout(timer);
  }, [navigate, requestId]);

  return (
    <>
      <Helmet>
        {/* Google Conversion Tracking */}
        <script>{`
          gtag('event', 'conversion', {
            'send_to': 'AW-17528251553/iVB9CJjZsZMbEKHJj6ZB',
            'value': 1.0,
            'currency': 'GBP'
          });
        `}
        </script>
        <script>
          {`(function (w, d, t, r, u) {
        var f, n, i;
        (w[u] = w[u] || []),
          (f = function () {
            var o = { ti: "97207664", enableAutoSpaTracking: true };
            (o.q = w[u]), (w[u] = new UET(o)), w[u].push("pageLoad");
          }),
          (n = d.createElement(t)),
          (n.src = r),
          (n.async = 1),
          (n.onload = n.onreadystatechange =
            function () {
              var s = this.readyState;
              (s && s !== "loaded" && s !== "complete") ||
                (f(), (n.onload = n.onreadystatechange = null));
            }),
          (i = d.getElementsByTagName(t)[0]),
          i.parentNode.insertBefore(n, i);
      })(window, document, "script", "//bat.bing.com/bat.js", "uetq");`}
        </script>
        <script>
          {` window.uetq = window.uetq || [];
      window.uetq.push("consent", "default", {
        ad_storage: "denied",
      });
    </script>
    <script>
      window.uetq = window.uetq || [];
      window.uetq.push("consent", "update", {
        ad_storage: "granted",
      });`}
        </script>
      </Helmet>
    </>
  );
};

export default ConversionRedirect;
