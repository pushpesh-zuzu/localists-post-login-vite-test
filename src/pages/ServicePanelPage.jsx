import React, { useEffect } from "react";
import ServicePanel from "../component/servicePanel";
import CalonicalTags from "../component/common/CalonicalTags/CalonicalTags";
import useUserInfo from "../utils/getUserIp";
import { useDispatch } from "react-redux";
import { setSelectedServiceFormData } from "../store/FindJobs/findJobSlice";
import { Helmet } from "react-helmet-async";

const ServicePanelPage = () => {
  const dispatch = useDispatch();
  const { ip, url } = useUserInfo();

  useEffect(() => {
    if (ip && url) {
      dispatch(
        setSelectedServiceFormData({
          entry_url: url,
          user_ip_address: ip,
        })
      );
    }
  }, [ip, url, dispatch]);
  return (
    <>
      <Helmet>
        <meta
          property="og:title"
          content="Join Localists for Professionals | Free Sign-Up"
        />
        <meta
          name="twitter:title"
          content="Join Localists for Professionals | Free Sign-Up"
        />
        <meta
          property="og:description"
          content="Join Localists free as a professional. Get verified leads with no hidden fees. Pay only for the customers you want and keep all your earnings."
        />
      </Helmet>
      <CalonicalTags isRequiredjsonLd={false} />
      <ServicePanel />
    </>
  );
};

export default ServicePanelPage;
