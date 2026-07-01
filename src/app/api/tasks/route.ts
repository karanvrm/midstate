import { authOptions } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";

const createTaskSchema = z.object({
  name: z.string().trim().min(1, "Task name is required."),
  assignedStaffIds: z.array(z.string()).min(1, "Assign at least one staff member."),
  candidates: z.array(z.record(z.string())).optional(),
  selectedColumns: z.array(z.string()).optional(),
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
          candidates: {
            select: {
              status: true,
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
          candidates: {
            select: {
              status: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });
    }

    const tasksWithDetails = tasks.map((task) => {
      const candidates = task.candidates;
      const totalCandidates = candidates.length;
      
      let status = "PENDING";
      if (totalCandidates > 0) {
        const pendingCount = candidates.filter(c => c.status.toLowerCase() === "pending").length;
        if (pendingCount === 0) {
          status = "COMPLETED";
        } else if (pendingCount < totalCandidates) {
          status = "IN_PROGRESS";
        } else {
          status = "PENDING";
        }
      }

      return {
        id: task.id,
        name: task.name,
        createdAt: task.createdAt.toISOString(),
        updatedAt: task.updatedAt.toISOString(),
        assignedStaff: task.assignedStaffMembers.map((assignment) => assignment.user),
        candidateCount: totalCandidates,
        status,
      };
    });

    return NextResponse.json({
      tasks: tasksWithDetails,
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

    const COLUMN_MAP: Record<string, string> = {
      'Email ID': 'email',
      'Current Location': 'current_location',
      'Preferred Locations': 'preferred_locations',
      'Total Experience': 'experience',
      'Under Graduation degree': 'qualification',
    };

    const getRowValue = (row: Record<string, string>, index: number) => {
      const value = Object.values(row)[index];
      return typeof value === "string" && value.trim() ? value.trim() : null;
    };

    let candidateCount = 0;

    if (parsed.data.candidates && parsed.data.candidates.length > 0 && parsed.data.selectedColumns) {
      const selectedCols = parsed.data.selectedColumns;
      // Create batch
      const batch = await prisma.batch.create({
        data: {
          title: parsed.data.name,
          uploaded_by: session!.user.id,
          status: 'ACTIVE',
        },
      });

      // Map each candidate row
      const candidateData = parsed.data.candidates.map((c) => {
        const fields: Record<string, string | null> = {};
        fields.name = getRowValue(c, 0);
        fields.phone = getRowValue(c, 1);

        Object.entries(COLUMN_MAP).forEach(([xlsxCol, dbField]) => {
          if (selectedCols.includes(xlsxCol)) {
            fields[dbField] = c[xlsxCol] || null;
          } else {
            fields[dbField] = null;
          }
        });
        
        const staffId = parsed.data.assignedStaffIds[0];

        return {
          batch_id: batch.id,
          taskId: task.id,
          assigned_to: staffId,
          name: fields.name,
          email: fields.email,
          phone: fields.phone,
          current_location: fields.current_location,
          preferred_locations: fields.preferred_locations,
          experience: fields.experience,
          qualification: fields.qualification,
          status: 'PENDING',
        };
      });

      if (candidateData.length > 0) {
        await prisma.candidate.createMany({ data: candidateData });
        candidateCount = candidateData.length;
      }
    }

    return NextResponse.json(
      {
        task: {
          id: task.id,
          name: task.name,
          assignedStaff: task.assignedStaffMembers.map((assignment) => assignment.user),
          candidateCount,
          status: "PENDING",
          createdAt: task.createdAt.toISOString(),
          updatedAt: task.updatedAt.toISOString(),
        },
        message: "Task assigned successfully.",
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
