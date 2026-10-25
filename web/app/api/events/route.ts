import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuth, unauthorized, forbidden } from "@/lib/auth";
import { eventSchema, formatZodError } from "@/lib/validations";

// GET /api/events: lista todos os eventos
export async function GET() {
  const events = await prisma.event.findMany({
    orderBy: { date: "asc" },
  });
  return NextResponse.json(events);
}

// POST /api/events: cria um evento (somente ADMIN)
export async function POST(request: Request) {
  const auth = getAuth(request);
  if (!auth) return unauthorized();
  if (auth.role !== "ADMIN") return forbidden();

  const body = await request.json().catch(() => null);
  const parsed = eventSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Dados inválidos", details: formatZodError(parsed.error) },
      { status: 400 }
    );
  }

  const { image, ...rest } = parsed.data;
  const event = await prisma.event.create({
    data: { ...rest, image: image || null },
  });

  return NextResponse.json(event, { status: 201 });
}