import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { redirect } from "next/navigation";
import DashboardLayoutClient from "@/components/dashboard/dashboard-layout-client";

interface Props {
  children: React.ReactNode;
}

export default async function DashboardLayout({ children }: Props) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth/sign-in");
  }

  // Ensure user has necessary session fields (with fallbacks if undefined)
  const user = {
    name: session.user.name ?? "User",
    email: session.user.email ?? "",
    image: session.user.image ?? null,
    role: session.user.role,
    status: session.user.status,
  };

  return (
    <DashboardLayoutClient user={user}>
      {children}
    </DashboardLayoutClient>
  );
}
