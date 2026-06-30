import { authOptions } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";

const updateTaskSchema = z.object({
  name: z.string().trim().min(1, "Task name is required.").optional(),
  assignedStaffIds: z.array(z.string()).min(1, "Assign at least one staff member.").optional(),
});

const canManageTasks = (role?: string, status?: string) =>
  status === "ACTIVE" && (role === "OWNER" || role === "ADMIN");

export async function GET(request: Request, { params }: { params: { taskId: string } }) {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.status !== "ACTIVE") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const task = await prisma.task.findUnique({
      where: { id: params.taskId },
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

    if (!task) {
      return NextResponse.json({ error: "Task not found." }, { status: 404 });
    }

    // For staff member, make sure they are assigned to this task
    if (session.user.role === "STAFF") {
      const isAssigned = task.assignedStaffMembers.some(
        (assignment) => assignment.userId === session.user.id
      );
      if (!isAssigned) {
        return NextResponse.json({ error: "Forbidden." }, { status: 403 });
      }
    }

    return NextResponse.json({
      task: {
        ...task,
        assignedStaff: task.assignedStaffMembers.map((assignment) => assignment.user),
        createdAt: task.createdAt.toISOString(),
        updatedAt: task.updatedAt.toISOString(),
      },
    });
  } catch (error) {
    console.error("Unable to load task details.", error);
    return NextResponse.json({ error: "Failed to load task details." }, { status: 503 });
  }
}

export async function PUT(request: Request, { params }: { params: { taskId: string } }) {
  const session = await getServerSession(authOptions);

  if (!canManageTasks(session?.user?.role, session?.user?.status)) {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }

  const payload = await request.json().catch(() => null);
  const parsed = updateTaskSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0]?.message ?? "Invalid task details." },
      { status: 400 },
    );
  }

  try {
    // Check if task exists
    const taskExists = await prisma.task.findUnique({
      where: { id: params.taskId },
    });

    if (!taskExists) {
      return NextResponse.json({ error: "Task not found." }, { status: 404 });
    }

    // If updating assigned staff, delete existing assignments and create new ones
    if (parsed.data.assignedStaffIds) {
      await prisma.taskAssignment.deleteMany({
        where: { taskId: params.taskId },
      });

      // Update all candidates for this task to be assigned to the new staff member
      const newStaffId = parsed.data.assignedStaffIds[0];
      if (newStaffId) {
        await prisma.candidate.updateMany({
          where: { taskId: params.taskId },
          data: { assigned_to: newStaffId },
        });
      }
    }

    const task = await prisma.task.update({
      where: { id: params.taskId },
      data: {
        ...(parsed.data.name && { name: parsed.data.name }),
        ...(parsed.data.assignedStaffIds && {
          assignedStaffMembers: {
            create: parsed.data.assignedStaffIds.map((userId) => ({
              userId,
            })),
          },
        }),
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

    return NextResponse.json({
      task: {
        ...task,
        assignedStaff: task.assignedStaffMembers.map((assignment) => assignment.user),
        createdAt: task.createdAt.toISOString(),
        updatedAt: task.updatedAt.toISOString(),
      },
      message: "Task updated successfully.",
    });
  } catch (error) {
    console.error("Unable to update task.", error);
    return NextResponse.json(
      { error: "Unable to update task. Please try again shortly." },
      { status: 503 },
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { taskId: string } },
) {
  const session = await getServerSession(authOptions);

  if (!canManageTasks(session?.user?.role, session?.user?.status)) {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }

  try {
    const taskExists = await prisma.task.findUnique({
      where: { id: params.taskId },
    });

    if (!taskExists) {
      return NextResponse.json({ error: "Task not found." }, { status: 404 });
    }

    await prisma.task.delete({
      where: { id: params.taskId },
    });

    return NextResponse.json({
      message: "Task deleted successfully.",
    });
  } catch (error) {
    console.error("Unable to delete task.", error);
    return NextResponse.json(
      { error: "Unable to delete task. Please try again shortly." },
      { status: 503 },
    );
  }
}
