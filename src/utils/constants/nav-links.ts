import { HelpCircleIcon, LineChartIcon, Link2Icon, LockIcon, NewspaperIcon, QrCodeIcon } from "lucide-react";

export const NAV_LINKS = [
    {
        title: "About Us",
        href: "/about-us",
        menu: [
            {
                title: "Link Shortening",
                tagline: "Shorten links and track their performance.",
                href: "/about-us/link-shortening",
                icon: Link2Icon,
            },
            {
                title: "Password Protection",
                tagline: "Secure your links with a password.",
                href: "/about-us/password-protection",
                icon: LockIcon,
            },
            {
                title: "Advanced Analytics",
                tagline: "Gain insights into who is clicking your links.",
                href: "/about-us/analytics",
                icon: LineChartIcon,
            },
            {
                title: "Custom QR Codes",
                tagline: "Use QR codes to reach your audience.",
                href: "/about-us/qr-codes",
                icon: QrCodeIcon,
            },
        ],
    },
    {
        title: "Jobs",
        href: "/jobs",
    },
    {
        title: "FAQs",
        href: "/faqs",
    },
    {
        title: "Contact Us",
        href: "/contact-us",
        menu: [
            {
                title: "Blog",
                tagline: "Read articles on the latest trends in tech.",
                href: "/contact-us/blog",
                icon: NewspaperIcon,
            },
            {
                title: "Help",
                tagline: "Get answers to your questions.",
                href: "/contact-us/help",
                icon: HelpCircleIcon,
            },
        ]
    },
];
