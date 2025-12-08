import gardening from "../assets/Images/gardening.svg";
import houseCleaning from "../assets/Images/houseCleaner.svg";
import paintingServices from "../assets/Images/painting.svg";
import personalTrainers from "../assets/Images/personalTrainer.svg";
import counselling from "../assets/Images/consultingService.svg";
import massageTherapy from "../assets/Images/massageTherapy.svg";
import weddingPhotography from "../assets/Images/weddingPhotoshoot.svg";
import dj from "../assets/Images/dj.svg";
import magician from "../assets/Images/magician.svg";
import webDesign from "../assets/Images/webDesign.svg";
import accounting from "../assets/Images/accounting.svg";
import socialMediaMarketing from "../assets/Images/socialMediaMarketer.svg";
import homeIcon from "../assets/Images/home.png";
import healthIcon from "../assets/Images/healthcare.png";
import weddingIcon from "../assets/Images/wine.png";
import businessIcon from "../assets/Images/building.png";
import lessionIcon from "../assets/Images/ideas.png";
import otherIcon from "../assets/Images/box.png";
import formStep from "../assets/Images/formStep.png";
import quoteStep from "../assets/Images/conactStep.png";
import compareStep from "../assets/Images/compareStep.svg";

const services = [
  {
    type: "House & Garden",
    services: [
      {
        title: "Gardening",
        image: gardening,
      },
      {
        title: "House Cleaning",
        image: houseCleaning,
      },
      {
        title: "Painting Services",
        image: paintingServices,
      },
    ],
  },
  {
    type: "Health & Wellness",
    services: [
      {
        title: "Personal Trainers",
        image: personalTrainers,
      },
      {
        title: "Counselling",
        image: counselling,
      },
      {
        title: "Massage Therapy",
        image: massageTherapy,
      },
    ],
  },
  {
    type: "Events & Entertainers",
    services: [
      {
        title: "Wedding Photography",
        image: weddingPhotography,
      },
      {
        title: "DJ",
        image: dj,
      },
      {
        title: "Magician",
        image: magician,
      },
    ],
  },
  {
    type: "Business",
    services: [
      {
        title: "Web Design",
        image: webDesign,
      },
      {
        title: "Accounting",
        image: accounting,
      },
      {
        title: "Social Media Marketing",
        image: socialMediaMarketing,
      },
    ],
  },
];

const SERVICE_CATEGORIES = [
  {
    id: 1,
    name: "Home & Garden",
    icon: homeIcon,
  },
  {
    id: 2,
    name: "Health & Wellbeing",
    icon: healthIcon,
  },
  {
    id: 3,
    name: "Weddings & Events",
    icon: weddingIcon,
  },
  {
    id: 4,
    name: "Business Services",
    icon: businessIcon,
  },
  {
    id: 5,
    name: "Lessons & Training",
    icon: lessionIcon,
  },
  {
    id: 6,
    name: "Other services",
    icon: otherIcon,
  },
];

const WORK_STEPS = [
  {
    id: 1,
    icon: formStep,
    description: "Click get a free quote below and fill in your details",
  },
  {
    id: 2,
    icon: quoteStep,
    description: "Receive quotes from leading suppliers",
  },
  {
    id: 3,
    icon: compareStep,
    description: "Compare your quotes and enjoy great savings!",
  },
];

export { services, SERVICE_CATEGORIES, WORK_STEPS };
