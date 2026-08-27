import { NextRequest, NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { designSchema } from "@/lib/schemas";
import { slugify } from "@/lib/slug";
import { getSessionFromRequest } from "@/lib/session";

function toResponseDesign<T extends { colors: string }>(design: T) {
  return { ...design, colors: design.colors ? design.colors.split(",") : [] };
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const category = searchParams.get("category");
  const color = searchParams.get("color");
  const q = searchParams.get("q");

  const where: Prisma.DesignWhereInput = {};

  if (category) {
    where.category = category;
  }

  if (color) {
    where.colors = { contains: color };
  }

  if (q) {
    where.OR = [
      { title: { contains: q } },
      { description: { contains: q } },
    ];
  }

  const designs = await prisma.design.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(designs.map(toResponseDesign));
}

export async function POST(request: NextRequest) {
  const session = await getSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = designSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { colors, ...rest } = parsed.data;

  const baseSlug = slugify(rest.title) || "design";
  let slug = baseSlug;
  let counter = 2;
  while (await prisma.design.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${counter}`;
    counter += 1;
  }

  const design = await prisma.design.create({
    data: {
      ...rest,
      slug,
      colors: colors.join(","),
    },
  });

  return NextResponse.json(toResponseDesign(design), { status: 201 });
}
