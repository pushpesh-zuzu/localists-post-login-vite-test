import businessIcon from "../assets/Icons/megamenu/business.svg";
import eventIcon from "../assets/Icons/megamenu/event.svg";
import healthIcon from "../assets/Icons/megamenu/health.svg";
import houseIcon from "../assets/Icons/megamenu/house.svg";
import lessonsIcon from "../assets/Icons/megamenu/lessons.svg";
import moreIcon from "../assets/Icons/megamenu/more.svg";
import businessIconBlue from "../assets/Icons/megamenu/business-blue.svg";
import eventIconBlue from "../assets/Icons/megamenu/event-blue.svg";
import healthIconBlue from "../assets/Icons/megamenu/health-blue.svg";
import houseIconBlue from "../assets/Icons/megamenu/house-blue.svg";
import lessonsIconBlue from "../assets/Icons/megamenu/lessons-blue.svg";
import airportIcon from "../assets/Icons/megamenu/airport.svg";
import airportIconBlue from "../assets/Icons/megamenu/airport-blue.svg";
import photographyIcon from "../assets/Icons/megamenu/photography.svg";
import photographyBlue from "../assets/Icons/megamenu/photography-blue.svg";
import graphicIcon from "../assets/Icons/megamenu/graphic.svg";
import graphicBlue from "../assets/Icons/megamenu/graphic-blue.svg";
import immigrationIcon from "../assets/Icons/megamenu/immigration.svg";
import immigrationBlue from "../assets/Icons/megamenu/immigration-blue.svg";
import limousineIcon from "../assets/Icons/megamenu/limousine.svg";
import limousineBlue from "../assets/Icons/megamenu/limousine-blue.svg";
import privateicon from "../assets/Icons/megamenu/private.svg";
import privateBlue from "../assets/Icons/megamenu/private-blue.svg";
import willsicon from "../assets/Icons/megamenu/wills.svg";
import willsBlue from "../assets/Icons/megamenu/wills-blue.svg";
import airport from "../assets/Icons/megamenu/airport.svg";

export const serviceesData = [
  {
    key: "business",
    name: "Business",
    icon: businessIcon,
    iconhover: businessIconBlue,
  },
  {
    key: "event",
    name: "Events & Entertainers",
    icon: eventIcon,
    iconhover: eventIconBlue,
  },
  {
    key: "health",
    name: "Health & Wellness",
    icon: healthIcon,
    iconhover: healthIconBlue,
  },
  {
    key: "house",
    name: "Home & Garden",
    icon: houseIcon,
    iconhover: houseIconBlue,
  },
  {
    key: "lessons",
    name: "Lessons & Training",
    icon: lessonsIcon,
    iconhover: lessonsIconBlue,
  },
  {
    key: "more",
    name: "More...",
    icon: moreIcon,
  },
];

export const subMenuData = [
  {
    path: "/category",
    name: "Dog & Pet Gromming",
  },
  {
    path: "/category",
    name: "Dog Training",
  },
  {
    path: "/category",
    name: "Dog Walking",
  },
  {
    path: "/category",
    name: "Life Coaching",
  },
  {
    path: "/category",
    name: "Limousine Hire",
  },
];

export const otherMenuData = [
  {
    path: "/category",
    name: "Magician",
  },
  {
    path: "/category",
    name: "Private Investigators",
  },
];

