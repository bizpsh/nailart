import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { contactSchema } from "@/lib/schemas";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = contactSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  await prisma.inquiry.create({ data: parsed.data });

  return NextResponse.json({ success: true }, { status: 201 });
}
