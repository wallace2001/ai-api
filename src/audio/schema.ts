import { z } from "zod";

export const bodySchema = z.object({
    userId: z.string(),
    prompt: z.string(),
});