export const allSubMenuData = [
  {
    key: "business",
    path: "/sub-category",
    name: "Accounting",
  },
  {
    key: "business",
    path: "/sub-category",
    name: "Business Consulting",
  },

  {
    key: "business",
    path: "/sub-category",
    name: "Mobile Software Delelopment",
  },
  {
    key: "business",
    path: "/sub-category",
    name: "Search Engine Optimization (SEO)Specialists",
  },
  {
    key: "business",
    path: "/sub-category",
    name: "Security Guard Services",
  },
  {
    key: "business",
    path: "/sub-category",
    name: "Social Media Marketing",
  },
  {
    key: "business",
    path: "/sub-category",
    name: "Web Design",
  },
  {
    key: "event",
    path: "/sub-category",
    name: "Accounting",
  },
  {
    key: "event",
    path: "/sub-category",
    name: "Social Media Marketing",
  },
  {
    key: "event",
    path: "/sub-category",
    name: "Web Design",
  },
  {
    key: "more",
    path: "/sub-category",
    name: "Airport Transfers",
    icon: airportIcon,
    iconhover: airportIconBlue,
  },
  {
    key: "more",
    path: "/sub-category",
    name: "General Photography",
    icon: photographyIcon,
    iconhover: photographyBlue,
  },
  {
    key: "more",
    path: "/sub-category",
    name: "Graphic Design",
    icon: graphicIcon,
    iconhover: graphicBlue,
  },
  {
    key: "more",
    path: "/sub-category",
    name: "Immigration Attorneys",
    icon: immigrationIcon,
    iconhover: immigrationBlue,
  },
  {
    key: "more",
    path: "/sub-category",
    name: "Limousine Hire",
    icon: limousineIcon,
    iconhover: limousineBlue,
  },
  {
    key: "more",
    path: "/sub-category",
    name: "Private Investigators",
    icon: privateicon,
    iconhover: privateBlue,
  },
  {
    key: "more",
    path: "/sub-category",
    name: "Wills and Estate Planning",
    icon: willsicon,
    iconhover: willsBlue,
  },
  {
    key: "more",
    path: "/category",
    name: "Category",
  },
  {
    key: "more",
    path: "/sub-category",
    name: "Sub Category",
  },
  {
    key: "more",
    path: "/location",
    name: "Location",
  },
];

export const locationData = [
  "Warrington",
  "Chester",
  "Manchester",
  "Bolton",
  "Skelmersdale",
  "Ormskirk",
  "Liverpool",
  "Birkenhead",
];
export const megaMenu = [
  {
    name: "Home & Garden",
    path: "home",
    icon: houseIcon,
    subcategory: [
      {
        id: 49,
        name: "Fence & Gate Installation",
        path: "fencing-contractors-near-me",
        children: locationData.map((loc) => `Fence Installers in ${loc}`),
      },
      {
        id: 51,
        name: "Driveway Installation",
        path: "driveway-installers-near-me",
        children: locationData.map((loc) => `Driveway Installers in ${loc}`),
      },
      {
        id: 52,
        name: "Patio Laying",
        path: "patio-layers-near-me",
        children: locationData.map((loc) => `Patio Installers in ${loc}`),
      },
      {
        id: 54,
        name: "Artificial Grass Installation",
        path: "artificial-grass-installers-near-me",
        children: locationData.map(
          (loc) => `Artificial Grass Installers in ${loc}`
        ),
      },
      {
        id: 43,
        name: "Landscaping",
        path: "landscape-gardeners-near-me",
        children: locationData.map((loc) => `Landscape Gardeners in ${loc}`),
      },
      {
        id: 43,
        name: "Tree Surgery",
        path: "tree-surgeon-near-me",
      },
      {
        id: 43,
        name: "Gutter Cleaning",
        path: "gutter-cleaning-near-me",
      },
      // {
      //   name: "General Builders",
      //   children: locationData.map((loc) => `General Builders in ${loc}`),
      // },
      // {
      //   name: "Property Extensions",
      //   children: locationData.map((loc) => `Home Extensions in ${loc}`),
      // },
      // {
      //   name: "Architectural Services",
      //   children: locationData.map((loc) => `Architectural Services in ${loc}`),
      // },
      // {
      //   name: "Home Insulation",
      //   children: locationData.map((loc) => `Insulation Installers in ${loc}`),
      // },
    ],
  },
  {
    name: "Transport",
    path: "transportation-services",
    icon: airport,
    subcategory: [
      {
        // id:,
        name: "Airport Transfers",
        path: "airport-transfers-near-me",
        // children: locationData.map((loc) => `Fence Installers in ${loc}`),
      },
    ],
  },
  {
    name: "Lessons & Training",
    path: "lessons-training",
    icon: lessonsIcon,
    subcategory: [
      {
        // id:,
        name: "Physics and Maths",
        path: "physics-maths-tutors-near-me",
        // children: locationData.map((loc) => `Fence Installers in ${loc}`),
      },
      {
        // id:,
        name: "Tutoring",
        path: "tutors-near-me",
        // children: locationData.map((loc) => `Fence Installers in ${loc}`),
      },
    ],
  },
  //  {
  //   name: "Business",
  //   path: "Business",
  //   icon: businessIcon,
  //   subcategory:[]
  //  },
  //  {
  //   name: "Health and Wellness",
  //   path: "health",
  //   icon: healthIcon,
  //   subcategory:[]
  //  }
  // {
  //   name: "Business",
  //   path:"",
  //   icon: businessIcon,
  //   subcategory: [
  //     {
  //       name: "Bookkeeping Services",
  //       path:'',
  //       children: locationData.map((loc) => `Bookkeeping Services in ${loc}`),
  //     },
  //     {
  //       name: "Social Media Marketing",
  //           path:"",
  //       children: locationData.map((loc) => `Social Media Marketing in ${loc}`),
  //     },
  //     {
  //       name: "Business Consulting",
  //       path:"",
  //       children: locationData.map((loc) => `Business Consulting in ${loc}`),
  //     },
  //     {
  //       name: "Accounting",
  //       path:"",
  //       children: locationData.map((loc) => `Accounting in ${loc}`),
  //     },
  //   ],
  // },
  // {
  //   name: "Lessons & Training",
  //   icon: lessonsIcon,
  //   path:"",
  //   subcategory: [
  //     {
  //       name: "Business & Career Coaching",
  //       path:"",
  //       children: locationData.map(
  //         (loc) => `Business & Career Coaching in ${loc}`
  //       ),
  //     },
  //     {
  //       name: "Music Lessons",
  //       path:"",
  //       children: locationData.map((loc) => `Music Lessons in ${loc}`),
  //     },
  //     {
  //       name: "Academic Tutoring",
  //       path:"",
  //       children: locationData.map((loc) => `Academic Tutoring in ${loc}`),
  //     },
  //     {
  //       name: "Fitness Training",
  //       path:"",
  //       children: locationData.map((loc) => `Fitness Training in ${loc}`),
  //     },
  //   ],
  // },
  // {
  //   name: "More",
  //   icon: moreIcon,
  //   path:"",
  //   subcategory: [
  //     {
  //       name: "Web Design",
  //       path:"",
  //       children: locationData.map((loc) => `Web Designer in ${loc}`),
  //     },
  //     {
  //       name: "Logo Design",
  //       path:"",
  //       children: locationData.map((loc) => `Logo Designer in ${loc}`),
  //     },
  //     {
  //       name: "Home & Domiciliary Care",
  //       path:"",
  //       children: locationData.map(
  //         (loc) => `Home & Domiciliary Care in ${loc}`
  //       ),
  //     },
  //   ],
  // },
  ,
];

