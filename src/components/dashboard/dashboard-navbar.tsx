import { Button } from "@/components/ui/button";
import { BellIcon, SearchIcon } from "lucide-react";
import Link from "next/link";

interface DashboardNavbarProps {
    title: string;
    subtitle: string;
}

const DashboardNavbar = ({ title, subtitle }: DashboardNavbarProps) => {
    return (
        <header className="sticky top-0 z-20 flex min-h-16 items-center justify-between gap-4 border-b border-border/70 bg-background/80 px-4 backdrop-blur-md lg:px-8">
            <div>
                <h1 className="text-lg font-medium text-foreground md:text-xl">{title}</h1>
                <p className="text-sm text-muted-foreground">{subtitle}</p>
            </div>

            <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="rounded-full">
                    <SearchIcon className="size-4" />
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full">
                    <BellIcon className="size-4" />
                </Button>
                <Button asChild variant="outline" className="hidden sm:inline-flex">
                    <Link href="/">Back to Home</Link>
                </Button>
            </div>
        </header>
    )
};

export default DashboardNavbar
