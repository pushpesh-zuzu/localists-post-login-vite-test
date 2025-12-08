import HouseCleaning from "../assets/Images/ServicePanel/HouseCleaning.svg";
import LifeCoaching from "../assets/Images/ServicePanel/LifeCoaching.svg";
import WebDesign from "../assets/Images/ServicePanel/WebDesign.svg";
import GeneralPhotography from "../assets/Images/ServicePanel/GeneralPhotography.svg";
import WebDevelopment from "../assets/Images/ServicePanel/WebDevelopment.svg";
import SocialMediaMarketing from "../assets/Images/ServicePanel/SocialMediaMarketing.svg";
import BookkeepingServices from "../assets/Images/ServicePanel/BookkeepingServices.svg";
import GeneralBuilders from "../assets/Images/ServicePanel/GeneralBuilders.svg";
import GraphicDesign from "../assets/Images/ServicePanel/GraphicDesign.svg";
import PersonalTrainers from "../assets/Images/ServicePanel/PersonalTrainers.svg";
import Gardening from "../assets/Images/ServicePanel/Gardening.svg";
import CommercialAndOfficeCleaning from "../assets/Images/ServicePanel/CommercialAndOfficeCleaning.svg";
import GetQualityLeads from "../assets/Images/ServicePanel/GetQualityLeads.png";
import WinNewClients from "../assets/Images/ServicePanel/WinNewClients.png";
import GrowYourBusiness from "../assets/Images/ServicePanel/GrowYourBusiness.png";
import StefanWesley from "../assets/Images/ServicePanel/StefanWesley.png";
import LeanneOsbourne from "../assets/Images/ServicePanel/LeanneOsbourne.png";
import RichardGray from "../assets/Images/ServicePanel/RichardGray.png";

const PopularServiceData = [
  {
    id: 1,
    title: "House Cleaning",
    image: HouseCleaning,
  },
  {
    id: 2,
    title: "Life Coaching",
    image: LifeCoaching,
  },
  {
    id: 3,
    title: "Web Design",
    image: WebDesign,
  },
  {
    id: 4,
    title: "General Photography",
    image: GeneralPhotography,
  },
  {
    id: 5,
    title: "Web Development",
    image: WebDevelopment,
  },
  {
    id: 6,
    title: "Social Media Marketing",
    image: SocialMediaMarketing,
  },
  {
    id: 7,
    title: "Graphic Design",
    image: GraphicDesign,
  },
  {
    id: 8,
    title: "Bookkeeping Services",
    image: BookkeepingServices,
  },
  {
    id: 9,
    title: "General Builders",
    image: GeneralBuilders,
  },
  {
    id: 10,
    title: "Personal Trainers",
    image: PersonalTrainers,
  },
  {
    id: 11,
    title: "Gardening",
    image: Gardening,
  },
  {
    id: 12,
    title: "Commercial & Office Cleaning",
    image: CommercialAndOfficeCleaning,
  },
];

const GrowthStepsData = [
  {
    id: 1,
    image: GetQualityLeads,
    title1: "Quality leads",
    title2: "you can trust",
    Description1: "See real client requests near you or nationwide.",
    Description2: "Preview leads for free before spending credits.",
        Description3: "Get new opportunities the moment they’re posted.",

    button: "How it works",
    path:"how-it-works-for-sellers"
  },
  {
    id: 2,
    image: WinNewClients,
    title1: "Win clients",
    title2: "without the chase",
    Description1: "Choose the jobs that work for your schedule and skills.",
    Description2:"Connect directly with clients,  no middlemen.",
    Description3:"Unlock contacts with credits and get working fast.",
    button: "See an example lead",
  },
  {
    id: 3,
    image: GrowYourBusiness,
    title1: "Grow your business,",

    title2: "your way",
    Description1: "Keep every penny you earn, no commissions",
    Description2: "No commission or hidden fees",
    Description3: "First-lead guarantee so you can start with confidence.",
    button: "See more about pricing",
     path: "sellers/pricing"
  },
];

const CustomerSuccessStoriesData = [
  {
    id: 1,
    image: StefanWesley,
    description:
      "Localists brought us our biggest client. Now, most of our new work comes through the platform, it’s been such a game changer for my business.",
    name: "Sarah Patel, ",
    company: "Web Designer",
  },
  {
    id: 2,
    image: RichardGray,
    description:
      "Over 80% of my home gardening contracts started here. The clients come to me, and I get to choose who I want to work with.",
    name: "James Turner",
    company: "Home & Garden Services",
  },
  {
    id: 3,
    image: LeanneOsbourne,
    description:
      "It’s hands-down the most effective way I’ve found to grow. Consistent leads, reliable clients, and real results.",
    name: "Sheila C,",
    company: "Personal Trainer",
  },
];

export { PopularServiceData, GrowthStepsData, CustomerSuccessStoriesData };
