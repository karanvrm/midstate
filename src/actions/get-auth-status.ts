"use server";

import { authOptions } from "@/auth";
import { getServerSession } from "next-auth";

export const syncUser = async () => {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        return { error: "Not authenticated." };
    }

    return { user: session.user };
};

const getAuthStatus = async () => {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        return { error: "Not authenticated." };
    }

    return { user: session.user };
};

export default getAuthStatus;
