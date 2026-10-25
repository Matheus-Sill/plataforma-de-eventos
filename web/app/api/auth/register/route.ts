import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { signToken } from "@/lib/auth";
import { registerSchema, formatZodError } from "@/lib/validations";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = registerSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Dados inválidos", details: formatZodError(parsed.error) },
      { status: 400 }
    );
  }

  const { name, email, password } = parsed.data;

  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) {
    return NextResponse.json(
      { error: "E-mail já cadastrado" },
      { status: 409 }
    );
  }

  const hashed = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { name, email, password: hashed },
  });

  const token = signToken({ sub: user.id, role: user.role });

  return NextResponse.json(
    {
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    },
    { status: 201 }
  );
}