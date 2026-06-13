"use client";

import React, { useState } from "react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/utils";
import Logo from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  CalendarIcon,
  CheckSquareIcon,
  FileTextIcon,
  LayoutDashboardIcon,
  LogOutIcon,
  MenuIcon,
  ShieldCheckIcon,
  Users2Icon,
  XIcon,
  BellIcon,
  BookOpenTextIcon,
  HomeIcon
} from "lucide-react";

interface UserSession {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role: "OWNER" | "ADMIN" | "STAFF";
  status: "PENDING" | "ACTIVE" | "REJECTED";
}

interface DashboardLayoutClientProps {
  children: React.ReactNode;
  user: UserSession;
}

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  active: boolean;
  badge?: string;
}

const DashboardLayoutClient = ({ children, user }: DashboardLayoutClientProps) => {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const spaceLabel =
    user.role === "OWNER" ? "Owner Space" : user.role === "ADMIN" ? "Admin Space" : "Staff Space";

  const getInitials = (name?: string | null) => {
    if (!name) return "US";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  // Define sidebar navigation items based on user role
  const isManager = user.role === "OWNER" || user.role === "ADMIN";
  
  const ownerNavItems: NavItem[] = [
    ...(user.role === "OWNER"
      ? [
          {
            label: "Manage Staffs",
            href: "/dashboard/owner",
            icon: Users2Icon,
            active: pathname === "/dashboard/owner",
          },
        ]
      : []),
    {
      label: "Task Management",
      href: "/dashboard/owner/tasks",
      icon: CheckSquareIcon,
      active: pathname.startsWith("/dashboard/owner/tasks"),
    },
    {
      label: "Job Descriptions",
      href: "/dashboard/owner/job-descriptions",
      icon: FileTextIcon,
      active: pathname.startsWith("/dashboard/owner/job-descriptions"),
    },
    {
      label: "Briefing",
      href: "/dashboard/owner/briefings",
      icon: BookOpenTextIcon,
      active: pathname.startsWith("/dashboard/owner/briefings"),
    },
    {
      label: "Attendance",
      href: "/dashboard/owner/attendance",
      icon: CalendarIcon,
      active: pathname.startsWith("/dashboard/owner/attendance"),
    },
    ...(user.role === "OWNER"
      ? [
          {
            label: "Staff Panel View",
            href: "/dashboard/staff?allowOwner=true",
            icon: ShieldCheckIcon,
            active: pathname.startsWith("/dashboard/staff"),
          },
        ]
      : []),
  ];

  const staffNavItems: NavItem[] = [
    {
      label: "Overview",
      href: "/dashboard/staff",
      icon: LayoutDashboardIcon,
      active: pathname === "/dashboard/staff" && !pathname.includes("allowOwner=true"),
    },
    {
      label: "Tasks",
      href: "/dashboard/staff/tasks",
      icon: CheckSquareIcon,
      active: pathname.startsWith("/dashboard/staff/tasks"),
    },
    {
      label: "Job Descriptions",
      href: "/dashboard/staff/job-descriptions",
      icon: FileTextIcon,
      active: pathname.startsWith("/dashboard/staff/job-descriptions"),
    },
    {
      label: "Briefing",
      href: "/dashboard/staff/briefings",
      icon: BookOpenTextIcon,
      active: pathname.startsWith("/dashboard/staff/briefings"),
    },
  ];

  const navItems = isManager ? ownerNavItems : staffNavItems;

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const handleConfirmLogout = async () => {
    setShowLogoutConfirm(false);
    await signOut({ callbackUrl: "/auth/sign-in" });
  };

  return (
    <div className="flex min-h-screen w-full bg-background text-foreground">
      {/* Background Gradients */}
      <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#161616_1px,transparent_1px),linear-gradient(to_bottom,#161616_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_55%_at_50%_0%,#000_50%,transparent_110%)] opacity-70" />
        <div className="absolute inset-x-0 top-0 h-96 bg-[radial-gradient(circle_at_top,rgba(168,85,247,0.12),transparent_45%),radial-gradient(circle_at_80%_10%,rgba(217,70,239,0.06),transparent_35%)]" />
      </div>

      {/* Desktop Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-border/70 bg-neutral-950/80 backdrop-blur-md lg:flex lg:flex-col">
        <div className="flex h-20 items-center justify-between border-b border-border/70 px-6">
          <Link href="/" className="flex items-center gap-2">
            <Logo variant="full" className="h-7 w-auto" />
          </Link>
        </div>
        
        <div className="flex-1 overflow-y-auto px-4 py-6">
          <div className="mb-6 rounded-2xl border border-white/10 bg-white/[0.02] p-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 border border-white/10 bg-white/5">
                <AvatarFallback className="text-sm font-semibold text-white">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
              <div className="overflow-hidden">
                <div className="truncate text-sm font-medium text-foreground">{user.name}</div>
                <div className="truncate text-xs text-muted-foreground">{user.email}</div>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between gap-2 border-t border-white/5 pt-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Role: <span className="text-violet-300">{user.role}</span>
              </span>
              <Badge variant="outline" className="h-5 border-emerald-500/40 bg-emerald-500/10 px-1.5 text-[10px] font-medium text-emerald-300">
                {user.status}
              </Badge>
            </div>
          </div>

          <nav className="space-y-1.5">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
                  item.active
                    ? "border border-violet-500/20 bg-violet-500/10 text-violet-200"
                    : "text-muted-foreground hover:bg-white/[0.03] hover:text-foreground"
                )}
              >
                <div className="flex items-center gap-3">
                  <item.icon className="h-4.5 w-4.5" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground">
                    {item.badge}
                  </span>
                )}
              </Link>
            ))}
          </nav>
        </div>

        <div className="border-t border-border/70 p-4">
          <Button
            onClick={handleLogoutClick}
            variant="outline"
            className="w-full justify-start gap-2 border-red-500/30 text-red-200 hover:bg-red-500/10 hover:text-red-100 transition-all duration-200"
          >
            <LogOutIcon className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content Container */}
      <div className="flex flex-1 flex-col min-w-0 lg:pl-64">
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-border/70 bg-background/40 px-4 backdrop-blur-md md:px-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="rounded-lg p-2 hover:bg-white/5 lg:hidden"
              aria-label="Open sidebar"
            >
              <MenuIcon className="h-6 w-6 text-foreground" />
            </button>
            <div className="hidden sm:block">
              <h2 className="text-xl font-semibold text-foreground font-heading">
                {spaceLabel}
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Midstate Global Services Portal
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="rounded-full border border-white/5 bg-white/[0.02] text-muted-foreground hover:text-foreground">
              <BellIcon className="h-4.5 w-4.5" />
            </Button>
            
            <Button asChild variant="outline" size="sm" className="hidden sm:inline-flex border-white/10 bg-white/[0.02]">
              <Link href="/" className="flex items-center gap-1.5">
                <HomeIcon className="h-3.5 w-3.5" />
                Home
              </Link>
            </Button>

            {/* Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 rounded-full p-0.5 border border-white/10 bg-white/5 transition-all hover:bg-white/10 focus:outline-none">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-violet-600/30 text-xs font-semibold text-violet-200">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 border-border bg-neutral-950/95 backdrop-blur-md">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none text-foreground">{user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-border/70" />
                <DropdownMenuItem className="text-xs text-muted-foreground cursor-default flex items-center justify-between">
                  <span>Role</span>
                  <span className="font-semibold text-violet-300">{user.role}</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="text-xs text-muted-foreground cursor-default flex items-center justify-between">
                  <span>Status</span>
                  <Badge variant="outline" className="h-5 border-emerald-500/40 bg-emerald-500/10 px-1 text-[9px] font-medium text-emerald-300">
                    {user.status}
                  </Badge>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-border/70" />
                <DropdownMenuItem
                  onClick={handleLogoutClick}
                  className="text-red-300 focus:bg-red-500/10 focus:text-red-200 cursor-pointer flex items-center gap-2"
                >
                  <LogOutIcon className="h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Children */}
        <main className="flex-1 min-w-0 p-6 md:p-8">
          {children}
        </main>
      </div>

      {/* Mobile Drawer Sidebar */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          {/* Overlay */}
          <div
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Drawer content */}
          <div className="relative flex w-64 max-w-xs flex-col border-r border-border/70 bg-neutral-950/95 p-6 shadow-xl transition-all duration-300">
            <div className="absolute right-4 top-4">
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="rounded-lg p-2 hover:bg-white/5"
                aria-label="Close sidebar"
              >
                <XIcon className="h-5 w-5 text-foreground" />
              </button>
            </div>

            <div className="mb-8 mt-2">
              <Logo variant="full" className="h-7 w-auto" />
            </div>

            <div className="mb-6 rounded-2xl border border-white/10 bg-white/[0.02] p-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9 border border-white/10 bg-white/5">
                  <AvatarFallback className="text-xs font-semibold text-white">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="overflow-hidden">
                  <div className="truncate text-xs font-medium text-foreground">{user.name}</div>
                  <div className="truncate text-[10px] text-muted-foreground">{user.email}</div>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-white/5 pt-2 text-[10px] text-muted-foreground">
                <span>Role: <span className="text-violet-300">{user.role}</span></span>
                <span className="text-emerald-400 font-semibold">{user.status}</span>
              </div>
            </div>

            <nav className="flex-1 space-y-1.5">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
                    item.active
                      ? "border border-violet-500/20 bg-violet-500/10 text-violet-200"
                      : "text-muted-foreground hover:bg-white/[0.03] hover:text-foreground"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="h-4.5 w-4.5" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground">
                      {item.badge}
                    </span>
                  )}
                </Link>
              ))}
            </nav>

            <div className="mt-auto border-t border-white/5 pt-4">
              <Button
                onClick={handleLogoutClick}
                variant="outline"
                className="w-full justify-start gap-2 border-red-500/30 text-red-200 hover:bg-red-500/10 hover:text-red-100 transition-all duration-200"
              >
                <LogOutIcon className="h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Logout Confirmation Dialog */}
      <AlertDialog open={showLogoutConfirm} onOpenChange={setShowLogoutConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Sign Out</AlertDialogTitle>
            <AlertDialogDescription>
             Are you sure you want to sign out? You&apos;ll need to sign in again to access your dashboard.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex justify-end gap-3">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmLogout}
              className="bg-red-600 hover:bg-red-700"
            >
              Sign Out
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DashboardLayoutClient;
