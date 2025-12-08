import london from "../assets/Images/subcategory/london.svg";
import birmingham from "../assets/Images/subcategory/brimingham.svg";
import liverpool from "../assets/Images/subcategory/liverpool.svg";
import WhatYouNeedIcon from "../assets/Icons/WhatYouNeedIcon.png";
import FreeQuotesIcon from "../assets/Icons/FreeQuotesIcon.png";
import accountant from "../assets/Images/subcategory/accountant.png";
import TaxPreparationImg from "../assets/Images/subcategory/tax-pre.png";
import TaxResolutionImg from "../assets/Images/subcategory/tax-res.png";
import PayrollServicesImg from "../assets/Images/subcategory/payroll.png";
import TaxReturn from "../assets/Images/subcategory/tax-return-uk.png";
import AccountentBusiness from "../assets/Images/subcategory/accountant-business.png";
import BasicAccounting from "../assets/Images/subcategory/basic-accounting.png";
import AccountingCost from "../assets/Images/subcategory/accounting-cost.png";
import TaxAccountent from "../assets/Images/subcategory/tax-acc-cost.png";
import FinancialCost from "../assets/Images/subcategory/financial-cost.png";
import ReviewsImage from "../assets/Images/subcategory/reviews_girl.png";
import Builders from "../assets/Images/servicesLevels/Builders.jpg";
import Driveway from "../assets/Images/servicesLevels/Driveway-Installation.jpg";
import fenchinstal from "../assets/Images/servicesLevels/Fence-&-Gate-Installation.jpg";
import Home from "../assets/Images/servicesLevels/Home.jpg";
import Landscaping from "../assets/Images/servicesLevels/Landscaping.jpg";
import Patio from "../assets/Images/servicesLevels/Patio-Services.jpg";
import ArtificialGrass from "../assets/Images/servicesLevels/ArtificialGrass.jpg";
import ArtificialGrassBanner from "../assets/Images/servicesLevels/banner/ArtificialGrassInstallationBanner.jpg";
import LandscapingBanner from "../assets/Images/servicesLevels/banner/landscapingandgardeningBanner.jpg";
import LandscapingGardeningBanner from "../assets/Images/servicesLevels/banner/landscapingandgardeningBanner.jpg";
import PatioServicesBanner from "../assets/Images/servicesLevels/banner/PatioServicesBanner.jpg";
import ArtificialGrassInstallationBanner from "../assets/Images/servicesLevels/banner/ArtificialGrassInstallationBanner.jpg";
import BuildersBanner from "../assets/Images/servicesLevels/banner/BuildersBanner.jpg";
import DrivewayInstallationBanner from "../assets/Images/servicesLevels/banner/DrivewayInstallationBanner.jpg";
import FenceGateInstallationBanner from "../assets/banners/FenceGate-InstallationBanner.jpg";
import HomeBanner from "../assets/Images/servicesLevels/banner/HomeBanner.jpg";
import EllesmerePort from "../assets/Images/servicesLevels/cities/EllesmerePort.jpg";
import Liverpool from "../assets/Images/servicesLevels/cities/Liverpool.jpg";
import Manchester from "../assets/Images/servicesLevels/cities/Manchester.jpg";
import Warrington from "../assets/Images/servicesLevels/cities/Warrington.jpg";
import Chester from "../assets/Images/servicesLevels/cities/Chester.jpg";

const POPULAR_CITIES = [
  { city_image: Liverpool, city_name: "Liverpool" },
  { city_image: Manchester, city_name: "Manchester" },
  { city_image: Chester, city_name: "Chester" },
  { city_image: Warrington, city_name: "Warrington" },
  { city_image: EllesmerePort, city_name: "Ellesmere" },
];

const RELATED_PRICE_DATA = {
  "fence-installers": [
    {
      id: 1,
      title: "Fence Installation",
      image: fenchinstal,
      description: "How much does fence installation cost?",
      price: "From £20",
      availableOnline: true,
    },
    {
      id: 2,
      title: "Wood Fencing",
      image: fenchinstal,
      description: "How much does wood fencing cost in 2025?",
      price: "From £18",
    },
    {
      id: 3,
      title: "Chain Link Fencing",
      image: fenchinstal,
      description: "How much does chain link fence installation cost?",
      price: "From £15",
      availableOnline: true,
    },
    {
      id: 4,
      title: "Fence Repair",
      image: fenchinstal,
      description: "Here's why you need professional fence maintenance",
      price: "Varies",
    },
  ],
  "driveway-installers": [
    {
      id: 1,
      title: "Driveway Installation",
      image: Driveway,
      description: "2025 driveway installation cost guide",
      price: "From £50",
      availableOnline: true,
    },
    {
      id: 2,
      title: "Concrete Driveways",
      image: Driveway,
      description: "How much does a concrete driveway cost?",
      price: "From £60",
    },
    {
      id: 3,
      title: "Asphalt Paving",
      image: Driveway,
      description: "Asphalt driveway installation costs",
      price: "From £55",
      availableOnline: true,
    },
    {
      id: 4,
      title: "Driveway Resurfacing",
      image: Driveway,
      description: "When to repair vs. replace your driveway",
      price: "Varies",
    },
  ],
  landscaping: [
    {
      id: 1,
      title: "Landscaping Cost in 2025",
      image: Landscaping,
      description: "How much does landscaping cost in 2025?",
      price: "From £15",
      availableOnline: true,
    },
    {
      id: 2,
      title: "Garden Design",
      image: Landscaping,
      description: "Pricing guide for garden design and makeovers",
      price: "From £25",
    },
    {
      id: 3,
      title: "Patio Installation",
      image: Patio,
      description: "Patio installation cost guide",
      price: "From £30",
      availableOnline: true,
    },
    {
      id: 4,
      title: "Fence & Gate Installation",
      image: fenchinstal,
      description: "How much does fence and gate installation cost?",
      price: "From £20",
    },
  ],
  "patio-services": [
    {
      id: 1,
      title: "Patio Installation Cost",
      image: Patio,
      description: "How much does patio installation cost in 2025?",
      price: "From £30",
      availableOnline: true,
    },
    {
      id: 2,
      title: "Patio Materials Pricing",
      image: Patio,
      description: "Cost guide for various patio materials",
      price: "Varies",
    },
    {
      id: 3,
      title: "Garden Landscaping",
      image: Landscaping,
      description: "Landscaping prices and budgeting tips",
      price: "From £15",
    },
    {
      id: 4,
      title: "Fence & Gate Installation",
      image: fenchinstal,
      description: "Cost estimates for fence and gate installation",
      price: "From £20",
    },
  ],
  "artificial-grass-installation": [
    {
      id: 1,
      title: "Artificial Grass Installation Cost",
      image: ArtificialGrass,
      description: "How much does Artificial Grass Installation cost in 2025?",
      price: "From £20",
      availableOnline: true,
    },
    {
      id: 2,
      title: "Artificial Grass Maintenance",
      image: ArtificialGrass,
      description: "Costs and tips for maintaining your artificial lawn",
      price: "Varies",
    },
    {
      id: 3,
      title: "Pet-Friendly Artificial Grass",
      image: ArtificialGrass,
      description: "Is artificial grass safe and durable for pets?",
      price: "N/A",
    },
    {
      id: 4,
      title: "Artificial Grass vs Natural Grass",
      image: ArtificialGrass,
      description: "Cost comparison and benefits overview",
      price: "Varies",
    },
  ],
};

