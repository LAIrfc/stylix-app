import { NextRequest, NextResponse } from "next/server";

// ── Necklace asset mapping ────────────────────────────────────────────────────

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

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("image") as File | null;
    const necklaceId = formData.get("necklaceId") as string | null;

    if (!file || !necklaceId) {
      return NextResponse.json({ error: "Missing image or necklaceId" }, { status: 400 });
    }

    const necklace = NECKLACE_MAP[necklaceId];
    if (!necklace) {
      return NextResponse.json({ error: "Unknown necklace id" }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;

    // ── Demo mode fallback ────────────────────────────────────────────────────
    if (!apiKey) {
      return NextResponse.json({
        demo: true,
        message: "AI styling preview is in demo mode. Add OPENAI_API_KEY to enable live generation.",
        resultImage: necklace.wornReferenceImage,
        necklace,
      });
    }

    // ── Live OpenAI image edit ────────────────────────────────────────────────
    const { default: OpenAI } = await import("openai");
    const openai = new OpenAI({ apiKey });

    const imageBuffer = Buffer.from(await file.arrayBuffer());
    const imageFile = new File([imageBuffer], file.name, { type: file.type });

    const response = await openai.images.edit({
      model: "gpt-image-1",
      image: imageFile,
      prompt: TRYON_PROMPT,
      n: 1,
      size: "1024x1024",
    });

    const result = response.data?.[0];
    if (!result) throw new Error("No image returned from OpenAI");

    const resultImage = result.url ?? (result.b64_json ? `data:image/png;base64,${result.b64_json}` : null);
    if (!resultImage) throw new Error("No image URL or base64 in response");

    return NextResponse.json({ demo: false, resultImage, necklace });

  } catch (err) {
    console.error("[tryon/generate]", err);
    const necklaceId = "aurora-necklace";
    const necklace = NECKLACE_MAP[necklaceId];
    return NextResponse.json({
      demo: true,
      message: "AI generation unavailable. Showing reference preview.",
      resultImage: necklace.wornReferenceImage,
      necklace,
    });
  }
}
