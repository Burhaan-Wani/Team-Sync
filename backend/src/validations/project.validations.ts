import { z } from "zod";

const nameSchema = z.string().trim().min(1).max(255);

const descriptionSchema = z.string().trim().optional();

export const createProjectSchema = z.object({
    name: nameSchema,
    description: descriptionSchema,
    emoji: z.string().optional(),
});

export const updateProjectSchema = z.object({
    name: nameSchema,
    description: descriptionSchema,
    emoji: z.string().optional(),
});
