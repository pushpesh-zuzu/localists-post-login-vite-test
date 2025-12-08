import React from "react";
import FindAccountant from "../../subCategory/findAccountant/FindAccountant";
import CloneAccountants from "../accountants/CloneAccountants";

function ServiceBannerWithBreadcrumb({
  level,
  panelImage,
  accountHeader,
  breadcrumb,
  title,
  service = false,
  para1,
  para2,
  para3,
  defaultService,
}) {
  return (
    <>
      {level === 2 && (
        <CloneAccountants header={accountHeader} panelImage={panelImage} />
      )}

      <FindAccountant
        defaultService={defaultService}
        level={level}
        title={title}
        breadcrumb={breadcrumb}
        service={service}
        para1={para1}
        para2={para2}
        para3={para3}
        panelImage={panelImage}
      />
    </>
  );
}

export default ServiceBannerWithBreadcrumb;
