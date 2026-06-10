import type { Role, Status } from "@prisma/client";
import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: Role;
      status: Status;
    } & DefaultSession["user"];
  }

  interface User {
    role: Role;
    status: Status;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: Role;
    status: Status;
  }
}
