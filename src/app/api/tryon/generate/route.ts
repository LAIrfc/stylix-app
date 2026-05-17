import { NextRequest, NextResponse } from "next/server";

const NECKLACE_MAP: Record<string, {
  id: string;
  name: string;
  productImage: string;
  transparentAsset: string;
  detailImage: string;
  wornReferenceImage: string;
}> = {
  "aurora-necklace": {
    id: "aurora-necklace",
    name: "Aurora Celestial Necklace",
    productImage: "/tryon/aurora-necklace/product-front.jpg",
    transparentAsset: "/tryon/aurora-necklace/transparent.png",
    detailImage: "/tryon/aurora-necklace/detail-closeup.jpg",
    wornReferenceImage: "/tryon/aurora-necklace/worn-reference.png",
  },
};

const TRYON_PROMPT =
  "Preserve the user's face, pose, body, skin tone, outfit, background, and lighting. " +
  "Naturally place the selected gold necklace around the neck with realistic scale, curve, shadow, and reflection. " +
  "Do not change the person's identity. " +
  "Do not alter the clothing except where the necklace naturally overlaps.";

function isTimeoutError(err: unknown): boolean {
  if (!(err instanceof Error)) return false;
  const msg = err.message.toLowerCase();
  return (
    msg.includes("timeout") ||
    msg.includes("timed out") ||
    msg.includes("etimedout") ||
    msg.includes("econnreset") ||
    (err as NodeJS.ErrnoException).code === "ETIMEDOUT"
  );
}

export async function POST(req: NextRequest) {
  console.log("[tryon/generate] route hit");

  const apiKey = process.env.OPENAI_API_KEY;
  console.log("[tryon/generate] hasOpenAIKey:", !!apiKey);

  try {
    const formData = await req.formData();
    const file = formData.get("image") as File | null;
    const necklaceId = formData.get("necklaceId") as string | null;

    console.log("[tryon/generate] necklaceId:", necklaceId);
    console.log("[tryon/generate] image received:", !!file, file ? `${file.name} | ${(file.size / 1024).toFixed(1)} KB | type: ${file.type}` : "none");

    if (!file || !necklaceId) {
      return NextResponse.json({ error: "Missing image or necklaceId" }, { status: 400 });
    }

    const necklace = NECKLACE_MAP[necklaceId];
    if (!necklace) {
      return NextResponse.json({ error: `Unknown necklace id: ${necklaceId}` }, { status: 400 });
    }

    if (!apiKey) {
      console.log("[tryon/generate] No API key — demo mode");
      return NextResponse.json({
        demo: true,
        demoReason: "no-key",
        message: "Demo mode: OpenAI API key is not connected yet.",
        resultImage: necklace.wornReferenceImage,
        necklace,
      });
    }

    const imageBuffer = Buffer.from(await file.arrayBuffer());
    const imageFile = new File([imageBuffer], file.name, { type: file.type });

    console.log("[tryon/generate] payload — model: gpt-image-1 | images: 1 | size:", `${(imageBuffer.byteLength / 1024).toFixed(1)} KB | necklace: ${necklaceId}`);
    console.log("[tryon/generate] OpenAI API call started — timeout: 120s");

    const { default: OpenAI } = await import("openai");
    const openai = new OpenAI({
      apiKey,
      timeout: 120_000,
      maxRetries: 0,
    });

    let response;
    try {
      response = await openai.images.edit({
        model: "gpt-image-1",
        image: imageFile,
        prompt: TRYON_PROMPT,
        n: 1,
        size: "1024x1024",
      });
      console.log("[tryon/generate] OpenAI API success — data length:", response.data?.length);
    } catch (openaiErr: unknown) {
      const msg = openaiErr instanceof Error ? openaiErr.message : String(openaiErr);
      const timedOut = isTimeoutError(openaiErr);
      console.error(`[tryon/generate] OpenAI API ${timedOut ? "TIMEOUT" : "failure"}:`, msg);
      return NextResponse.json({
        demo: true,
        demoReason: timedOut ? "timeout" : "openai-error",
        message: timedOut
          ? "Generation timed out. Try a smaller photo."
          : `OpenAI error: ${msg}`,
        resultImage: necklace.wornReferenceImage,
        necklace,
      });
    }

    const result = response.data?.[0];
    if (!result) {
      console.error("[tryon/generate] No image in OpenAI response");
      return NextResponse.json({
        demo: true,
        demoReason: "empty-response",
        message: "OpenAI returned no image data.",
        resultImage: necklace.wornReferenceImage,
        necklace,
      });
    }

    const resultImage = result.url ?? (result.b64_json ? `data:image/png;base64,${result.b64_json}` : null);
    if (!resultImage) {
      console.error("[tryon/generate] No URL or base64 in result");
      return NextResponse.json({
        demo: true,
        demoReason: "no-image-data",
        message: "OpenAI response contained no image URL or base64.",
        resultImage: necklace.wornReferenceImage,
        necklace,
      });
    }

    console.log("[tryon/generate] Success — returning generated image");
    return NextResponse.json({ demo: false, resultImage, necklace });

  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[tryon/generate] Unexpected error:", msg);
    const necklace = NECKLACE_MAP["aurora-necklace"];
    return NextResponse.json({
      demo: true,
      demoReason: "unexpected-error",
      message: `Unexpected error: ${msg}`,
      resultImage: necklace.wornReferenceImage,
      necklace,
    });
  }
}
