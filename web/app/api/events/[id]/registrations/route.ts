import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuth, unauthorized } from "@/lib/auth";

type Context = { params: Promise<{ id: string }> };

// POST /api/events/:id/registrations: inscreve o usuário logado no evento
export async function POST(request: Request, { params }: Context) {
  const auth = getAuth(request);
  if (!auth) return unauthorized();

  const { id: eventId } = await params;

  const event = await prisma.event.findUnique({ where: { id: eventId } });
  if (!event) {
    return NextResponse.json({ error: "Evento não encontrado" }, { status: 404 });
  }

  const already = await prisma.registration.findUnique({
    where: { userId_eventId: { userId: auth.sub, eventId } },
  });
  if (already) {
    return NextResponse.json(
      { error: "Você já está inscrito neste evento" },
      { status: 409 }
    );
  }

  const registration = await prisma.registration.create({
    data: { userId: auth.sub, eventId },
    include: { event: true },
  });

  return NextResponse.json(registration, { status: 201 });
}