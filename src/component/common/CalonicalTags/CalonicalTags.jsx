import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";

const CalonicalTags = ({
  breadcrumb = [],
  bannerImage,
  isRequiredjsonLd = true,
  isRequiredBaseUrlinBreadcrum=true
}) => {
  const baseUrl = "https://www.localists.com";
  const location = useLocation();
  const parts = location.pathname.split("/").filter(Boolean);
  const lang = parts[0] || "en";
  const country = parts[1] || "gb";
  const path = parts.slice(2).join("/");
  const cleanPath = (p) => (p ? p.replace(/^\/+/, "") : "");
  const canonicalUrl = `${baseUrl}/en/gb/${path}`;
  const breadcrumbList = breadcrumb.length
    ? [
        // isRequiredBaseUrlinBreadcrum && {
        //   "@type": "ListItem",
        //   position: 1,
        //   name: "Home",
        //   item: `${baseUrl}/en/gb`,
        // },
        ...breadcrumb.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: item?.title || "",
          item: `${baseUrl}/en/gb/${
            item?.path ? cleanPath(item.path) : `${path}`
          }`,
        })),
      ]
    : [];
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbList || [],
  };
  return (
    <Helmet>
      <link rel="canonical" href={canonicalUrl} />

      <meta property="og:url" content={canonicalUrl} />

      <meta property="og:type" content="website" />

      {/* Hreflang Tags */}
      <link rel="alternate" hreflang="en-gb" href={canonicalUrl} />
      {bannerImage && (
        <meta property="og:image" content={`${baseUrl}${bannerImage}`} />
      )}

      {/* <link rel="alternate" hreflang="x-default" href={`${baseUrl}/${path}`} /> */}

      {isRequiredjsonLd && <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>}
    </Helmet>
  );
};

export default CalonicalTags;
