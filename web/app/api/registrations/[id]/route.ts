import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuth, unauthorized, forbidden } from "@/lib/auth";

type Context = { params: Promise<{ id: string }> };

// DELETE /api/registrations/:id: cancela uma inscrição do próprio usuário
export async function DELETE(request: Request, { params }: Context) {
  const auth = getAuth(request);
  if (!auth) return unauthorized();

  const { id } = await params;

  const registration = await prisma.registration.findUnique({ where: { id } });
  if (!registration) {
    return NextResponse.json({ error: "Inscrição não encontrada" }, { status: 404 });
  }

  if (registration.userId !== auth.sub) return forbidden();

  await prisma.registration.delete({ where: { id } });
  return NextResponse.json({ message: "Inscrição cancelada" });
}