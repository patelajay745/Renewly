import { z } from "zod"

export const subscriptionSchema = z.object({
    title: z.string().min(1, "Title is required").min(3, "Title must be at least 3 characters"),
    amount: z.number().min(1, "Amount is required"),
    type: z.enum(["daily,weekly,monthly,yearly"], {
        message: "Please select a subscription type"
    }),
    notification: z.boolean(),
    category: z.string().min(1, "Category is required"),
    startDate: z.date({
        message: "Start date is required"
    })
})