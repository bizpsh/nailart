import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import { getSessionFromRequest } from "@/lib/session";

export const runtime = "nodejs";

const MAX_SIZE = 5 * 1024 * 1024; // 5MB

const EXTENSION_BY_MIME: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/jpg": ".jpg",
  "image/png": ".png",
  "image/gif": ".gif",
  "image/webp": ".webp",
  "image/svg+xml": ".svg",
  "image/avif": ".avif",
};

function getExtension(file: File): string {
  if (file.type && EXTENSION_BY_MIME[file.type]) {
    return EXTENSION_BY_MIME[file.type];
  }
  const nameExt = path.extname(file.name || "");
  return nameExt || "";
}

export async function POST(request: NextRequest) {
  const session = await getSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  if (!file.type || !file.type.startsWith("image/")) {
    return NextResponse.json(
      { error: "File must be an image" },
      { status: 400 }
    );
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json(
      { error: "File must be 5MB or smaller" },
      { status: 400 }
    );
  }

  const extension = getExtension(file);
  const filename = `${crypto.randomUUID()}${extension}`;
  const filePath = path.join(
    process.cwd(),
    "public",
    "uploads",
    "designs",
    filename
  );

  const bytes = Buffer.from(await file.arrayBuffer());
  await writeFile(filePath, bytes);

  return NextResponse.json({ url: `/uploads/designs/${filename}` });
}
