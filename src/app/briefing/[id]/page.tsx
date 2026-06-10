import { authOptions } from "@/auth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { canViewBriefings } from "@/lib/briefings/permissions";
import { getBriefingById } from "@/lib/briefings/queries";
import { ArrowLeftIcon, ArrowUpRightIcon, BookOpenTextIcon, DownloadIcon, FileIcon, LinkIcon } from "lucide-react";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

interface BriefingDetailPageProps {
  params: {
    id: string;
  };
}

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));

const getBackHref = (role?: string) => {
  if (role === "OWNER" || role === "ADMIN") {
    return "/dashboard/owner/briefings";
  }

  return "/dashboard/staff/briefings";
};

const BriefingDetailPage = async ({ params }: BriefingDetailPageProps) => {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth/sign-in");
  }

  if (!canViewBriefings(session.user.role, session.user.status)) {
    redirect("/dashboard");
  }

  const briefing = await getBriefingById(params.id);

  if (!briefing) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#161616_1px,transparent_1px),linear-gradient(to_bottom,#161616_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_55%_at_50%_0%,#000_50%,transparent_110%)] opacity-70" />
        <div className="absolute inset-x-0 top-0 h-96 bg-[radial-gradient(circle_at_top,rgba(168,85,247,0.12),transparent_45%),radial-gradient(circle_at_80%_10%,rgba(217,70,239,0.06),transparent_35%)]" />
      </div>

      <div className="mx-auto w-full max-w-7xl px-4 py-8 md:px-8 md:py-10">
        <div className="mb-6">
          <Button asChild variant="outline" className="gap-2 border-white/10 bg-white/[0.03] text-muted-foreground hover:text-foreground">
            <Link href={getBackHref(session.user.role)}>
              <ArrowLeftIcon className="size-4" />
              Back to Briefings
            </Link>
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <article className="space-y-6">
            <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-neutral-900/70 to-neutral-950/70 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.35)] md:p-8">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(168,85,247,0.16),transparent_42%)]" />
              <div className="relative space-y-5">
                <div className="flex flex-wrap items-center gap-3">
                  <Badge variant="outline" className="border-violet-400/30 bg-violet-400/10 px-2.5 py-0.5 text-[10px] uppercase tracking-widest text-violet-200">
                    Briefing
                  </Badge>
                  <Badge variant="outline" className="border-white/10 bg-white/[0.02] text-[10px] uppercase text-muted-foreground">
                    Added {formatDate(briefing.createdAt)}
                  </Badge>
                </div>

                <div className="flex items-start gap-4">
                  <div className="hidden size-12 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 sm:flex">
                    <BookOpenTextIcon className="size-5 text-violet-300" />
                  </div>
                  <div className="min-w-0 space-y-2">
                    <h1 className="font-heading text-3xl font-medium tracking-tight text-foreground md:text-5xl">
                      {briefing.companyName}
                    </h1>
                    <p className="text-sm text-muted-foreground">
                      Company briefing for internal review and reference.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <Card className="rounded-2xl border-white/10 bg-neutral-900/30 shadow-lg backdrop-blur-md">
              <CardHeader className="border-b border-white/5">
                <CardTitle className="text-xl font-medium text-foreground">Briefing Text</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="whitespace-pre-wrap text-sm leading-7 text-muted-foreground md:text-base md:leading-8">
                  {briefing.briefingText}
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-white/10 bg-neutral-900/30 shadow-lg backdrop-blur-md">
              <CardHeader className="border-b border-white/5">
                <CardTitle className="flex items-center gap-2 text-xl font-medium text-foreground">
                  <LinkIcon className="size-5 text-violet-300" />
                  Important Links
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                {briefing.links.length ? (
                  <div className="flex flex-wrap gap-3">
                    {briefing.links.map((link) => (
                      <Button key={link.id} asChild variant="outline" className="gap-2 border-violet-400/30 bg-violet-400/10 text-violet-100 hover:bg-violet-400/20 hover:text-white">
                        <a href={link.url} target="_blank" rel="noreferrer">
                          {link.title}
                          <ArrowUpRightIcon className="size-4" />
                        </a>
                      </Button>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No important links have been added.</p>
                )}
              </CardContent>
            </Card>
          </article>

          <aside className="lg:sticky lg:top-8 lg:self-start">
            <Card className="rounded-2xl border-white/10 bg-neutral-900/40 shadow-lg backdrop-blur-md">
              <CardHeader className="border-b border-white/5">
                <CardTitle className="flex items-center gap-2 text-lg font-medium text-foreground">
                  <FileIcon className="size-5 text-violet-300" />
                  Files
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-5">
                {briefing.files.length ? (
                  <div className="space-y-3">
                    {briefing.files.map((file) => (
                      <div key={file.id} className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                        <div className="flex min-w-0 items-start gap-3">
                          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5">
                            <FileIcon className="size-4 text-violet-300" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-foreground">{file.fileName}</p>
                            <div className="mt-3 flex flex-wrap gap-2">
                              <Button asChild size="sm" variant="outline" className="gap-2 border-white/10 bg-white/[0.03] text-muted-foreground hover:text-foreground">
                                <a href={file.fileUrl} target="_blank" rel="noreferrer">
                                  Open
                                  <ArrowUpRightIcon className="size-3.5" />
                                </a>
                              </Button>
                              <Button asChild size="sm" variant="outline" className="gap-2 border-violet-400/30 bg-violet-400/10 text-violet-100 hover:bg-violet-400/20 hover:text-white">
                                <a href={file.fileUrl} download>
                                  Download
                                  <DownloadIcon className="size-3.5" />
                                </a>
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-xl border border-dashed border-white/10 bg-white/[0.02] px-4 py-8 text-center">
                    <FileIcon className="mx-auto size-6 text-muted-foreground" />
                    <p className="mt-3 text-sm text-muted-foreground">No files have been added.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </main>
  );
};

export default BriefingDetailPage;
