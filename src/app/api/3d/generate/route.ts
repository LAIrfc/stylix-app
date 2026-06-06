import { NextRequest, NextResponse } from "next/server";
import { products } from "@/lib/data/products";
import { getSupabaseAdmin } from "@/lib/supabase/server";

export const runtime = "nodejs";

interface Generate3DRequest {
  productId?: string;
  imageUrl?: string;
  model3dUrl?: string;
}

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

function isValidUrl(value: string) {
  try {
    const url = new URL(value, "https://stylixai.com");
    return url.protocol === "http:" || url.protocol === "https:" || value.startsWith("/");
  } catch {
    return false;
  }
}

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

function findGlbUrl(payload: unknown): string | null {
  if (!payload || typeof payload !== "object") return null;

  const record = payload as Record<string, unknown>;
  const candidates = [
    record.glbUrl,
    record.model3dUrl,
    record.modelUrl,
    record.url,
    (record.output as Record<string, unknown> | undefined)?.glbUrl,
    (record.output as Record<string, unknown> | undefined)?.modelUrl,
    (record.result as Record<string, unknown> | undefined)?.glbUrl,
    (record.result as Record<string, unknown> | undefined)?.modelUrl,
    (record.assets as Record<string, unknown> | undefined)?.glb,
  ];

  const url = candidates.find((candidate) => typeof candidate === "string" && isValidUrl(candidate));
  return typeof url === "string" ? url : null;
}

async function callImageTo3DProvider(productId: string, imageUrl: string) {
  const endpoint = process.env.IMAGE_TO_3D_API_URL;
  const apiKey = process.env.IMAGE_TO_3D_API_KEY;

  if (!endpoint || !apiKey) {
    return {
      error: "Image-to-3D API is not configured.",
      status: 503,
    };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 120_000);

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ productId, imageUrl }),
      signal: controller.signal,
    });

    const text = await response.text();
    let json: unknown = null;

    try {
      json = text ? JSON.parse(text) : null;
    } catch {
      json = { raw: text };
    }

    if (!response.ok) {
      console.error("[3d/generate] provider error", {
        status: response.status,
        response: json,
      });
      return {
        error: "Image-to-3D provider failed.",
        status: 502,
      };
    }

    const model3dUrl = findGlbUrl(json);
    if (!model3dUrl) {
      console.error("[3d/generate] provider response missing GLB URL", json);
      return {
        error: "Image-to-3D provider returned no GLB URL.",
        status: 502,
      };
    }

    return { model3dUrl };
  } catch (err) {
    const aborted = err instanceof Error && err.name === "AbortError";
    console.error("[3d/generate] provider request failed", err);
    return {
      error: aborted ? "Image-to-3D generation timed out." : "Image-to-3D request failed.",
      status: aborted ? 504 : 502,
    };
  } finally {
    clearTimeout(timeout);
  }
}

async function storeModelUrl(productId: string, imageUrl: string, model3dUrl: string) {
  const product = products.find((item) => item.id === productId);
  const db = getSupabaseAdmin();

  let productQuery = db.schema("public").from("products").select("id").limit(1);
  productQuery = isUuid(productId)
    ? productQuery.eq("id", productId)
    : productQuery.eq("slug", product?.slug ?? productId);

  const { data: dbProduct, error: productError } = await productQuery.maybeSingle();

  if (productError) {
    console.error("[3d/generate] product lookup failed", {
      productId,
      message: productError.message,
      details: productError.details,
      hint: productError.hint,
    });
    throw new Error(productError.message);
  }

  const dbProductId = (dbProduct as { id?: string } | null)?.id;
  if (!dbProductId) {
    console.warn("[3d/generate] product not found in Supabase products table", {
      productId,
      slug: product?.slug,
    });
    return false;
  }

  const { data: existingAsset, error: assetLookupError } = await db
    .schema("public")
    .from("product_assets")
    .select("id")
    .eq("product_id", dbProductId)
    .limit(1)
    .maybeSingle();

  if (assetLookupError) {
    console.error("[3d/generate] product asset lookup failed", {
      productId,
      dbProductId,
      message: assetLookupError.message,
      details: assetLookupError.details,
      hint: assetLookupError.hint,
    });
    throw new Error(assetLookupError.message);
  }

  const existingAssetId = (existingAsset as { id?: string } | null)?.id;

  if (existingAssetId) {
    const { error } = await db
      .schema("public")
      .from("product_assets")
      .update({
        image_url: imageUrl,
        model_3d_url: model3dUrl,
      })
      .eq("id", existingAssetId);

    if (error) {
      console.error("[3d/generate] product asset update failed", {
        productId,
        dbProductId,
        message: error.message,
        details: error.details,
        hint: error.hint,
      });
      throw new Error(error.message);
    }
  } else {
    const { error } = await db
      .schema("public")
      .from("product_assets")
      .insert({
        product_id: dbProductId,
        image_url: imageUrl,
        model_3d_url: model3dUrl,
      });

    if (error) {
      console.error("[3d/generate] product asset insert failed", {
        productId,
        dbProductId,
        message: error.message,
        details: error.details,
        hint: error.hint,
      });
      throw new Error(error.message);
    }
  }

  return true;
}

export async function POST(req: NextRequest) {
  const auth = req.headers.get("authorization") ?? "";
  const token = auth.replace("Bearer ", "").trim();
  const adminPassword = process.env.ADMIN_PASSWORD ?? "stylix-admin-2024";

  if (token !== adminPassword) return unauthorized();

  try {
    const body = (await req.json()) as Generate3DRequest;
    const productId = body.productId?.trim();
    const imageUrl = body.imageUrl?.trim();
    const attachedModelUrl = body.model3dUrl?.trim();

    if (!productId || !imageUrl) {
      return NextResponse.json({ error: "productId and imageUrl are required." }, { status: 400 });
    }

    if (!isValidUrl(imageUrl)) {
      return NextResponse.json({ error: "imageUrl must be a valid URL or site-relative path." }, { status: 400 });
    }

    const product = products.find((item) => item.id === productId);
    if (!product && !isUuid(productId)) {
      return NextResponse.json({ error: `Unknown productId: ${productId}` }, { status: 404 });
    }

    let model3dUrl = attachedModelUrl ?? null;
    if (model3dUrl && !isValidUrl(model3dUrl)) {
      return NextResponse.json({ error: "model3dUrl must be a valid URL or site-relative path." }, { status: 400 });
    }

    if (!model3dUrl) {
      const providerResult = await callImageTo3DProvider(productId, imageUrl);
      if ("error" in providerResult) {
        return NextResponse.json({ error: providerResult.error }, { status: providerResult.status });
      }
      model3dUrl = providerResult.model3dUrl;
    }

    let stored = false;
    try {
      stored = await storeModelUrl(productId, imageUrl, model3dUrl);
    } catch (err) {
      console.error("[3d/generate] failed to store model URL", err);
      return NextResponse.json({ error: "Generated model URL could not be stored." }, { status: 500 });
    }

    return NextResponse.json({
      ok: true,
      stored,
      productId,
      imageUrl,
      model3dUrl,
      product: {
        id: productId,
        model3dUrl,
      },
    });
  } catch (err) {
    console.error("[3d/generate] unexpected error", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
