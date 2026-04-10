import { BarChart3Icon, FolderOpenIcon, WandSparklesIcon } from "lucide-react";

export const DEFAULT_AVATAR_URL = "https://api.dicebear.com/8.x/initials/svg?backgroundType=gradientLinear&backgroundRotation=0,360&seed=";

export const PAGINATION_LIMIT = 10;

export const COMPANIES = [
    {
        name: "Asana",
        logo: "/assets/company-01.svg",
    },
    {
        name: "Tidal",
        logo: "/assets/company-02.svg",
    },
    {
        name: "Innovaccer",
        logo: "/assets/company-03.svg",
    },
    {
        name: "Linear",
        logo: "/assets/company-04.svg",
    },
    {
        name: "Raycast",
        logo: "/assets/company-05.svg",
    },
    {
        name: "Labelbox",
        logo: "/assets/company-06.svg",
    }
] as const;

export const PROCESS = [
    {
        title: "Upload Your Resume",
        description: "Create your profile and upload your resume so companies can review your qualifications and experience.",
        icon: FolderOpenIcon,
    },
    {
        title: "Explore Careers",
        description: "Browse job openings from our partner companies and find opportunities that match your skills and interests.",
        icon: WandSparklesIcon,
    },
    {
        title: "Apply & Get Hired",
        description: "Submit your application directly to companies and start your journey toward a rewarding career.",
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
        name: "Rahul Sharma",
        username: "@rahulsharma",
        avatar: "https://randomuser.me/api/portraits/men/11.jpg",
        rating: 5,
        review: "The application process was clear and I started getting relevant job updates soon after uploading my resume. The platform made it much easier to track openings that matched my background."
    },
    {
        name: "Priya Nair",
        username: "@priyanair",
        avatar: "https://randomuser.me/api/portraits/women/12.jpg",
        rating: 4,
        review: "I had a professional experience overall. The job listings were relevant, and the support team responded on time when I needed clarification about an interview round."
    },
    {
        name: "Ankit Verma",
        username: "@ankitverma",
        avatar: "https://randomuser.me/api/portraits/men/13.jpg",
        rating: 5,
        review: "What stood out to me was the quality of the hiring coordination. I was informed at each stage, and the recruiter shared practical details that helped me prepare better."
    },
    {
        name: "Sneha Kulkarni",
        username: "@snehakulkarni",
        avatar: "https://randomuser.me/api/portraits/women/14.jpg",
        rating: 4,
        review: "The portal is easy to use and the roles are presented in a straightforward way. I would have liked a few more status updates, but the overall recruitment experience was smooth."
    },
    {
        name: "Vikram Singh",
        username: "@vikramsingh",
        avatar: "https://randomuser.me/api/portraits/men/15.jpg",
        rating: 5,
        review: "I found openings here that were more relevant than on many larger job sites. The shortlisting process was quick, and the communication felt professional throughout."
    },
    {
        name: "Neha Agarwal",
        username: "@nehaagarwal",
        avatar: "https://randomuser.me/api/portraits/women/16.jpg",
        rating: 4,
        review: "This platform helped me apply to multiple roles without confusion. The experience felt organized, and I appreciated that the openings were from actual hiring companies."
    },
] as const;