const RELATED_SERVICES_DATA = {
  "fence-installers": [
    {
      id: 1,
      title: "Fence Installation",
      image: fenchinstal,
      description:
        "Your 2025 fence installation guide: Everything you need to know in the UK",
      availableOnline: true,
    },
    {
      id: 2,
      title: "Fence Repair",
      image: fenchinstal,
      description: "Here's why you need professional fence maintenance",
    },
    {
      id: 3,
      title: "Fence Materials",
      image: fenchinstal,
      description: "What are the best materials for fencing?",
      availableOnline: true,
    },
    {
      id: 4,
      title: "Garden Fencing",
      image: fenchinstal,
      description: "Complete guide to choosing garden fencing",
    },
  ],
  "driveway-installers": [
    {
      id: 1,
      title: "Driveway Installation",
      image: Driveway,
      description:
        "Your 2025 driveway installation guide: Everything you need to know in the UK",
      availableOnline: true,
    },
    {
      id: 2,
      title: "Driveway Repair",
      image: Driveway,
      description: "Here's why you need professional driveway maintenance",
    },
    {
      id: 3,
      title: "Driveway Materials",
      image: Driveway,
      description: "What are the best materials for driveways?",
      availableOnline: true,
    },
    {
      id: 4,
      title: "Residential Driveways",
      image: Driveway,
      description: "Complete guide to choosing residential driveways",
    },
  ],
  "patio-services": [
    {
      id: 1,
      title: "Installing a New Patio on a Budget",
      image: Patio,
      description: "Your ultimate guide to budget-friendly Patio installation",
    },
    {
      id: 2,
      title: "Material Options for Patios",
      image: Patio,
      description: "What are the different material options for Patios?",
    },
    {
      id: 3,
      title: "How to Landscape Your Garden on a Budget",
      image: Landscaping,
      description: "Top tips to save money on landscaping your outdoor space",
    },
    {
      id: 4,
      title: "What is Involved with Fence or Gate Installation?",
      image: fenchinstal,
      description: "Learn what to expect during fence or gate installation",
    },
  ],
  landscaping: [
    {
      id: 1,
      title: "How to Landscape Your Garden on a Budget",
      image: Landscaping,
      description:
        "From luscious landscaping to thrifty decor ideas, save money with our top budgeting tips",
    },
    {
      id: 2,
      title: "Garden Design Ideas",
      image: Landscaping,
      description: "Creative ideas to transform your garden this year",
    },
    {
      id: 3,
      title: "Material Options for Patios",
      image: Patio,
      description:
        "Explore different patio materials that complement your landscaping",
    },
    {
      id: 4,
      title: "Fence & Gate Installation Guide",
      image: fenchinstal,
      description:
        "Everything you need to know about fence and gate installation",
    },
  ],
  "artificial-grass-installation": [
    {
      id: 1,
      title: "A Guide to the Different Types of Artificial Grass",
      image: ArtificialGrass,
      description:
        "Your ultimate guide to the different types of Artificial Grass and the right choice for you",
    },
    {
      id: 2,
      title: "Benefits of Artificial Grass Installation",
      image: ArtificialGrass,
      description: "Why artificial grass is a smart choice for your garden",
    },
    {
      id: 3,
      title: "Artificial Grass Maintenance Tips",
      image: ArtificialGrass,
      description: "How to keep your artificial lawn looking pristine",
    },
    {
      id: 4,
      title: "Artificial Grass vs Natural Grass",
      image: ArtificialGrass,
      description: "Comparing costs, maintenance, and appearance",
    },
  ],
};

