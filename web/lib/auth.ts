import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET!;

export type TokenPayload = {
  sub: string;
  role: "USER" | "ADMIN";
};

export function signToken(payload: TokenPayload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function getAuth(request: Request): TokenPayload | null {
  const header = request.headers.get("authorization");
  if (!header || !header.startsWith("Bearer ")) return null;

  try {
    const token = header.slice(7);
    return jwt.verify(token, JWT_SECRET) as unknown as TokenPayload;
  } catch {
    return null;
  }
}

export function unauthorized() {
  return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
}

export function forbidden() {
  return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
}