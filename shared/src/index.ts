import { z } from "zod";

export const roles = ["STUDENT", "FACULTY", "COMPANY", "ADMIN"] as const;
export const roleSchema = z.enum(roles);
export type Role = z.infer<typeof roleSchema>;
export const signupSchema = z.object({ name: z.string().min(2), email: z.string().email(), password: z.string().min(8), role: roleSchema.default("STUDENT") });
export const loginSchema = z.object({ email: z.string().email(), password: z.string().min(8) });
export const communityPostSchema = z.object({ content: z.string().trim().min(1).max(2000) });
export const communityReplySchema = z.object({ content: z.string().trim().min(1).max(2000) });
export type DashboardMetric = { label: string; value: string; trend: string; tone: "violet" | "cyan" | "amber" | "emerald" };
