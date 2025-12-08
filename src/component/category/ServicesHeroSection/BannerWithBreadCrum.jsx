import React from "react";
import FindAccountant from "../../subCategory/findAccountant/FindAccountant";
import CloneAccountants from "../accountants/CloneAccountants";

function BannerWithBreadCrum({
  level,
  LevelOneTwoTitle = "",
  defaultServiceName,
  panelImage,
  accountHeader,
  breadcrumb,
  title,
  service = false,
  para1,
  para2,
  para3,
  para4,
  isNeedS,
  heading2,
  findAccountTitle2,
  placeholderText,
  doYouNeetTitle,
  inputLable1,
  inputLable2

  
}) {
  return (
    <>
      {level === 2 && (
        <CloneAccountants
          header={accountHeader}
          LevelOneTwoTitle={LevelOneTwoTitle}
          panelImage={panelImage}
          title={title}
          defaultServiceName={defaultServiceName}
          heading2={heading2}
          placeholderText={placeholderText}
          doYouNeetTitle={doYouNeetTitle}
          inputLable1={inputLable1}
          inputLable2={inputLable2}
        />
      )}

      <FindAccountant
        level={level}
        title={title}
        breadcrumb={breadcrumb}
        service={service}
        para1={para1}
        para2={para2}
        para3={para3}
        para4={para4}
        panelImage={panelImage}
        isNeedS={isNeedS}
        findAccountTitle2={findAccountTitle2}
      />
    </>
  );
}

export default BannerWithBreadCrum;
