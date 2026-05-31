import { Metadata } from "next";

const appName = "Midstate Global Services";
const favicon = "/icons/Logo.png";

export const generateMetadata = ({
    title = appName,
    description = `${appName} helps connect candidates with the right career opportunities.`,
    image = "/thumbnail.png",
    icons = [
        {
            rel: "apple-touch-icon",
            url: favicon,
            type: "image/png",
        },
        {
            rel: "icon",
            url: favicon,
            type: "image/png",
        },
        {
            rel: "shortcut icon",
            url: favicon,
            type: "image/png",
        },
    ],
    noIndex = false
}: {
    title?: string;
    description?: string;
    image?: string | null;
    icons?: Metadata["icons"];
    noIndex?: boolean;
} = {}): Metadata => ({
    title,
    description,
    icons,
    openGraph: {
        title,
        description,
        ...(image && { images: [{ url: image }] }),
    },
    twitter: {
        title,
        description,
        ...(image && { card: "summary_large_image", images: [image] }),
        creator: "@shreyassihasane",
    },
    // metadataBase: new URL(process.env.APP_DOMAIN!),
    ...(noIndex && { robots: { index: false, follow: false } }),
});