const REVIEWS_DATA = {
  "fence-installers": [
    {
      id: 1,
      name: "Daniel Kennedy",
      title: "(Residential Fencing)",
      date: "13 Feb 2025",
      image: ReviewsImage,
      description:
        "Great job on my fence! He did exactly what I wanted. Definitely recommend. I am going to use them on my next property.",
    },
    {
      id: 2,
      name: "Fatima H.",
      title: "(Commercial Fencing)",
      date: "13 Feb 2025",
      image: ReviewsImage,
      description:
        "Great job on my fence! He did exactly what I wanted. Definitely recommend. I am going to use them on my next property.",
    },
    {
      id: 3,
      name: "James Wilson",
      title: "(Garden Fencing)",
      date: "15 Mar 2025",
      image: ReviewsImage,
      description:
        "Professional fence installation with excellent results. Will hire again for future projects!",
    },
  ],
  "driveway-installers": [
    {
      id: 1,
      name: "Daniel Kennedy",
      title: "(Residential Driveway)",
      date: "13 Feb 2025",
      image: ReviewsImage,
      description:
        "I used Alan 2 weeks ago for porcelain slabs and fencing all the way around my back garden. All I can say is wow amazing service from start to finish. Would highly recommend 5",
    },
    {
      id: 2,
      name: "Fatima H.",
      title: "(Commercial Driveway)",
      date: "13 Feb 2025",
      image: ReviewsImage,
      description:
        "Professional team, great communication, and excellent workmanship. Highly recommend driveways team for their quality service and attention to detail.",
    },
    {
      id: 3,
      name: "James Wilson",
      title: "(Garden Driveway)",
      date: "15 Mar 2025",
      image: ReviewsImage,
      description:
        "Professional fence installation with excellent results. Will hire again for future projects!",
    },
  ],
  "patio-services": [
    {
      id: 1,
      name: "Daniel Kennedy",
      title: "(Patio Construction)",
      date: "10 Apr 2025",
      image: ReviewsImage,
      description:
        "I would recommend Tumbers brickwork and landscapes. Elliot and his colleague worked so hard on the hottest day to replace my old fence and did a lovely job. They also did a fence for a friend who recommended them to me as she was also very pleased.",
    },
    {
      id: 2,
      name: "Fatima H.",
      title: "(Patio Installer)",
      date: "22 Apr 2025",
      image: ReviewsImage,
      description:
        "I would recommend Tumbers brickwork and landscapes. Elliot and his colleague worked so hard on the hottest day to replace my old fence and did a lovely job. They also did a fence for a friend who recommended them to me as she was also very pleased.",
    },
    {
      id: 3,
      name: "Laura M",
      title: "(Outdoor Patio Specialist)",
      date: "5 May 2025",
      image: ReviewsImage,
      description:
        "I would recommend Tumbers brickwork and landscapes. Elliot and his colleague worked so hard on the hottest day to replace my old fence and did a lovely job. They also did a fence for a friend who recommended them to me as she was also very pleased.",
    },
  ],
  landscaping: [
    {
      id: 1,
      name: "Daniel Kennedy",
      title: "(Garden Landscaping)",
      date: "2 Mar 2025",
      image: ReviewsImage,
      description:
        "I would recommend Tumbers brickwork and landscapes. Elliot and his colleague worked so hard on the hottest day to replace my old fence and did a lovely job. They also did a fence for a friend who recommended them to me as she was also very pleased.",
    },
    {
      id: 2,
      name: "Fatima H.",
      title: "(Commercial Landscaping)",
      date: "18 Mar 2025",
      image: ReviewsImage,
      description:
        "I would recommend Tumbers brickwork and landscapes. Elliot and his colleague worked so hard on the hottest day to replace my old fence and did a lovely job. They also did a fence for a friend who recommended them to me as she was also very pleased.",
    },
    {
      id: 3,
      name: "Laura M",
      title: "(Residential Landscaping)",
      date: "30 Mar 2025",
      image: ReviewsImage,
      description:
        "I would recommend Tumbers brickwork and landscapes. Elliot and his colleague worked so hard on the hottest day to replace my old fence and did a lovely job. They also did a fence for a friend who recommended them to me as she was also very pleased.",
    },
  ],
  "artificial-grass-installation": [
    {
      id: 1,
      name: "Daniel Kennedy",
      title: "(Artificial Grass Installation)",
      date: "12 Jan 2025",
      image: ReviewsImage,
      description:
        "I would recommend Tumbers brickwork and landscapes. Elliot and his colleague worked so hard on the hottest day to replace my old fence and did a lovely job. They also did a fence for a friend who recommended them to me as she was also very pleased.",
    },
    {
      id: 2,
      name: "Fatima H.",
      title: "(Artificial Turf Specialist)",
      date: "25 Jan 2025",
      image: ReviewsImage,
      description:
        "I would recommend Tumbers brickwork and landscapes. Elliot and his colleague worked so hard on the hottest day to replace my old fence and did a lovely job. They also did a fence for a friend who recommended them to me as she was also very pleased.",
    },
    {
      id: 3,
      name: "Laura M",
      title: "(Synthetic Grass Installer)",
      date: "8 Feb 2025",
      image: ReviewsImage,
      description:
        "I would recommend Tumbers brickwork and landscapes. Elliot and his colleague worked so hard on the hottest day to replace my old fence and did a lovely job. They also did a fence for a friend who recommended them to me as she was also very pleased.",
    },
  ],
};

