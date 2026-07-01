import { authOptions } from "@/auth";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { getStaffAnalytics, computeDateRange, FilterOption } from "@/lib/analytics";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (session.user.status !== "ACTIVE") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const filter = (searchParams.get("filter") ?? "today") as FilterOption;

  const validFilters: FilterOption[] = ["today", "this_week", "this_month", "last_3_months"];
  const safeFilter: FilterOption = validFilters.includes(filter) ? filter : "today";

  const dateRange = computeDateRange(safeFilter);
  const data = await getStaffAnalytics(session.user.id, dateRange);

  return NextResponse.json(data);
}
