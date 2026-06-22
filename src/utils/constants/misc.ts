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

