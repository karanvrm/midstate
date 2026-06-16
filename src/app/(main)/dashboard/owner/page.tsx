import { authOptions } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  UsersIcon,
  CheckSquareIcon,
  FileTextIcon,
  BarChart3Icon,
  CalendarIcon,
  MailIcon,
  PhoneIcon,
  ShieldCheckIcon,
  Building2Icon,
  ArrowUpRightIcon,
} from "lucide-react";

const OwnerDashboardPage = async () => {
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

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) {
    redirect("/auth/sign-in");
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const placeholders = [
    {
      title: "Candidates",
      description: "Manage job applicants, track interview pipelines, and view resumes.",
      icon: UsersIcon,
      accent: "from-sky-500/10 via-sky-500/5 to-transparent",
      iconColor: "text-sky-400",
    },
    {
      title: "Tasks",
      description: "Assign tasks to team members, track progress, and coordinate workflows.",
      icon: CheckSquareIcon,
      accent: "from-amber-500/10 via-amber-500/5 to-transparent",
      iconColor: "text-amber-400",
    },
    {
      title: "Documents",
      description: "Upload and organize internal documents, contracts, and templates.",
      icon: FileTextIcon,
      accent: "from-rose-500/10 via-rose-500/5 to-transparent",
      iconColor: "text-rose-400",
    },
    {
      title: "Analytics",
      description: "Monitor team performance metrics, hiring conversion rates, and stats.",
      icon: BarChart3Icon,
      accent: "from-emerald-500/10 via-emerald-500/5 to-transparent",
      iconColor: "text-emerald-400",
    },
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-neutral-900/60 to-neutral-950/60 p-6 md:p-8 shadow-[0_24px_80px_rgba(0,0,0,0.35)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(168,85,247,0.15),transparent_40%)]" />
        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <Badge variant="outline" className="border-violet-400/30 bg-violet-400/10 text-violet-200 uppercase tracking-widest px-2.5 py-0.5 text-[10px]">
              Staff Panel View
            </Badge>
            <h1 className="text-3xl font-medium tracking-tight text-foreground md:text-4xl font-heading">
              Welcome back, {user.name}!
            </h1>
            <p className="text-sm md:text-base text-muted-foreground max-w-2xl leading-relaxed">
              You are viewing the Staff Panel as an {user.role}. This is your workspace overview with full access to internal pipelines.
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Last updated: Today</span>
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Profile & Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="md:col-span-2 border-white/10 bg-neutral-900/40 backdrop-blur-md shadow-lg rounded-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-4 border-b border-white/5">
            <Avatar className="h-14 w-14 border border-violet-400/30 bg-violet-950/40">
              <AvatarFallback className="text-lg font-bold text-violet-200">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg font-medium text-foreground">{user.name}</CardTitle>
              <CardDescription className="text-xs text-muted-foreground flex items-center gap-1.5 mt-1">
                <Building2Icon className="h-3 w-3" />
                {user.role} Member
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6">
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <div className="flex size-9 items-center justify-center rounded-xl border border-white/5 bg-white/[0.02]">
                <MailIcon className="h-4 w-4 text-violet-300" />
              </div>
              <div className="overflow-hidden">
                <div className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground/60">Email</div>
                <div className="truncate text-foreground font-medium mt-0.5">{user.email}</div>
              </div>
            </div>

            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <div className="flex size-9 items-center justify-center rounded-xl border border-white/5 bg-white/[0.02]">
                <PhoneIcon className="h-4 w-4 text-violet-300" />
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground/60">Phone Number</div>
                <div className="text-foreground font-medium mt-0.5">{user.phoneNumber || "Not provided"}</div>
              </div>
            </div>

            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <div className="flex size-9 items-center justify-center rounded-xl border border-white/5 bg-white/[0.02]">
                <CalendarIcon className="h-4 w-4 text-violet-300" />
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground/60">Joined Date</div>
                <div className="text-foreground font-medium mt-0.5">
                  {new Intl.DateTimeFormat("en", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  }).format(new Date(user.createdAt))}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <div className="flex size-9 items-center justify-center rounded-xl border border-white/5 bg-white/[0.02]">
                <ShieldCheckIcon className="h-4 w-4 text-violet-300" />
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground/60">Security Clearance</div>
                <div className="text-foreground font-medium mt-0.5">Role-Authorized</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Status Card */}
        <Card className="border-white/10 bg-neutral-900/40 backdrop-blur-md shadow-lg rounded-2xl flex flex-col justify-between p-6 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Account Status</span>
              <Badge variant="outline" className="border-emerald-500/40 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-300 animate-pulse">
                Active
              </Badge>
            </div>
            <div className="space-y-1">
              <h3 className="text-2xl font-semibold text-foreground">Verified Access</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Your credentials have been verified. You have full access to internal pipelines as {user.role}.
              </p>
            </div>
          </div>

          <div className="mt-6 border-t border-white/5 pt-4">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Status Verified</span>
              <span className="font-semibold text-emerald-400">100% OK</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Future Features Section */}
      <div className="space-y-5">
        <div className="flex flex-col gap-1.5">
          <h2 className="text-2xl font-medium tracking-tight text-foreground font-heading">
            Future Features
          </h2>
          <p className="text-sm text-muted-foreground">
            Upcoming modules currently under development. These components will be wired up soon.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {placeholders.map((item) => (
            <Card
              key={item.title}
              className="border-white/10 bg-neutral-900/20 backdrop-blur-md rounded-2xl relative overflow-hidden transition-all duration-300 hover:border-violet-500/30 hover:-translate-y-1 hover:shadow-xl group"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${item.accent} opacity-60 group-hover:opacity-100 transition-opacity duration-300`} />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.02),transparent_40%)]" />

              <CardHeader className="relative pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex size-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 shadow-md">
                    <item.icon className={`size-5 ${item.iconColor}`} />
                  </div>
                  <Badge variant="outline" className="border-white/10 bg-white/[0.02] text-[10px] text-muted-foreground uppercase px-1.5 py-0">
                    Soon
                  </Badge>
                </div>
                <CardTitle className="text-lg font-medium text-foreground mt-4 group-hover:text-violet-200 transition-colors">
                  {item.title}
                </CardTitle>
              </CardHeader>

              <CardContent className="relative pb-6">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
                <div className="mt-4 flex items-center gap-1 text-[11px] font-semibold text-violet-300 opacity-60 group-hover:opacity-100 transition-all group-hover:translate-x-0.5">
                  Learn more
                  <ArrowUpRightIcon className="h-3 w-3" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboardPage;
