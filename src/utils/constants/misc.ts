import { BarChart3Icon, FolderOpenIcon, WandSparklesIcon } from "lucide-react";

export const DEFAULT_AVATAR_URL = "https://api.dicebear.com/8.x/initials/svg?backgroundType=gradientLinear&backgroundRotation=0,360&seed=";

export const PAGINATION_LIMIT = 10;


export const PROCESS = [
    {
        title: "Explore Opportunities",
        description: "Browse available openings and discover roles that match your skills, experience, and career goals.",
        icon: FolderOpenIcon,
    },
    {
        title: "Fill the Required Details",
        description: "Review job requirements, responsibilities, and qualifications to find the opportunity that fits you best.",
        icon: WandSparklesIcon,
    },
    {
        title: "Submit Your Application",
        description: "Complete the application form and share your details so our recruitment team can review your profile.",
        icon: BarChart3Icon,
    },
] as const;

export const FEATURES = [
    {
        title: "Link shortening",
        description: "Create short links that are easy to remember and share.",
    },
    {
        title: "Advanced analytics",
        description: "Track and measure the performance of your links.",
    },
    {
        title: "Password protection",
        description: "Secure your links with a password.",
    },
    {
        title: "Custom QR codes",
        description: "Generate custom QR codes for your links.",
    },
    {
        title: "Link expiration",
        description: "Set an expiration date for your links.",
    },
    {
        title: "Team collaboration",
        description: "Share links with your team and collaborate in real-time.",
    },
] as const;

export const REVIEWS = [
    {
        name: "Priya Sharma",
        username: "@priya_sharma",
        review: "Midstate Global Services helped me land a role in under three weeks. The recruiter was incredibly supportive throughout and kept me updated at every stage.",
        rating: 5,
    },
    {
        name: "Arjun Mehta",
        username: "@arjun.mehta",
        review: "I had been searching for a job for months with no luck. After registering with Midstate, I received interview calls within days. Highly recommend their services.",
        rating: 5,
    },
    {
        name: "Sneha Patel",
        username: "@sneha_patel",
        review: "The platform is very easy to use and the team is professional. They matched me with a position that perfectly suited my background and experience.",
        rating: 4,
    },
    {
        name: "Rohit Verma",
        username: "@rohit.verma",
        review: "A seamless recruitment experience from start to finish. The onboarding support was exceptional and made the transition to my new role much smoother.",
        rating: 5,
    },
    {
        name: "Ananya Iyer",
        username: "@ananya_iyer",
        review: "What stood out was how personalised the process felt. They took the time to understand my career goals rather than just sending generic job listings.",
        rating: 5,
    },
    {
        name: "Karan Singh",
        username: "@karan.singh",
        review: "Midstate connected me with a reputable BPO company in my city. The application process was straightforward and the team was responsive throughout.",
        rating: 4,
    },
] as const;

export const COMPANIES = [
    {
        name: "Infosys",
        logo: "https://logo.clearbit.com/infosys.com",
    },
    {
        name: "Wipro",
        logo: "https://logo.clearbit.com/wipro.com",
    },
    {
        name: "Tata Consultancy Services",
        logo: "https://logo.clearbit.com/tcs.com",
    },
    {
        name: "HCL Technologies",
        logo: "https://logo.clearbit.com/hcltech.com",
    },
    {
        name: "Cognizant",
        logo: "https://logo.clearbit.com/cognizant.com",
    },
    {
        name: "Accenture",
        logo: "https://logo.clearbit.com/accenture.com",
    },
] as const;
