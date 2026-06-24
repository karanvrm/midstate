import { Providers, WhatsAppWidget } from "@/components";
import { Analytics } from "@vercel/analytics/next";
import { Toaster } from "@/components/ui/sonner";

// @ts-ignore: side-effect import for global styles
import "@/styles/globals.css";

import { aeonik, cn, generateMetadata, inter } from "@/utils";

export const metadata = generateMetadata();

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className="scrollbar">
            <body
                className={cn(
                    "min-h-screen bg-background text-foreground antialiased !font-default overflow-x-hidden",
                    aeonik.variable,
                    inter.variable,
                )}
            >
                <Providers>
                    <Toaster
                        richColors
                        theme="dark"
                        position="top-right"
                    />

                    {children}

                    <WhatsAppWidget />

                    <Analytics />
                </Providers>
                <Analytics />
            </body>
        </html>
    );
}