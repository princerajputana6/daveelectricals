import { NextResponse } from "next/server";
import { getSession, isAdminSession } from "@/lib/auth";
import { uploadToCloudinary, isCloudinaryConfigured } from "@/lib/cloudinary";

export const runtime = "nodejs";
// Allow larger payloads for image uploads
export const maxDuration = 30;

export async function POST(req: Request) {
  const session = await getSession();
  if (!isAdminSession(session)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (!isCloudinaryConfigured()) {
    return NextResponse.json(
      {
        error:
          "Cloudinary is not configured. Add CLOUDINARY_CLOUD_NAME / API_KEY / API_SECRET to your environment variables.",
      },
      { status: 503 },
    );
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file");
    const folder =
      (formData.get("folder") as string | null) ||
      "daveelectrical/certificates";

    if (!(file instanceof Blob)) {
      return NextResponse.json(
        { error: "Missing file" },
        { status: 400 },
      );
    }
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File too large (max 10MB)." },
        { status: 413 },
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const mime = file.type || "application/octet-stream";
    const dataUrl = `data:${mime};base64,${buffer.toString("base64")}`;

    const result = await uploadToCloudinary(dataUrl, folder);
    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    console.error("[admin upload]", err);
    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Upload failed.",
      },
      { status: 500 },
    );
  }
}
