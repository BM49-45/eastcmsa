import { z } from "zod";

export const registerSchema = z
  .object({
    name: z.string().min(2, "Jina lina hitaji herufi 2 au zaidi"),
    email: z.string().email("Barua pepe siyo sahihi"),
    phone: z.string().optional(),
    password: z.string().min(8, "Nenosiri linahitaji herufi 8 au zaidi"),
    confirmPassword: z.string(),
    agreeTerms: z.boolean(), // badilisha literal => boolean
    receiveUpdates: z.boolean().default(true),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Nenosiri halifanani",
    path: ["confirmPassword"],
  })
  .refine((data) => data.agreeTerms === true, {
    message: "Lazima ukubali sheria na masharti",
    path: ["agreeTerms"],
  });

export const loginSchema = z.object({
  email: z.string().email("Barua pepe siyo sahihi"),
  password: z.string().min(1, "Nenosiri linahitajika"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
