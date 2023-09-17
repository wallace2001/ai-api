import { z } from "zod";

export const bodySchema = z.object({
    userId: z.string(),
    messages: z.array(
        z.object({
            role: z.string(),
            content: z.string().min(3, {
                message: 'Content empty.'
            })
        })
    )
});