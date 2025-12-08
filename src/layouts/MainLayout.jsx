import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../component/common/navbar/Navbar";
import Footer from "../component/common/footer/Footer";
import MetaHelmet from "../component/common/helmet/metaHelmet";
import { useEffect } from "react";
import ScrollToTop from "../routes/ScrollToTop";
import NavigationDetectorWithConfirmations from "../component/common/navigationDetected/NavigationDetectorWithConfirmations";

const pageTitles = {
  "/": {
    title: "Localists.com: Find Trusted Local Services and Professionals",
    description:
      "Connect with verified local experts through Localists.com. Find trusted professionals, compare quotes, and hire the best for your project—quick, easy, and free.",
  },
  "/login": {
    title: "Localists Login | Access Your Account",
    description:
      "Log in to your Localists account to manage leads, connect with customers, and grow your business with trusted local opportunities.",
  },
  "/sellers/dashboard": {
    title: "Localists.com - Connect with Customers & Grow Your Business",
    description:
      "Join Localists for free and connect with customers actively searching for talented professionals like you. Pitch confidently and grow your business today.",
  },
  "/category": {
    title: "Categories | Localists",
    description: "",
  },
  "/view-profile": {
    title: "Localists.com - View Profile",
    description: "",
  },
  "/sub-category": {
    title: "Sub Categories | Localists",
    description: "",
  },
  "/location": {
    title: "Locations | Localists",
    description: "",
  },
  // "/how-it-works": {
  //   title: "How It Works | Localists",
  //   description: "",
  // },
  
  "/sellers/create": {
    title: "Join Localists for Professionals | Free Sign-Up",
    description:
      "Join Localists free as a professional. Get verified leads with no hidden fees. Pay only for the customers you want and keep all your earnings.",
  },
  "/buyers/create": {
    title: "Localists.com - Create Your Request",
    description:
      "Find trusted local service professionals with Localists. Get free quotes quickly for your home, business, garden, or Lesson & trainings needs.",
  },
  "/user/settings": {
    title: "Localists.com - Account Settings",
    description:
      "Update your Localists profile, customize notification preferences, manage security settings, and personalize your experience—your account, your way.”",
  },
  "/user/notification": {
    title: "Localists.com - Notification Settings",
    description:
      "Manage your Localists notification preferences - choose how you receive updates about leads, alerts, and messages to stay informed your way.",
  },
  "/privacy-policy": {
    title: "Localists.com - Privacy Policy",
    description: "",
  },
  "/settings/leads/my-services": {
    title: "Localists.com - Settings - Lead Settings",
    description:
      "Control how you receive leads on Localists. Adjust preferences, manage notifications, and optimise settings to connect with the right customers.",
  },
  "/sellers/leads/save-for-later": {
    title: "Localists.com - Save Leads for Later & Organize Your Leads",
    description:
      "Keep track of valuable leads by saving them for later on Localists. Return when you're ready and stay organized.",
  },
  "/sellers/leads/my-responses": {
    title: "Localists.com - My Responses",
    description:
      "Manage and track your responses to customer leads on Localists. Review past messages, follow up quickly, and grow your business with timely replies.",
  },
  "/sellers/leads": {
    title: "Localists.com - Manage Your Leads & Connect with Customers",
    description:
      "Access your local leads for free to view, manage, and respond to customer leads efficiently. Manage all your leads effortlessly from one dashboard.",
  },
  "/settings": {
    title: "Localists.com - Settings",
    description:
      "Manage your Localists account preferences—update your profile, notification settings, and more to customize your experience.",
  },
  "/settings/profile/my-profile": {
    title: "Localists.com - Settings - My Profile",
    description:
      "Manage and update your Localists profile. Edit personal details, showcase your expertise, and keep your information accurate to attract more customers.",
  },
  "/settings/profile/account-details": {
    title: "Localists.com - Settings - Account Details",
    description:
      "Easily update your Localists account details. Keep your login, security, and personal information up to date for a seamless experience.",
  },
  "/settings/billing/my-credits": {
    title: "Localists.com - Settings - My Credits",
    description:
      "Track and manage your Localists credits. View balances, monitor usage, and stay in control of your spending while growing your business.",
  },
  "/settings/billing/invoice-billing-details": {
    title: "Localists.com - Settings - Invoice Billing Details",
    description:
      "Access and manage your Localists invoices and billing history. Download receipts, view past payments, and stay organised with your account records.",
  },
  "/settings/billing/payment-details": {
    title: "Localists.com - Settings - Payment Details",
    description:
      "Securely manage your Localists payment methods. Update card information, add new payment options, and ensure smooth transactions every time.",
  },
  "/settings/notifications/e-mail-notification": {
    title: "Localists.com - Settings - Email Notification",
    description:
      "Customise your Localists email notification preferences. Stay updated on leads, messages, and platform updates without overwhelming your inbox.",
  },
  "/settings/notifications/browser-notification": {
    title: "Localists.com - Settings - Browser Notification",
    description:
      "Manage your Localists browser notifications. Choose real-time alerts for new leads and updates, so you never miss an opportunity.",
  },
  "/help-center": {
    title: "Localists.com - Help",
    description: "",
  },
  "/feedback/questions": {
    title: "Localists.com - Feedback Questions",
    description:
      "Explore customer feedback questions on Localists. Review insights, share experiences, and help improve services by engaging with our feedback platform.",
  },
  "/feedback/questions/new": {
    title: "Localists.com - Submit a New Feedback Question",
    description:
      "Share your thoughts and experiences on Localists by submitting a new feedback question. Help shape better services for local professionals and customers.",
  },
  "/feedback/questions/edit": {
    title: "Localists.com - Edit Feedback Question",
    description:
      "Update and refine your existing feedback on Localists. Edit your questions to ensure your voice is heard and your experience is accurately shared.",
  },
  "/feedback/questions/remove": {
    title: "Localists.com - Remove Feedback Question",
    description:
      "Manage your contributions on Localists by removing feedback questions you no longer wish to share. Keep your profile and insights up to date.",
  },
  "/fencing-contractors-near-me": {
    title: "Fencing Companies & Fencing Contractors Near Me | Localists",
    description:
      "Searching for secure fence and gate installation experts near you? Get matched instantly with fencing companies  in your area on localists using free quotes.",
  },
  "/driveway-installers-near-me": {
    title: "Find Driveway Companies & Driveway Contractors Near Me - Localists",
    description:
      " Find the best local driveway installers and contractors near you. Need resin bound, gravel or tarmac driveways? Get free quotes from local specialists nearby.",
  },
  "/patio-layers-near-me": {
    title: "Find Patio Contractors and Patio Layers Near me | Localists",
    description:
      "Looking for patio installers near you? Find trusted patio contractors and patio layers in your local area. Get free quotes and start today at Localists.",
  },

  "/landscape-gardeners-near-me": {
    title: "Find Landscape Gardeners Near Me - Localists",
    description:
      "Looking to hire expert landscape gardeners or landscape architects in your local area? Start today at Localists. Obtain free no obligation quotes.",
  },
  "/artificial-grass-installers-near-me": {
    title: " Find Artificial Grass Installers Near Me - Localists",
    description:
      "Get instant quotes from artificial grass installation specialists near you. View their past projects and read reviews before you hire. Get started today at Localists",
  },
  "/home": {
    title: "Find Trusted Home & Garden Professionals Near Me - Localists",
    description:
      "Need help finding Home & Garden professionals, consultants, or expert local services near you? Get free quotes now at Localists. It's quick, easy & free.",
  },
  "/transportation-services": {
    title:
      "Transportation Services Near Me | Find Local Professionals - Localists",
    description:
      "Find reliable transportation services near you. Get free quotes for removals, airport transfers, coach hire and more.",
  },
  "/airport-transfers-near-me": {
    title: "Free Quotes on Holiday Transfers and Airport Transfers Near You",
    description:
      "Need airport taxi or airport transfer service? Get instant quotes from trusted transport providers to all major UK airports. Start search at Localists.",
  },
  "/gutter-cleaning-near-me": {
    title: "Find Gutter Cleaning Near Me | Localists",
    description:
      "Find professional gutter cleaners near you who can help deal with dirt and debris in your gutters. Click to get free quotes from gutter cleaners in your area now.",
  },
  "/landscaping_ppc": {
    title: "Compare Free Quotes from Local Landscapers | Localists",
    description:
      "Compare free quotes from trusted local landscapers in seconds. Submit your details and get matched with top-rated landscapers near you – quick, easy, and hassle-free!",
  },
  "/patio_services_ppc": {
    title: "Compare Free Quotes from Local Patio Companies | Localists",
    description:
      "Find trusted patio companies near you. Compare free quotes and hire the best experts for patio design, installation, and repairs – fast and easy!",
  },
  "/artificial_grass_installation_ppc": {
    title:
      "Compare Free Quotes from Local Artificial Grass Companies | Localists",
    content:
      "Find trusted artificial grass companies near you. Compare free quotes, read reviews, and hire the best professionals for your garden project today.",
  },
  "/fencing_ppc": {
    title: "Compare Free Quotes from Local Fencing Companies | Localists",
    description:
      "Get free quotes from top fencing companies. Compare local professionals, read reviews, and hire trusted experts – quick and hassle-free.",
  },
  "/driveways_ppc": {
    title: "Compare Free Quotes from Local Driveway Companies | Localists",
    description:
      "Get free quotes from trusted local driveway companies. Compare prices, read reviews, and hire top-rated professionals near you – quick and simple.",
  },
  "/gates_ppc": {
    title: "Compare Free Quotes from Local Gating Companies | Localists",
    description:
      "Get free quotes from top gating companies. Compare local professionals, read reviews, and hire trusted experts – quick and hassle-free.",
  },

  "/landscaping_awin": {
    title: "Compare Free Quotes from Local Landscapers | Localists",
    description:
      "Compare free quotes from trusted local landscapers in seconds. Submit your details and get matched with top-rated landscapers near you – quick, easy, and hassle-free!",
  },
  "/patio_services_awin": {
    title: "Compare Free Quotes from Local Patio Companies | Localists",
    description:
      "Find trusted patio companies near you. Compare free quotes and hire the best experts for patio design, installation, and repairs – fast and easy!",
  },
  "/artificial_grass_installation_awin": {
    title:
      "Compare Free Quotes from Local Artificial Grass Companies | Localists",
    content:
      "Find trusted artificial grass companies near you. Compare free quotes, read reviews, and hire the best professionals for your garden project today.",
  },
  "/fencing_awin": {
    title: "Compare Free Quotes from Local Fencing Companies | Localists",
    description:
      "Get free quotes from top fencing companies. Compare local professionals, read reviews, and hire trusted experts – quick and hassle-free.",
  },
  "/driveways_awin": {
    title: "Compare Free Quotes from Local Driveway Companies | Localists",
    description:
      "Get free quotes from trusted local driveway companies. Compare prices, read reviews, and hire top-rated professionals near you – quick and simple.",
  },
  "/gates_awin": {
    title: "Compare Free Quotes from Local Gating Companies | Localists",
    description:
      "Get free quotes from top gating companies. Compare local professionals, read reviews, and hire trusted experts – quick and hassle-free.",
  },
  "/resin_driveways_ppc": {
    title: "Compare Free Resin Driveway Quotes | Localists",
    description:
      "Get free quotes from trusted local resin driveway companies. Compare prices, read reviews, and hire top-rated professionals near you – quick and simple.",
  },
  "/tarmac_driveways_ppc": {
    title: "Compare Free Tarmac Driveway Quotes | Localists",
    description:
      "Get free quotes from trusted local tarmac driveway companies. Compare prices, read reviews, and hire top-rated professionals near you – quick and simple.",
  },
  "/concrete_driveways_ppc": {
    title: "Compare Free Concrete Driveway Quotes | Localists",
    description:
      "Get free quotes from trusted local concrete driveway companies. Compare prices, read reviews, and hire top-rated professionals near you – quick and simple.",
  },
  "/block_paving_driveways_ppc": {
    title: "Compare Free Block Paving Driveway Quotes | Localists",
    description:
      "Get free quotes from trusted local block paving driveway companies. Compare prices, read reviews, and hire top-rated professionals near you – quick and simple.",
  },
  "/property-extensions-near-me": {
    title: "House Extension Builders Near Me | Localists",
    description:
      "Looking for quality house extension builders near you? Start now and get free quotes in minutes for your perfect extension! ",
  },
  "/bookkeepers-near-me": {
    title: "Bookkeepers Near Me | Local Bookkeeping Services | Localists",
    description:
      "Looking for expert bookkeepers near you? Save time and find qualified bookkeepers in locally or nationwide with Localists. Get quotes in minutes at no cost.",
  },
  "/accountants-near-me": {
    title: "Accountants Near Me | Find Chartered Accountants | Localists",
    description:
      "Get free quotes from certified accountants near you or nationally. Get help with tax returns, VAT and more…",
  },
  "/landscaping-landing-ppc": {
    title: "Compare Free Quotes from Local Landscapers | Localists",
    description:
      "Compare free quotes from trusted local landscapers in seconds. Submit your details and get matched with top-rated landscapers near you – quick, easy, and hassle-free!",
  },
  "/fencing-landing-ppc": {
    title: "Compare Free Quotes from Local Fencing Companies | Localists",
    description:
      "Get free quotes from top fencing companies. Compare local professionals, read reviews, and hire trusted experts – quick and hassle-free.",
  },
  "/driveways-landing-ppc": {
    title: "Compare Free Quotes from Local Driveway Companies | Localists",
    description:
      "Get free quotes from trusted local driveway companies. Compare prices, read reviews, and hire top-rated professionals near you – quick and simple.",
  },
  "/gates-landing-ppc": {
    title: "Compare Free Quotes from Local Gating Companies | Localists",
    description:
      "Get free quotes from top gating companies. Compare local professionals, read reviews, and hire trusted experts – quick and hassle-free.",
  },
};

const MainLayout = () => {
  const location = useLocation();

  // Support localized URLs by stripping "/:lang/:country" before lookup
  const stripLocalePrefix = (path) => {
    const m = path.match(/^\/[a-z]{2}\/[a-z]{2}(\/.*)?$/);
    if (m) {
      const rest = m[1] || "/";
      return rest;
    }
    return path;
  };

  const lookupPath = stripLocalePrefix(location.pathname);
  let meta = pageTitles[lookupPath];

  // Handle dynamic route for /view-profile/:companyName/:id
  if (!meta && lookupPath.startsWith("/view-profile")) {
    const parts = lookupPath.split("/");
    const companyName = decodeURIComponent(parts[2] || "");
    meta = {
      title: `${companyName} | Localists`,
      description: `Discover more about ${companyName} on Localists. View company details, services, and connect directly.`,
    };
  }
  useEffect(() => {
    document.body.style.paddingTop = "40px";
    document.documentElement.style.setProperty("padding-top", "40px");
  }, []);

  return (
    <div>
      <ScrollToTop />
      <Navbar />
      {meta?.title && <MetaHelmet title={meta?.title} description={meta?.description} />}
      <main style={{ minHeight: "50vh", position: "relative", zIndex: 9 }}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
