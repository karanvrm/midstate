"use server";

export const syncUser = async () => {
    return { error: "Authentication sync is unavailable because Clerk has been removed." };
};

const getAuthStatus = async () => {
    return { error: "Authentication is unavailable because Clerk has been removed." };
};

export default getAuthStatus;
