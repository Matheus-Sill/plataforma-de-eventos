import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "Nome deve ter ao menos 2 caracteres"),
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "Senha deve ter ao menos 6 caracteres"),
});

export const loginSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(1, "Informe a senha"),
});

export function formatZodError(error: z.ZodError) {
  return error.issues.map((i) => i.message);
}

export const eventSchema = z.object({
  title: z.string().min(3, "Título deve ter ao menos 3 caracteres"),
  description: z.string().min(1, "Informe a descrição"),
  date: z.coerce.date({ error: "Data inválida" }),
  time: z
    .string()
    .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Horário deve estar no formato HH:mm"),
  location: z.string().min(1, "Informe o local"),
  image: z.string().url("A imagem deve ser uma URL válida").optional().or(z.literal("")),
});