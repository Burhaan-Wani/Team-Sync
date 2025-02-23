import { z } from "zod";

export const nameSchema = z
    .string()
    .trim()
    .min(1, { message: "Name is required" })
    .max(255);
export const descriptionSchema = z.string().optional();

export const createWorkspaceSchema = z.object({
    name: nameSchema,
    description: descriptionSchema,
});

export const updateWorkspaceSchema = z.object({
    name: nameSchema,
    description: descriptionSchema,
});

export const changeRoleSchema = z.object({
    memberId: z.string().trim().min(1),
    roleId: z.string().trim().min(1),
});
