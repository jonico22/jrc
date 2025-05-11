// src/components/ContactForm.tsx (or a separate types.ts)
import { z } from 'zod';

export const contactFormSchema = z.object({
  contactName: z.string().min(2, { message: "El nombre debe tener al menos 2 caracteres." }),
  contactEmail: z.string().email({ message: "Por favor, ingrese un correo electrónico válido." }),
  contactSubject: z.string().min(5, { message: "El asunto debe tener al menos 5 caracteres." }),
  contactMessage: z.string().min(10, { message: "El mensaje debe tener al menos 10 caracteres." }),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;