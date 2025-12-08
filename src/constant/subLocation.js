import { AccountantImg, FreeQuotesImg, WhatYouNeedImg } from "../assets/Icons";
import {
  KilburnImg,
  NewMillsImg,
  OakmanorAccountancyImg,
  OakmanorImg,
  PayrollServicesImg,
  PinxtonImg,
  TaxPreparationImg,
  TaxResolutionImg,
  TunstallAccountingImg,
} from "../assets/Images/location";
import { fence2 } from "../assets/Images/servicesLevels/banner/Fence";
import {
  ArtificialGrass,
  Driveway,
  Landscaping,
  Patio,
} from "../assets/Images/servicesLevels/services";

const CONTENT_LEVEL5_CONFIG_META = {
  "fence-installers": {
    warrington: {
      title: "Fencers in Warrington | Find Local Fencing Experts – Localists",
      name: "description",
      content:
        "Get free quotes, check genuine reviews, and choose trusted local fencing experts in Warrington for your home or business with Localists.",
    },
  },
};
const CONTENT_CONFIG_LEVEL5_TOP = {
  "fence-installers": {
    warrington: {
      accountHeader: "Fence Installation",
      title: "Fencer",
      mainTitle: "Fencer",
    },
  },
};
const BREADCRUMB_LEVEL5_CONFIG = {
  "fence-installers": {
    warrington: [
      { title: "Home & Garden", path: "/home" },
      { title: "Builders", path: "/builders" },
      { title: "Fence & Gate Installation", path: "/fence-installers" }, // no path for last item
      { title: "Cheshire", path: "/fence-installers/cheshire" },
      { title: "Warrington" },
    ],
  },
};
const FIND_CONTENT_LEVEL5_CONFIG = {
  "fence-installers": {
    warrington: {
      para1:
        "We’ll connect you with the best fencers in Warrington in minutes. Start your search and get free quotes today!",
      para2:
        "Whether you’re looking for quotes, ready to hire, or want to speak directly with experienced Warrington-based fencers, we can help.",
      para3:
        "If it’s your first time hiring a fencer and you’re unsure where to start, let us do the hard work for you. Simply tell us about your project, and we’ll send you a list of trusted fencers in Warrington to review.",
      para4:
        "There’s no pressure to hire – you can compare profiles, read genuine customer reviews, and request more information before making your choice.",
      para5: "Best of all – it’s completely free!",
    },
  },
};
const HOW_WORK_LEVEL5 = {
  "fence-installers": {
    warrington: [
      {
        id: 1,
        title: "What you need icon",
        image: WhatYouNeedImg,
        heading1: "Tell us",
        heading2: " Your Requirements",
        description:
          "Let us know what kind of fencing service you’re looking for in Warrington. Share your details and preferences, and we’ll connect you with trusted local fencers who can help.",
      },
      {
        id: 2,
        title: "Free quotes icon",
        image: FreeQuotesImg,
        heading1: "Get",
        heading2: "Free Quotes",
        description:
          "Receive free, no-obligation quotes from fencing professionals in Warrington. You’ll be notified quickly via our website or app, so you can compare options without the hassle.",
      },
      {
        id: 3,
        title: "Choose your accountant icon",
        image: AccountantImg,
        heading1: "Choose your",
        heading2: " Ideal Fencer",
        description:
          "Review profiles, read genuine customer feedback, and contact fencers directly. With top-rated providers at your fingertips, you can hire with complete confidence.",
      },
    ],
  },
};
const POPULAR_SERVICES_LEVEL5_COMPANIES = {
  "fence-installers": {
    warrington: [
      {
        id: 1,
        logo: OakmanorAccountancyImg,
        name: "DecKing Warrington",
        stars: 5,
        certificate: "Certificate of Excellence",
        description:
          "Our commitment to exceptional customer service and high-quality workmanship sets us apart in the market. Based in Wilmslow, we are a trusted fencing and decking contractor serving South Manchester and Cheshire. We use only premium materials, including Jacksons Fencing, Durapost, and Millboard – each backed by an impressive 25-year guarantee.",
        testimonial: {
          name: "Robert Simpson",
          initial: "R",
          stars: 5,
          text: "The result is excellent. The team removed my old decking and built a beautiful new one with stairs. They were professional, helpful, and left everything immaculate.” – Mr B. Price",
        },
      },
      {
        id: 2,
        logo: TunstallAccountingImg,
        name: "First Choice Gardens & Landscapes",
        stars: 5,
        description:
          "Fully qualified Chartered accountant dedicated to providing a friendly and straight forward service bespoke to the needs of each and every client.",
        testimonial: {
          name: "Tokyo Matilda",
          initial: "T",
          stars: 5,
          text: `“Absolutely first-class work – attention to detail was superb. The site was left clean and tidy every day. Highly recommended.” – Nick Shotton`,
        },
      },
      {
        id: 3,
        logo: OakmanorImg,
        name: "Edge Fencing",
        stars: 5,
        certificate: "Certificate of Excellence",
        description:
          "We are a local, family-run business specialising in the supply and installation of high-quality timber and composite decking. Our expertise also includes fencing, gates, pergolas, gazebos, sheds, summer houses, log cabins, garden buildings, playhouses, hot tubs, spas, and much more.",
        testimonial: {
          name: "Jade Marie",
          initial: "J",
          stars: 5,
          text: "“Really good service. Left my garden looking lovely.” – Jane",
        },
      },
    ],
  },
};
const FIND_SERVICE_CONTENT_LEVEL5 = {
  "fence-installers": {
    warrington:[
    {
      type: "h2",
      text: "Find Trusted Fencers in Warrington",
    },
    {
      type: "p",
      text: "Looking to create a little more peace and privacy at home? Installing a new fence is a great way to enhance security, reduce noise, and give your property a stylish finishing touch. Whether you prefer classic picket fencing, durable overlap panels, sleek aluminium, or sturdy brickwork, Localists connects you with skilled fence and gate installers in Warrington who can bring your vision to life.",
    },
    {
      type: "p",
      text: "Finding the right professional has never been easier. Simply tell us what you need and where you need it, and we’ll match you with top-rated local fencers suited to your project. We’ll send you a tailored list of trusted experts so you can compare options, read genuine reviews, request more details, and receive free quotes—all in one convenient place",
    },
    {
      type: "p",
      text: "Start your search today and find qualified fencers in Warrington who can deliver the perfect fencing solution for your home or business.",
    },
  ],
  }
};
const OTHER_SERVICES_DATA_LEVEL5 = {
  "fence-installers": {
    warrington:[
    {
      id: 1,
      image: Driveway,
      description: "Driveway Installation",
      availableOnline: true,
      path: "driveway-installers",
    },
    {
      id: 2,
      image: Patio,
      description: "Patio Services",
      path: "patio-services",
    },
    {
      id: 3,
      image: Landscaping,
      description: "Landscaping",
      availableOnline: true,
      path: "landscaping",
    },
    {
      id: 4,
      image: ArtificialGrass,
      description: "Artificial Grass Installation",
      path: "artificial-grass-installation",
    },
  ],
  }
};
const LEVEL5_SERVICES_NAME = {
  "fence-installers": "Fence & Gate Installation",
  "driveway-installers": "Driveway Installation",
  "patio-services": "Patio Services",
  landscaping: "Landscaping",
  "artificial-grass-installation": "Artificial Grass Installation",
};
const BannerImageLevel5 = {
  "fence-installers": {
    warrington: fence2,
  },
};
export {
  CONTENT_LEVEL5_CONFIG_META,
  CONTENT_CONFIG_LEVEL5_TOP,
  BREADCRUMB_LEVEL5_CONFIG,
  FIND_CONTENT_LEVEL5_CONFIG,
  HOW_WORK_LEVEL5,
  POPULAR_SERVICES_LEVEL5_COMPANIES,
  OTHER_SERVICES_DATA_LEVEL5,
  FIND_SERVICE_CONTENT_LEVEL5,
  LEVEL5_SERVICES_NAME,
  BannerImageLevel5
};
