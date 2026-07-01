import { NextRequest, NextResponse } from "next/server";

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
];

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

const UPLOAD_RATE_WINDOW_MS = 60_000;
const UPLOAD_RATE_MAX = 5;
const uploadBuckets = new Map<string, { count: number; resetAt: number }>();

function isUploadRateLimited(ip: string): boolean {
  const now = Date.now();
  const bucket = uploadBuckets.get(ip);
  if (!bucket || now > bucket.resetAt) {
    uploadBuckets.set(ip, { count: 1, resetAt: now + UPLOAD_RATE_WINDOW_MS });
    return false;
  }
  bucket.count++;
  return bucket.count > UPLOAD_RATE_MAX;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (isUploadRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many uploads. Please try again later." },
      { status: 429 }
    );
  }
  try {
    const contentType = req.headers.get("content-type") ?? "";
    if (!contentType.includes("multipart/form-data")) {
      console.error("[upload] Rejected: content-type is not multipart/form-data", contentType);
      return NextResponse.json(
        { error: "Request must be multipart/form-data" },
        { status: 400 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      console.error("[upload] Rejected: no file field in form data");
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // MIME type guard
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      console.error("[upload] Rejected: unsupported MIME type", file.type);
      return NextResponse.json(
        {
          error: `File type "${file.type}" is not supported. Allowed: jpg, png, webp.`,
        },
        { status: 415 }
      );
    }

    // Size guard
    if (file.size > MAX_FILE_SIZE_BYTES) {
      console.error(
        "[upload] Rejected: file too large",
        `${(file.size / 1024 / 1024).toFixed(2)} MB`
      );
      return NextResponse.json(
        { error: `File exceeds the 5 MB limit (${(file.size / 1024 / 1024).toFixed(2)} MB received).` },
        { status: 413 }
      );
    }

    console.log("[upload] Accepted file:", file.name, file.type, `${(file.size / 1024).toFixed(1)} KB`);

    // ── Supabase Storage (uncomment when credentials are set) ─────────────────
    // const supabaseUrl  = process.env.NEXT_PUBLIC_SUPABASE_URL;
    // const supabaseKey  = process.env.SUPABASE_SERVICE_ROLE_KEY;
    // if (supabaseUrl && supabaseKey) {
    //   const { createClient } = await import("@supabase/supabase-js");
    //   const supabase = createClient(supabaseUrl, supabaseKey);
    //   const ext = file.name.split(".").pop() ?? "jpg";
    //   const path = `uploads/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    //   const bytes = await file.arrayBuffer();
    //   const { error } = await supabase.storage
    //     .from("user-uploads")              // bucket name — must be public
    //     .upload(path, bytes, { contentType: file.type, upsert: false });
    //   if (error) {
    //     console.error("[upload] Supabase storage error:", error.message);
    //     return NextResponse.json({ error: error.message }, { status: 500 });
    //   }
    //   const { data } = supabase.storage.from("user-uploads").getPublicUrl(path);
    //   console.log("[upload] Supabase public URL:", data.publicUrl);
    //   return NextResponse.json({ url: data.publicUrl });
    // }
    // ─────────────────────────────────────────────────────────────────────────

    // Local fallback: echo back a data URL so the client can preview immediately.
    // In production replace this with the Supabase block above.
    const bytes = await file.arrayBuffer();
    const base64 = Buffer.from(bytes).toString("base64");
    const dataUrl = `data:${file.type};base64,${base64}`;

    console.log("[upload] Returning local data URL for preview (no Supabase configured)");
    return NextResponse.json({ url: dataUrl });
  } catch (err) {
    console.error("[upload] Unexpected error:", err);
    return NextResponse.json({ error: "Internal server error during upload." }, { status: 500 });
  }
}
