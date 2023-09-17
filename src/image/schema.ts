import { z } from "zod";

export const bodySchema = z.object({
    userId: z.string(),
    prompt: z.string(),
    amount: z.string().optional().transform((val) => {
        if (!val) {
            return '1';
        }

        return val;
    }),
    resolution: z.string().optional().transform((val) => {
        if (!val) {
            return '512x512';
        }

        return val;
    }),
});