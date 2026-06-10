import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        redirect("/auth/sign-in");
    }

    if (session.user.role === "OWNER") {
        redirect("/dashboard/owner");
    } else if (session.user.role === "ADMIN") {
        redirect("/dashboard/owner/job-descriptions");
    } else if (session.user.role === "STAFF") {
        redirect("/dashboard/staff");
    } else {
        redirect("/dashboard/staff");
    }
}

