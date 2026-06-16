import { authOptions } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import ApplicationsClient from "@/components/dashboard/applications-client";

const ApplicationsPage = async () => {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth/sign-in");
  }

  if (
    (session.user.role !== "OWNER" && session.user.role !== "ADMIN") ||
    session.user.status !== "ACTIVE"
  ) {
    redirect("/dashboard");
  }

  const allApplications = await prisma.application.findMany({
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      fullName: true,
      phoneNumber: true,
      email: true,
      preferredLocation: true,
      jobTitle: true,
      resumeName: true,
      resumeType: true,
      status: true,
      createdAt: true,
      assignedToId: true,
      assignedTo: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return (
    <main className="relative min-h-dvh overflow-hidden bg-background px-4 py-10 text-foreground md:px-8">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#161616_1px,transparent_1px),linear-gradient(to_bottom,#161616_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_70%_55%_at_50%_0%,#000_60%,transparent_115%)]" />
      <div className="absolute inset-x-0 top-0 h-96 bg-[radial-gradient(circle_at_top,rgba(168,85,247,0.18),transparent_42%),radial-gradient(circle_at_80%_10%,rgba(217,70,239,0.1),transparent_34%)]" />
      <div className="relative mx-auto w-full max-w-6xl space-y-8">
        <div className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-violet-300">
            Owner &amp; Admin Dashboard
          </p>
          <div className="max-w-3xl space-y-3">
            <h1 className="text-4xl font-medium !leading-[1.08] font-heading text-foreground md:text-5xl">
              Job Applications
            </h1>
            <p className="text-base leading-7 text-muted-foreground">
              Review and manage all submitted job applications, view candidate resumes, and update application statuses.
            </p>
          </div>
        </div>

        <ApplicationsClient
          applications={allApplications.map((app) => ({
            ...app,
            createdAt: app.createdAt.toISOString(),
          }))}
        />
      </div>
    </main>
  );
};

export default ApplicationsPage;
