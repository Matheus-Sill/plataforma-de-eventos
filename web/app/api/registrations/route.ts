import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuth, unauthorized } from "@/lib/auth";

// GET /api/registrations: lista as inscrições do usuário logado
export async function GET(request: Request) {
  const auth = getAuth(request);
  if (!auth) return unauthorized();

  const registrations = await prisma.registration.findMany({
    where: { userId: auth.sub },
    include: { event: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(registrations);
}