const OTHER_SERVICES_DATA = {
  "fence-installers": [
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
  "driveway-installers": [
    {
      id: 1,
      image: fenchinstal,
      description: "Fence & Gate Installation",
      path: "fence-installers",
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
      path: "landscaping",
      availableOnline: true,
    },
    {
      id: 4,
      image: ArtificialGrass,
      description: "Artificial Grass Installation",
      path: "artificial-grass-installation",
    },
  ],
  "patio-services": [
    {
      id: 1,
      image: fenchinstal,
      description: "Fence & Gate Installation",
      path: "fence-installers",
    },
    {
      id: 2,
      image: Driveway,
      description: "Driveway Installation",
      availableOnline: true,
      path: "driveway-installers",
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
  landscaping: [
    {
      id: 1,
      image: fenchinstal,
      description: "Fence & Gate Installation",
      path: "fence-installers",
    },
    {
      id: 2,
      image: Driveway,
      description: "Driveway Installation",
      availableOnline: true,
      path: "driveway-installers",
    },
    {
      id: 3,
      image: Patio,
      description: "Patio Services",
      path: "patio-services",
    },
    {
      id: 4,
      image: ArtificialGrass,
      description: "Artificial Grass Installation",
      path: "artificial-grass-installation",
    },
  ],
  "artificial-grass-installation": [
    {
      id: 1,
      image: fenchinstal,
      description: "Fence & Gate Installation",
      path: "fence-installers",
    },
    {
      id: 2,
      image: Driveway,
      description: "Driveway Installation",
      availableOnline: true,
      path: "driveway-installers",
    },
    {
      id: 3,
      image: Patio,
      description: "Patio Services",
      path: "patio-services",
    },
    {
      id: 4,
      image: Landscaping,
      description: "Landscaping",
      availableOnline: true,
      path: "landscaping",
    },
  ],
};

const AVERAGE_PRICE = {
  "fence-installers": [
    {
      Region: "Nationwide",
      "Great Value": "£150",
      Average: "£200",
      Premium: "£400",
    },
    {
      Region: "East Midlands",
      "Great Value": "£150",
      Average: "£150",
      Premium: "£350",
    },
    {
      Region: "East of England",
      "Great Value": "£150",
      Average: "£150",
      Premium: "£375",
    },
  ],
  "driveway-installers": [
    {
      Region: "Nationwide",
      "Great Value": "£150",
      Average: "£100",
      Premium: "£50",
    },
    {
      Region: "East Midlands",
      "Great Value": "£150",
      Average: "£170",
      Premium: "£300",
    },
    {
      Region: "East of England",
      "Great Value": "£150",
      Average: "£150",
      Premium: "£475",
    },
  ],
  "patio-services": [
    {
      Region: "Nationwide",
      "Great Value": "£120",
      Average: "£180",
      Premium: "£350",
    },
    {
      Region: "East Midlands",
      "Great Value": "£110",
      Average: "£160",
      Premium: "£320",
    },
    {
      Region: "East of England",
      "Great Value": "£115",
      Average: "£170",
      Premium: "£340",
    },
  ],
  landscaping: [
    {
      Region: "Nationwide",
      "Great Value": "£100",
      Average: "£150",
      Premium: "£300",
    },
    {
      Region: "East Midlands",
      "Great Value": "£95",
      Average: "£140",
      Premium: "£280",
    },
    {
      Region: "East of England",
      "Great Value": "£105",
      Average: "£145",
      Premium: "£310",
    },
  ],
  "artificial-grass-installation": [
    {
      Region: "Nationwide",
      "Great Value": "£80",
      Average: "£120",
      Premium: "£250",
    },
    {
      Region: "East Midlands",
      "Great Value": "£75",
      Average: "£110",
      Premium: "£230",
    },
    {
      Region: "East of England",
      "Great Value": "£85",
      Average: "£115",
      Premium: "£240",
    },
  ],
};

const FREQUENTLY_DATA = {
  "fence-installers": [
    {
      key: "1",
      title: "How long does it take to install automatic gates?",
      description:
        "Usually 2–3 days, depending on the size and complexity of the gates",
    },
    {
      key: "2",
      title: "How long does it take to install fences?",
      description: "Most standard fences can be installed in 1–3 days.",
    },
    {
      key: "3",
      title: "Do I need planning permission for driveway gates?",
      description:
        "Yes, if the gate will be taller than 1 metre and is next to a public road or footpath.",
    },
    {
      key: "4",
      title: "Do I need planning permission for fences?",
      description:
        "Yes, if the fence is more than 2 metres high, or over 1 metre and next to a road or footpath.",
    },
  ],
  "driveway-installers": [
    {
      key: "1",
      title: "How long does driveway installation take?",
      description:
        "Most driveways take 2–5 days depending on size and material.",
    },
    {
      key: "2",
      title: "Do I need planning permission for a new driveway?",
      description:
        "Not always – but you may if it affects drainage or is over a certain size.",
    },
    {
      key: "3",
      title: "How much does a driveway cost?",
      description:
        "Costs vary based on material, size, and complexity – get free quotes today.",
    },
    {
      key: "4",
      title: "What's the best material for driveways?",
      description:
        "Popular options include concrete, asphalt, block paving, and gravel – each with different benefits.",
    },
  ],
  "patio-services": [
    {
      key: "1",
      title: "How much does it cost to hire a patio contractor?",
      description:
        "The cost depends on factors like the size of the patio, the materials you choose, the complexity of the design, and your location. On average in the UK, prices can range from £50–£120 per square metre, including labour and materials.",
    },
    {
      key: "2",
      title: "Do I need planning permission for a new patio?",
      description:
        "In most cases, you don’t need planning permission for a patio, as it’s considered a permitted development. However, if your property is listed, in a conservation area, or you are altering drainage, you may need approval.",
    },
  ],
  landscaping: [
    {
      key: "1",
      title: "Do I need planning permission for landscaping?",
      description:
        "Most landscaping projects don’t require planning permission, but certain changes—like adding large structures or altering boundaries—may need approval from your local council.",
    },
    {
      key: "2",
      title: "How long does a landscaping project take?",
      description:
        "It depends on the scope. A small garden refresh may take a few days, while a full redesign could take several weeks.",
    },
  ],
  "artificial-grass-installation": [
    {
      key: "1",
      title: "How long does artificial grass installation take?",
      description:
        "Most installations are completed within 1–3 days, depending on the size of your lawn and site preparation requirements.",
    },
    {
      key: "2",
      title: "Is artificial grass pet-friendly?",
      description:
        "Yes! Quality artificial grass is safe for pets, easy to clean, and durable enough to handle active use.",
    },
  ],
};

const TAXRETURNDATA = {
  "fence-installers": {
    key: "5",
    heading1: "What is involve with fence and gate installation",
    heading2: "fence and gate installation",
    shortDes:
      "Get the low-down on what's involved in a fence and gate installation project",
    name: "Alex, Staff Writer",
    date: "2025-11-15",
  },
  "driveway-installers": {
    key: "1",
    heading1: "Creative driveway ideas",
    heading2: "Driveway installation",
    shortDes:
      "Your ultimeet guide to the hottest driveway guarantees to turn heads!",
    name: "Alex, Staff Writer",
    date: "2025-06-15",
  },
  "patio-services": {
    key: "2",
    heading1: "Installing a new Patio on a budget",
    heading2: "Patio installation",
    shortDes: "Your ultimate guide to budget-friendly Patio installation",
    name: "Alex, Staff Writer",
    date: "2021-04-21",
  },
  landscaping: {
    key: "3",
    heading1: "How to Landscape your garden on a budget",
    heading2: "Landscaping",
    shortDes:
      "From luscious landscaping to thrifty decor ideas, save money with our top budgeting tips for landscaping your outside space",
    name: "Alex, Staff Writer",
    date: "2021-03-10",
  },
  "artificial-grass-installation": {
    key: "4",
    heading1: "A guide to the different types of Artificial Grass",
    heading2: "Artificial Grass Installation",
    shortDes:
      "Your ultimate guide to the different types of Artificial Grass and the right choice for you",
    name: "Mika, Staff Writer",
    date: "2021-04-15",
  },
};

const regionsData = {
  "fence-installers": [
    {
      id: 3,
      title: "North West England",
      items: [
        { name: "Cheshire", path: "fence-installers/cheshire" },
        { name: "Greater Manchester", path: "" },
        { name: "Lancashire", path: "" },
        { name: "Merseyside", path: "" },
      ],
    },
  ],
  "driveway-installers": [
    {
      id: 3,
      title: "North West England",
      items: [
        { name: "Cheshire", path: "" },
        { name: "Greater Manchester", path: "" },
        { name: "Lancashire", path: "" },
        { name: "Merseyside", path: "" },
      ],
    },
  ],
  "patio-services": [
    {
      id: 3,
      title: "North West England",
     items: [
        { name: "Cheshire", path: "" },
        { name: "Greater Manchester", path: "" },
        { name: "Lancashire", path: "" },
        { name: "Merseyside", path: "" },
      ],
    },
  ],
  landscaping: [
    {
      id: 3,
      title: "North West England",
       items: [
        { name: "Cheshire", path: "" },
        { name: "Greater Manchester", path: "" },
        { name: "Lancashire", path: "" },
        { name: "Merseyside", path: "" },
      ],
    },
  ],
  "artificial-grass-installation": [
    {
      id: 3,
      title: "North West England",
       items: [
        { name: "Cheshire", path: "" },
        { name: "Greater Manchester", path: "" },
        { name: "Lancashire", path: "" },
        { name: "Merseyside", path: "" },
      ],
    },
  ],
};

export const POPULARCITY = {
  "fence-installers": [
    { id: 1, city_name: "Liverpool", city_image: Liverpool },
    { id: 2, city_name: "Manchester", city_image: Manchester },
    { id: 3, city_name: "Chester", city_image: Chester },
    { id: 4, city_name: "Warrington", city_image: Warrington },
    { id: 5, city_name: "Ellesmere", city_image: EllesmerePort },
  ],
  "driveway-installers": [
    { id: 1, city_name: "Liverpool", city_image: Liverpool },
    { id: 2, city_name: "Manchester", city_image: birmingham },
    { id: 3, city_name: "Chester", city_image: liverpool },
    { id: 4, city_name: "Warrington", city_image: london },
    { id: 5, city_name: "Ellesmere", city_image: london },
  ],
  "patio-services": [
    { id: 1, city_name: "Liverpool", city_image: Liverpool },
    { id: 2, city_name: "Manchester", city_image: birmingham },
    { id: 3, city_name: "Chester", city_image: liverpool },
    { id: 4, city_name: "Warrington", city_image: london },
    { id: 5, city_name: "Ellesmere", city_image: london },
  ],
  landscaping: [
    { id: 1, city_name: "Liverpool", city_image: Liverpool },
    { id: 2, city_name: "Manchester", city_image: birmingham },
    { id: 3, city_name: "Chester", city_image: liverpool },
    { id: 4, city_name: "Warrington", city_image: london },
    { id: 5, city_name: "Ellesmere", city_image: london },
  ],
  "artificial-grass-installation": [
    { id: 1, city_name: "Liverpool", city_image: Liverpool },
    { id: 2, city_name: "Manchester", city_image: birmingham },
    { id: 3, city_name: "Chester", city_image: liverpool },
    { id: 4, city_name: "Warrington", city_image: london },
    { id: 5, city_name: "Ellesmere", city_image: london },
  ],
};

const HowItWorksData = {
  "fence-installers": [
    {
      id: 1,
      title: "Find Expert Fencers Near You",
      image: WhatYouNeedIcon,
      heading1: "Find Expert Fencers Near You",
      description:
        "Share what you need and where you need it, and we’ll introduce you to local fencing specialists. Whether you’re after stylish picket fencing, secure garden panels, or a custom gate, we have trusted professionals ready to get started quickly.",
    },
    {
      id: 2,
      title: "Get Free Quotes – Fast",
      image: FreeQuotesIcon,
      heading1: "Get Free Quotes – Fast",
      description:
        "We’ll match you with vetted fencing and gate installation experts based on your requirements. You’ll receive tailored quotes from local professionals – at no cost. You can choose to get instant notifications or review your quotes whenever it suits you.",
    },
    {
      id: 3,
      title: "Choose the Right Fencer",
      image: accountant, // Note: You might want to rename this variable to 'fencerIcon' or similar
      heading1: "Choose the Right Fencer",
      description:
        "View detailed profiles, browse previous work, and read verified reviews – all in one place. Once you’ve found your perfect match, simply get in touch and finalise the job. Finding and hiring a fencer has never been easier.",
    },
  ],
  "driveway-installers": [
    {
      id: 1,
      title: "Tell Us What You Need",
      image: WhatYouNeedIcon,
      heading1: "Tell Us What You Need",
      description:
        "Let us know the type of driveway service you're after and where you need it. Whether you want a brand-new driveway installation or a quick repair, the more detail you give, the better we can match you with the right local driveway specialists.",
    },
    {
      id: 2,
      title: "Get Free Quotes from Driveway Installers",
      image: FreeQuotesIcon,
      heading1: "Get Free Quotes from Driveway Installers",
      description:
        "Using your details, we'll search our network of top-rated driveway builders in your area. You'll receive free quotes from interested professionals, matched to your exact needs. You can choose to get updates instantly or browse your options when it suits you.",
    },
    {
      id: 3,
      title: "Hire the Right Installer",
      image: accountant, // Consider renaming to 'installerIcon' for consistency
      heading1: "Hire the Right Installer",
      description:
        "Check customer reviews, view examples of past work, and request further information - all in one place. With everything you need at your fingertips, finding the best driveway installers near me has never been easier. Once you've found your perfect match, simply confirm and get your project started.",
    },
  ],
  "patio-services": [
    {
      id: 1,
      title: "Tell Us What You Need",
      image: WhatYouNeedIcon,
      heading1: "Tell Us What You Need",
      description:
        "Share the type of patio service you’re looking for and your location. Not sure what’s best for your space? We can connect you with an experienced patio specialist who can guide you on design options, materials, and costs based on your preferences, budget, and property.",
    },
    {
      id: 2,
      title: "Receive Free Quotes",
      image: FreeQuotesIcon,
      heading1: "Receive Free Quotes",
      description:
        "We’ll search through a network of quality patio contractors near you and match you with the best fit. You’ll receive tailored quotes from interested professionals at no cost. Choose to get notifications instantly or review your offers whenever it suits you.",
    },
    {
      id: 3,
      title: "Hire with Confidence",
      image: accountant, // Consider renaming for clarity if needed
      heading1: "Hire with Confidence",
      description:
        "View reviews, explore examples of previous work, and request more information—all in one place. Once you’ve found the right contractor, hiring them is quick and straightforward.",
    },
  ],
  landscaping: [
    {
      id: 1,
      title: "Find a Landscaper Near You",
      image: WhatYouNeedIcon,
      heading1: "Find a Landscaper Near You",
      description:
        "Tell us what you need and where you need it, and we’ll do the searching for you. Whether you dream of a classic English rose garden, a modern outdoor living space, or a low-maintenance design, provide as many details as possible so we can match you with the ideal landscaping specialist in your area.",
    },
    {
      id: 2,
      title: "Get Free Quotes from Local Landscapers",
      image: FreeQuotesIcon,
      heading1: "Get Free Quotes from Local Landscapers",
      description:
        "We’ll review hundreds of landscaping experts near you and handpick the best matches for your project. You’ll receive free, no-obligation quotes from interested professionals. You can choose to get instant notifications or check your quotes whenever it suits you.",
    },
    {
      id: 3,
      title: "Hire with Confidence",
      image: accountant,
      heading1: "Hire with Confidence",
      description:
        "Check reviews, see before-and-after photos, and explore detailed profiles—all in one place. With all the information at your fingertips, hiring the right landscaper becomes simple. Once you’ve found your match, you can get started transforming your outdoor space.",
    },
  ],
  "artificial-grass-installation": [
    {
      id: 1,
      title: "Tell Us Your Needs",
      image: WhatYouNeedIcon,
      heading1: "Tell Us Your Needs",
      description:
        "Share your requirements, and we’ll match you with the most suitable installers in your area.",
    },
    {
      id: 2,
      title: "Get Free Quotes",
      image: FreeQuotesIcon,
      heading1: "Get Free Quotes",
      description:
        "Receive multiple free quotes from professionals, plus instant updates via our website or app. We do all the hard work for you.",
    },
    {
      id: 3,
      title: "Choose Your Installer",
      image: accountant,
      heading1: "Choose Your Installer",
      description:
        "Compare reviews, check credentials, and speak directly with providers before making your choice.",
    },
  ],
};

const CONTENT_CONFIG = {
  "fence-installers": {
    para1:
      "Find skilled fencing professionals in your area with Localists.com – and get free, no-obligation quotes in minutes.",
    para2:
      "Not sure where to begin? Just tell us a little about your project, and we’ll connect you with reliable fencing experts near you. There’s no pressure to hire – you can compare profiles, read genuine customer reviews, and request extra details before making your choice.",
    para3: "It's super fast and easy!",
  },
  "driveway-installers": {
    para1: "",
    para2:
      "Looking for a skilled driveway installer but not sure where to start? At Localists, we make it simple. Tell us about your project, and we'll connect you with trusted driveway contractors near you - all with no pressure to hire. Compare profiles, read genuine reviews, and request more details before making your choice.",
    para3: "Best of all - our service is completely free!",
  },
  "patio-services": {
    para1:
      "Looking for a skilled patio contractor? We make it simple. Start your search today and get free, no-obligation quotes from local experts.",
    para2:
      "If it’s your first time hiring a patio installer and you’re not sure where to begin, just tell us about your project. We’ll send you a shortlist of trusted contractors to review. Take your time, compare profiles, read genuine customer reviews, and request more details before making your choice.",
    para3: "Best of all – it’s completely free!",
  },
  landscaping: {
    para1:
      "Looking for a skilled landscaper but not sure where to begin? At Localists.com, we make it easy. Simply tell us about your project, and we’ll connect you with trusted local landscaping professionals. Compare quotes, browse reviews, and view past work—all at no cost to you. There’s no pressure to hire until you’re ready.",
    para2: "",
    para3: "Best of all – it’s completely free!",
  },
  "artificial-grass-installation": {
    para1:
      "Looking for top-quality Artificial Grass Installers? Start your search today and get free, no-obligation quotes in minutes!",
    para2:
      "If it’s your first time hiring an Artificial Grass Installer and you’re unsure where to begin, simply tell us about your project. We’ll connect you with trusted local professionals so you can review profiles, read real customer feedback, and request more details—without any pressure to commit.",
    para3: "Best of all – it’s completely free!",
  },
};

const BREADCRUMB_CONFIG = {
  "fence-installers": [
    { title: "Home & Garden", path: "/home" },
    { title: "Builders", path: "/builders" },
    { title: "Fence & Gate Installation", path: "fence-installers" }, // no path for last item
  ],
  "driveway-installers": [
    { title: "Home & Garden", path: "/home" },
    { title: "Builders", path: "/builders" },
    { title: "Driveway Installation", path: "driveway-installers" }, // no path
  ],
  "patio-services": [
    { title: "Home & Garden", path: "/home" },
    { title: "Builders", path: "/builders" },
    { title: "Patio & Paving Services", path: "patio-services" }, // no path
  ],
  landscaping: [
    { title: "Home & Garden", path: "/home" },
    {
      title: "Gardening & Landscaping",
      path: "/gardening-landscaping",
    },
    { title: "Landscaping", path: "landscaping" }, // no path
  ],
  "artificial-grass-installation": [
    { title: "Home & Garden", path: "/home" },
    {
      title: "Gardening & Landscaping",
      path: "/gardening-landscaping",
    },
    {
      title: "Artificial Grass Installation",
      path: "artificial-grass-installation",
    }, // no path
  ],
};

const CONTENT_CONFIG_TOP = {
  "fence-installers": {
    accountHeader: "Fence Installation",
    title: "Fencer",
    mainTitle: "Fencer",
  },
  "driveway-installers": {
    accountHeader: "Driveway Installation",
    title: "Driveway Installer",
    mainTitle: "Driveway Installer",
  },
  "patio-services": {
    accountHeader: "Patio Construction",
    title: "Patio and Paving Service",
    mainTitle: "Patio and Paving Service",
  },
  landscaping: {
    accountHeader: "Landscaping",
    title: "Landscaper",
    mainTitle: "Landscape Gardener",
  },
  "artificial-grass-installation": {
    accountHeader: "Artificial Grass Installation",
    title: "Artificial Grass Installer",
    mainTitle: "Artificial Installer",
  },
};

const CONTENT_CONFIG_BANNER = {
  "fence-installers": {
    banner: FenceGateInstallationBanner,
    reltatedImage: fenchinstal,
  },
  "driveway-installers": {
    banner: DrivewayInstallationBanner,
    reltatedImage: Driveway,
  },
  "patio-services": {
    banner: PatioServicesBanner,
    reltatedImage: Patio,
  },
  landscaping: {
    banner: LandscapingBanner,
    reltatedImage: Landscaping,
  },
  "artificial-grass-installation": {
    banner: ArtificialGrassBanner,
    reltatedImage: ArtificialGrass,
  },
};

const CONTENT_CONFIG_META = {
  "fence-installers": {
    title: "Fencers Near Me | Find Fence Installers - Localists",
    name: "description",
    content:
      "Find top-rated local fencers for fence and gate installation. Compare quotes, read reviews, and hire professionals near you with Localists.",
  },
  "driveway-installers": {
    title:
      "Driveway Installers Near Me | Professional Paving Services - Localists",
    name: "description",
    content:
      "Find experienced driveway installation professionals. Compare quotes for concrete, asphalt, and block paving services from local driveway specialists.",
  },
  "patio-services": {
    title: "Patio Construction Near Me | Local Patio Installers - Localists",
    name: "description",
    content:
      "Find trusted patio installers near you. Localists connects you with skilled patio contractors for stunning patio construction and paving. Get free quotes today!",
  },
  landscaping: {
    title: "Landscape Gardeners Near Me | Local Garden landscaper - Localists",
    name: "description",
    content:
      "Find skilled landscape gardeners near you for stunning outdoor designs, lawn care, and garden makeovers. Quality local services at affordable rates.",
  },
  "artificial-grass-installation": {
    title:
      "Artificial Grass Installation | Find Installers Near You - Localists",
    name: "description",
    content:
      "Find trusted artificial grass installers near you with Localists. Get free quotes for expert artificial grass installation and transform your outdoor space today.",
  },
};
const FIND_SERVICE_CONTENT = {
  "fence-installers": [
    {
      type: "h2",
      text: "Find Local Fence & Gate Installers Near You",
    },
    {
      type: "p",
      text: "Add privacy, security, and style to your property with expertly installed fences and gates. Whether you need to define your boundaries, enhance kerb appeal, or improve safety, Localists.com will connect you with trusted local professionals who can help keep your home looking smart and feeling secure",
    },
    {
      type: "h3",
      text: "Installation Times and Planning Permission",
    },
    {
      type: "p",
      text: "The time it takes to install a fence or gate depends on the type of project. Automatic gates generally take between two and three days to fit, while most fences can be installed in as little as one to three days. In some cases, planning permission is required. For example, you will need permission if your driveway gates are taller than one metre and located next to a public road or footpath. Similarly, you will need permission if your fence exceeds two metres in height, or more than one metre if it borders a road or public pathway",
    },
    {
      type: "h3",
      text: "Costs and Choosing the Right Option",
    },
    {
      type: "p",
      text: "The cost of fence and gate installation varies depending on the size, style, and materials you choose. Your installer will be able to provide expert advice on the full range of options, helping you find the most suitable solution for your needs and budget. Many homeowners choose to install fences and gates for several reasons. Privacy is a key consideration, giving you peace of mind both inside your home and when enjoying your garden. Security is another major factor, as strong fencing and gates can deter intruders, prevent wildlife from entering your property, and keep pets and children safe. They also mark clear property boundaries, helping to avoid disputes with neighbours, and can add instant visual appeal, potentially increasing the value of your home.",
    },
    {
      type: "h3",
      text: "Types of Fencing",
    },
    {
      type: "p",
      text: "There are many different styles of fencing available. Solid fence panels, such as Closeboard or Feather Edge designs, provide complete privacy and robust security. Decorative or semi-solid panels, including Venetian and Louvre styles, allow light and air to pass through while adding visual charm. Trellis fencing is ideal for plant lovers, allowing climbing greenery to flourish and sunlight to filter through the upper sections. Picket fencing, a traditional favourite for front gardens, enhances the appearance of a home while providing light security.",
    },
    {
      type: "h3",
      text: "Types of Gates",
    },
    {
      type: "p",
      text: "Gates are equally versatile and are available in wood, aluminium, steel, PVC, and wrought iron, with options for both manual and automatic operation. Sliding gates are perfect for properties with limited space, opening smoothly to the side. Swing gates bring classic style and can be fitted with manual or automated mechanisms. Retractable gates are a practical choice for compact areas, folding neatly away, while vertical pivot gates offer a striking and space-saving solution",
    },
    {
      type: "h2",
      text: "Find trusted fence & gate installers near you today.",
    },
    {
      type: "p",
      text: "Get free quotes, compare reviews, and choose the right professional for your home – all in one place at Localists.com.",
    },
  ],

  "driveway-installers": [
    {
      type: "h2",
      text: "Find Recommended Driveway Installers Near You",
    },
    {
      type: "p",
      text: "Whether you’re exploring new driveway ideas, need a quick repair, or want advice on planning permission for a new driveway, Localists can connect you with trusted driveway installation experts near you. Our network of skilled professionals can guide you through every step – from design and material selection to installation and finishing touches.",
    },
    {
      type: "h3",
      text: "How Much Does It Cost to Install a New Driveway?",
    },
    {
      type: "p",
      text: "The price of a new driveway depends on several factors, including:\nThe type of material you choose (resin, gravel, block paving, tarmac, or concrete)\n\nYour location and local labour rates\n\nThe size and layout of your driveway\n\nAny additional features, such as driveway drainage, lighting, electric gates, or even a heated surface\n\nA professionally installed driveway is more than just a home improvement – it can significantly boost your property’s kerb appeal and increase its market value, making it a worthwhile investment if you’re planning to sell in the future.",
    },
  ],

  "patio-services": [
    {
      type: "h2",
      text: "Create the Outdoor Space You’ve Been Dreaming Of",
    },
    {
      type: "p",
      text: "Whether you’re planning a stylish al-fresco dining area or want to add structure and charm to your garden, we’ll help you find reliable local patio installers.\nFind trusted patio contractors today and bring your vision to life.",
    },
  ],

  landscaping: [
    {
      type: "h2",
      text: "Transform Your Garden Today",
    },
    {
      type: "p",
      text: "From small garden makeovers to large-scale landscaping projects, we’ll connect you with skilled landscapers who can bring your vision to life. Whether it’s a new patio, fresh planting, or a complete garden redesign, our experts can add beauty, functionality, and value to your property.",
    },
    {
      type: "h3",
      text: "How Much Does Landscaping Cost?",
    },
    {
      type: "p",
      text: "On average, UK garden landscapers charge between £20 and £25 per hour. Prices can vary depending on location, project size, and the complexity of the design.\n\nIf you’d like a more detailed breakdown, our Landscaping Cost Guide explains hourly rates, typical services included, and how to budget for your garden transformation.",
    },
  ],

  "artificial-grass-installation": [
    {
      type: "h2",
      text: "Find Artificial Grass Installation near you",
    },
    {
      type: "p",
      text: "Artificial grass is a fantastic way to maintain your garden. Keeping on top of your lawn can be tricky, especially with the forces of nature making your job even harder. With an artificial lawn, you can keep your garden looking pristine the whole year-round. Thankfully, finding the right artificial lawn installation specialist isn’t difficult - Localists can help you get free quotes in a matter of minutes.",
    },
  ],
};
const LEVEL_THIRD_SERVICES_NAME = {
  "fence-installers": "Fence & Gate Installation",
  "driveway-installers": "Driveway Installation",
  "patio-services": "Patio Services",
  landscaping: "Landscaping",
  "artificial-grass-installation": "Artificial Grass Installation",
};

export {
  POPULAR_CITIES,
  regionsData,
  AVERAGE_PRICE,
  HowItWorksData,
  FREQUENTLY_DATA,
  OTHER_SERVICES_DATA,
  RELATED_SERVICES_DATA,
  RELATED_PRICE_DATA,
  REVIEWS_DATA,
  TAXRETURNDATA,
  CONTENT_CONFIG,
  BREADCRUMB_CONFIG,
  CONTENT_CONFIG_TOP,
  CONTENT_CONFIG_BANNER,
  CONTENT_CONFIG_META,
  FIND_SERVICE_CONTENT,
  LEVEL_THIRD_SERVICES_NAME,
};
