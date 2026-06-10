import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/server";

type Gender = "female" | "male" | "non-binary" | "prefer-not-to-say";

interface WaitlistPayload {
  email?: unknown;
  name?: unknown;
  country?: unknown;
  gender?: unknown;
  source?: unknown;
}

const GENDERS = new Set<Gender>(["female", "male", "non-binary", "prefer-not-to-say"]);

function normalizeEmail(value: unknown) {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

function normalizeText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeGender(value: unknown): Gender | null {
  if (typeof value !== "string") return null;
  return GENDERS.has(value as Gender) ? (value as Gender) : null;
}

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export async function POST(req: NextRequest) {
  let body: WaitlistPayload;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const email = normalizeEmail(body.email);
  const name = normalizeText(body.name);
  const country = normalizeText(body.country);
  const gender = normalizeGender(body.gender);
  const source = normalizeText(body.source);

  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }

  if (!country) {
    return NextResponse.json({ error: "Enter your country." }, { status: 400 });
  }

  if (!gender) {
    return NextResponse.json({ error: "Select a gender option." }, { status: 400 });
  }

  try {
    const db = getSupabaseAdmin();
    const { error } = await db
      .schema("public")
      .from("early_access_waitlist")
      .upsert(
        {
          email,
          name: name || null,
          country,
          gender,
          source: source || null,
        },
        { onConflict: "email" }
      );

    if (error) {
      console.error("[waitlist] insert failed", {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint,
      });
      return NextResponse.json({ error: "Waitlist submission unavailable." }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[waitlist] supabase unavailable", err);
    return NextResponse.json({ error: "Waitlist submission unavailable." }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization") ?? "";
  const token = auth.replace("Bearer ", "").trim();
  const adminPassword = process.env.ADMIN_PASSWORD ?? "stylix-admin-2024";

  if (token !== adminPassword) return unauthorized();

  try {
    const db = getSupabaseAdmin();
    const { data, error } = await db
      .schema("public")
      .from("early_access_waitlist")
      .select("id, email, name, country, gender, source, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[waitlist] list failed", {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint,
      });
      return NextResponse.json({ error: "Waitlist data unavailable." }, { status: 500 });
    }

    return NextResponse.json({ users: data ?? [] });
  } catch (err) {
    console.error("[waitlist] supabase unavailable", err);
    return NextResponse.json({ error: "Waitlist data unavailable." }, { status: 500 });
  }
}
