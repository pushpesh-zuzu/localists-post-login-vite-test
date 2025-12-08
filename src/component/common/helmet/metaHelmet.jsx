import React from "react";
import { Helmet } from "react-helmet-async";

const MetaHelmet = ({ title, description }) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta property="og:title" content={title} />
      <meta name="twitter:title" content={title} />
      {description && <meta name="description" content={description} />}
      {description && <meta property="og:description" content={description} />}
      <meta name="twitter:description" content={description} />
    </Helmet>
  );
};

export default MetaHelmet;
