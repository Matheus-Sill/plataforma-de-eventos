import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuth, unauthorized, forbidden } from "@/lib/auth";
import { eventSchema, formatZodError } from "@/lib/validations";

type Context = { params: Promise<{ id: string }> };

function notFound() {
  return NextResponse.json({ error: "Evento não encontrado" }, { status: 404 });
}

// GET /api/events/:id
export async function GET(_request: Request, { params }: Context) {
  const { id } = await params;
  const event = await prisma.event.findUnique({ where: { id } });
  if (!event) return notFound();
  return NextResponse.json(event);
}

// PUT /api/events/:id (somente ADMIN)
export async function PUT(request: Request, { params }: Context) {
  const auth = getAuth(request);
  if (!auth) return unauthorized();
  if (auth.role !== "ADMIN") return forbidden();

  const { id } = await params;
  const exists = await prisma.event.findUnique({ where: { id } });
  if (!exists) return notFound();

  const body = await request.json().catch(() => null);
  const parsed = eventSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Dados inválidos", details: formatZodError(parsed.error) },
      { status: 400 }
    );
  }

  const { image, ...rest } = parsed.data;
  const event = await prisma.event.update({
    where: { id },
    data: { ...rest, image: image || null },
  });

  return NextResponse.json(event);
}

// DELETE /api/events/:id (somente ADMIN)
export async function DELETE(request: Request, { params }: Context) {
  const auth = getAuth(request);
  if (!auth) return unauthorized();
  if (auth.role !== "ADMIN") return forbidden();

  const { id } = await params;
  const exists = await prisma.event.findUnique({ where: { id } });
  if (!exists) return notFound();

  await prisma.event.delete({ where: { id } });
  return NextResponse.json({ message: "Evento excluído" });
}