export const getChildRoute = (subPath, child) => {
  switch (child) {
    case "Fence Installers in Warrington":
    case "Driveway Installers in Warrington":
    case "Patio Installers in Warrington":
    case "Artificial Grass Installers in Warrington":
    case "Landscape Gardeners in Warrington":
      return `${subPath}/cheshire/warrington`;

    case "Fence Installers in Chester":
    case "Driveway Installers in Chester":
    case "Patio Installers in Chester":
    case "Artificial Grass Installers in Chester":
    case "Landscape Gardeners in Chester":
      return `${subPath}/cheshire/chester`;

    case "Fence Installers in Manchester":
    case "Driveway Installers in Manchester":
    case "Patio Installers in Manchester":
    case "Artificial Grass Installers in Manchester":
    case "Landscape Gardeners in Manchester":
      return `${subPath}/greater-manchester/manchester`;

    case "Fence Installers in Bolton":
    case "Driveway Installers in Bolton":
    case "Patio Installers in Bolton":
    case "Artificial Grass Installers in Bolton":
    case "Landscape Gardeners in Bolton":
      return `${subPath}/greater-manchester/bolton`;

    case "Fence Installers in Skelmersdale":
    case "Driveway Installers in Skelmersdale":
    case "Patio Installers in Skelmersdale":
    case "Artificial Grass Installers in Skelmersdale":
    case "Landscape Gardeners in Skelmersdale":
      return `${subPath}/lancashire/skelmersdale`;

    case "Fence Installers in Ormskirk":
    case "Driveway Installers in Ormskirk":
    case "Patio Installers in Ormskirk":
    case "Artificial Grass Installers in Ormskirk":
    case "Landscape Gardeners in Ormskirk":
      return `${subPath}/lancashire/ormskirk`;

    case "Fence Installers in Liverpool":
    case "Driveway Installers in Liverpool":
    case "Patio Installers in Liverpool":
    case "Artificial Grass Installers in Liverpool":
    case "Landscape Gardeners in Liverpool":
      return `${subPath}/merseyside/liverpool`;

    case "Fence Installers in Birkenhead":
    case "Driveway Installers in Birkenhead":
    case "Patio Installers in Birkenhead":
    case "Artificial Grass Installers in Birkenhead":
    case "Landscape Gardeners in Birkenhead":
      return `${subPath}/merseyside/birkenhead`;

    default:
      return "";
  }
};
