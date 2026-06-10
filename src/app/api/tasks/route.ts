import { authOptions } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";

const createTaskSchema = z.object({
  name: z.string().trim().min(1, "Task name is required."),
  googleSheetUrl: z.string().trim().url("Enter a valid Google Sheet URL."),
  assignedStaffIds: z.array(z.string()).min(1, "Assign at least one staff member."),
});

const updateTaskSchema = z.object({
  name: z.string().trim().min(1, "Task name is required.").optional(),
  googleSheetUrl: z.string().trim().url("Enter a valid Google Sheet URL.").optional(),
  assignedStaffIds: z.array(z.string()).min(1, "Assign at least one staff member.").optional(),
});

const canViewTasks = (role?: string, status?: string) =>
  status === "ACTIVE" && (role === "OWNER" || role === "ADMIN" || role === "STAFF");

const canManageTasks = (role?: string, status?: string) =>
  status === "ACTIVE" && (role === "OWNER" || role === "ADMIN");

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!canViewTasks(session?.user?.role, session?.user?.status)) {
    return NextResponse.json({ error: "Active dashboard access required." }, { status: 403 });
  }

  try {
    let tasks;

    if (session?.user?.role === "STAFF") {
      // Get only tasks assigned to the staff member
      tasks = await prisma.task.findMany({
        where: {
          assignedStaffMembers: {
            some: {
              userId: session.user.id,
            },
          },
        },
        include: {
          assignedStaffMembers: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });
    } else {
      // Get all tasks for admin/owner
      tasks = await prisma.task.findMany({
        include: {
          assignedStaffMembers: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });
    }

    return NextResponse.json({
      tasks: tasks.map((task) => ({
        ...task,
        assignedStaff: task.assignedStaffMembers.map((assignment) => assignment.user),
        createdAt: task.createdAt.toISOString(),
        updatedAt: task.updatedAt.toISOString(),
      })),
    });
  } catch (error) {
    console.error("Unable to load tasks.", error);
    return NextResponse.json(
      { error: "Unable to connect to the database. Please try again shortly." },
      { status: 503 },
    );
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!canManageTasks(session?.user?.role, session?.user?.status)) {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }

  const payload = await request.json().catch(() => null);
  const parsed = createTaskSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0]?.message ?? "Invalid task details." },
      { status: 400 },
    );
  }

  try {
    const task = await prisma.task.create({
      data: {
        name: parsed.data.name,
        googleSheetUrl: parsed.data.googleSheetUrl,
        assignedStaffMembers: {
          create: parsed.data.assignedStaffIds.map((userId) => ({
            userId,
          })),
        },
      },
      include: {
        assignedStaffMembers: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(
      {
        task: {
          ...task,
          assignedStaff: task.assignedStaffMembers.map((assignment) => assignment.user),
          createdAt: task.createdAt.toISOString(),
          updatedAt: task.updatedAt.toISOString(),
        },
        message: "Task created successfully.",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Unable to create task.", error);
    return NextResponse.json(
      { error: "Unable to create task. Please try again shortly." },
      { status: 503 },
    );
  }
}
