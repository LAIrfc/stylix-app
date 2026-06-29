import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import type { AtelierAnswers, AtelierProfile } from "@/lib/atelier/engine";

interface AtelierLeadPayload {
  email?: unknown;
  answers?: Partial<AtelierAnswers>;
  profile?: Partial<AtelierProfile>;
}

export async function POST(req: NextRequest) {
  let body: AtelierLeadPayload;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const email =
    typeof body.email === "string" ? body.email.trim().toLowerCase() : "";

  if (!email || !email.includes("@")) {
    return NextResponse.json(
      { error: "Enter a valid email address." },
      { status: 400 }
    );
  }

  const answers = body.answers ?? {};
  const profile = body.profile ?? {};

  if (!answers.identity || !answers.occasion || !answers.aesthetic || !answers.investment) {
    return NextResponse.json(
      { error: "Incomplete wizard answers." },
      { status: 400 }
    );
  }

  if (!profile.archetype || !profile.styleDna || !profile.occasionMatch || !profile.collection || !profile.whyPiece) {
    return NextResponse.json(
      { error: "Incomplete profile data." },
      { status: 400 }
    );
  }

  try {
    const db = getSupabaseAdmin();
    const { error } = await db.schema("public").from("atelier_leads").insert({
      email,
      identity: answers.identity,
      occasion: answers.occasion,
      aesthetic: answers.aesthetic,
      investment: answers.investment,
      story: answers.story || null,
      archetype: profile.archetype,
      style_dna: profile.styleDna,
      occasion_match: profile.occasionMatch,
      collection: profile.collection,
      why_piece: profile.whyPiece,
      source: "atelier-wizard",
    });

    if (error) {
      console.error("[atelier] insert failed", {
        code: error.code,
        message: error.message,
      });
      return NextResponse.json(
        { error: "Unable to save your profile." },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[atelier] unexpected error", err);
    return NextResponse.json({ error: "Internal error." }, { status: 500 });
  }
}
