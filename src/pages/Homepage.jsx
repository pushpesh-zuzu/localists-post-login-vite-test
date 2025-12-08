import { Helmet } from "react-helmet-async";
import PopularService from "../component/homescreen/popularServices/PopularService";
import SearchProfessionals from "../component/homescreen/searchUser/SearchUser";
import ServiceCategory from "../component/homescreen/serviceCategory/ServiceCategory";
import Services from "../component/homescreen/services/Services";
import OurTeams from "../component/homescreen/team/OurTeams";
import WorkStructure from "../component/homescreen/WorkOverview/WorkStructure";
import { useLocation, useNavigate, useParams } from "react-router";
import CalonicalTags from "../component/common/CalonicalTags/CalonicalTags";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  getAllServiceList,
  getPopularServiceList,
} from "../store/FindJobs/findJobSlice";
import { toast } from "react-toastify";

const Homepage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { allServiceList, popularList, popularLoader } = useSelector(
    (state) => state.findJobs
  );

  const [initialLoader, setInitialLoader] = useState(true);
  const [popularInitialLoader, setPopularInitialLoader] = useState(true);

  useEffect(() => {
    if (!allServiceList || allServiceList.length === 0) {
      dispatch(getAllServiceList()).finally(() => setInitialLoader(false));
    } else {
      setInitialLoader(false);
    }
  }, [dispatch, allServiceList]);

  useEffect(() => {
    if (!popularList || popularList.length === 0) {
      dispatch(getPopularServiceList()).finally(() =>
        setPopularInitialLoader(false)
      );
    } else {
      setPopularInitialLoader(false);
    }
  }, [dispatch, popularList]);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const status = queryParams.get("status");
  const message = queryParams.get("message");

  useEffect(() => {
    if (message && status !== null) {
      if (status === "true") {
        toast.success(message);
        navigate("/en/gb/");
      } else if (status === "false") {
        toast.error(message);
        navigate("/en/gb/");
      }
    }
  }, [status, message]);

  return (
    <>
      <Helmet>
        <script>
          {`
              gtag('event', 'conversion', {
                'send_to': 'AW-17528251553/iVB9CJjZsZMbEKHJj6ZB',
                'value': 1.0,
                'currency': 'GBP'
                });
          `}
        </script>
        <script type="application/ld+json">
          {`{
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Localists",
            "url": "https://www.localists.com/en/gb/",
            "logo": "https://www.localists.com/assets/logo-CQuAsOMd.png",
            "sameAs": [
              "https://www.facebook.com/localistsuk/",
              “https://www.instagram.com/localists_official”,
              "https://www.linkedin.com/company/localistsuk/",
              "https://x.com/LocalistsUK"
            ]
          }`}
        </script>

        <script type="application/ld+json">
          {`
          {
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "Localists",
            "url": "https://www.localists.com/en/gb/",
            "potentialAction": {
              "@type": "SearchAction",
              "target": "https://www.google.com/search?q={search_term_string}+site:localists.com",
              "query-input": "required name=search_term_string"
            },
          }
          `}
        </script>
        
        <script type="application/ld+json">
          {`{
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          "name": "Localists",
          "image": "https://www.localists.com/assets/logo-CQuAsOMd.png",
          "@id": "",
          "url": "https://www.localists.com/en/gb/",
          "telephone": "01544 303 020",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "Chester Business Park",
            "addressLocality": "Chester",
            "postalCode": "CH4 9QJ",
            "addressCountry": "GB"
          },
          "geo": {
            "@type": "GeoCoordinates",
            "latitude": 53.1630694,
            "longitude": -2.9000889
          },
          "openingHoursSpecification": {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": [
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
              "Sunday"
            ],
            "opens": "00:00",
            "closes": "23:59"
          },
          "sameAs": [
            “https://www.facebook.com/localistsuk/”,
            “https://www.instagram.com/localists_official”,
            "https://x.com/LocalistsUK",
            "https://www.linkedin.com/company/localistsuk/"
          ] 
        }
        `}
        </script>
      </Helmet>
      <CalonicalTags isRequiredjsonLd={false} />

      <SearchProfessionals
        popularList={popularList}
        popularLoader={popularLoader || popularInitialLoader}
      />
      <PopularService
        popularList={popularList}
        popularLoader={popularLoader || popularInitialLoader}
      />
      <ServiceCategory
        allServiceList={allServiceList}
        popularLoader={popularLoader}
        initialLoader={initialLoader}
      />
      <Services allServiceList={allServiceList} initialLoader={initialLoader} />
      <WorkStructure />
      <OurTeams />
    </>
  );
};

export default Homepage;
