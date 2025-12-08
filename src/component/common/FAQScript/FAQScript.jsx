import React from "react";
import { Helmet } from "react-helmet-async";

function sanitizeText(text) {
  if (!text) return "";
  const stripped = text.replace(/<[^>]*>?/gm, "");
  return stripped.replace(/\s+/g, " ").trim();
}

function FAQScript({ FAQ = [] }) {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map((item) => ({
      "@type": "Question",
      name: sanitizeText(item.title),
      acceptedAnswer: {
        "@type": "Answer",
        text: sanitizeText(item.description),
      },
    })),
  };

  const jsonLdString = JSON.stringify(faqJsonLd, null, 2);

  return (
    <Helmet>
      <script type="application/ld+json">{jsonLdString}</script>
    </Helmet>
  );
}

export default FAQScript;
