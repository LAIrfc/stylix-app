export interface AtelierAnswers {
  identity: string;
  occasion: string;
  aesthetic: string;
  investment: string;
  story: string;
}

export interface AtelierProfile {
  archetype: string;
  styleDna: string;
  occasionMatch: string;
  collection: string;
  whyPiece: string;
}

// ── Archetypes: aesthetic × identity ──────────────────────────────────────────
const ARCHETYPES: Record<string, Record<string, string>> = {
  "quiet-luxury": {
    female: "The Understated Sovereign",
    male: "The Quiet Authority",
    "non-binary": "The Refined Presence",
    couple: "The Composed Alliance",
    "gift-giver": "The Considerate Patron",
  },
  "old-money": {
    female: "The Inherited Grace",
    male: "The Established Gentleman",
    "non-binary": "The Timeless Collector",
    couple: "The Legacy Union",
    "gift-giver": "The Discerning Benefactor",
  },
  romantic: {
    female: "The Velvet Protagonist",
    male: "The Tender Architect",
    "non-binary": "The Soft Luminary",
    couple: "The Devoted Chapter",
    "gift-giver": "The Thoughtful Romantic",
  },
  minimalist: {
    female: "The Precision Edit",
    male: "The Essential Form",
    "non-binary": "The Quiet Reduction",
    couple: "The Spare Geometry",
    "gift-giver": "The Deliberate Giver",
  },
  artistic: {
    female: "The Sculptural Voice",
    male: "The Material Thinker",
    "non-binary": "The Form Poet",
    couple: "The Creative Dialogue",
    "gift-giver": "The Curator",
  },
  mystical: {
    female: "The Moon-Touched",
    male: "The Star-Guided",
    "non-binary": "The Cosmic Wanderer",
    couple: "The Celestial Bond",
    "gift-giver": "The Symbolic Messenger",
  },
  "avant-garde": {
    female: "The Rule Rewriter",
    male: "The Structural Rebel",
    "non-binary": "The Category Dissolve",
    couple: "The Vanguard Pair",
    "gift-giver": "The Bold Patron",
  },
};

// ── Style DNA: per aesthetic ───────────────────────────────────────────────────
const STYLE_DNA: Record<string, string> = {
  "quiet-luxury": "Your aesthetic speaks in restraint. Brushed 18K gold, clean lines, and weight without ornamentation — jewelry that commands a room without announcing itself. The pieces you wear are not accessories. They are conclusions.",
  "old-money": "Your sensibility is rooted in permanence. Polished yellow gold, heirloom-weight chains, and stones chosen for rarity rather than flash. You are drawn to pieces that feel inherited rather than purchased — objects that carry time.",
  romantic: "Your aesthetic is emotional and deliberate. Rose gold, freshwater pearl, and soft-faceted stones that catch light gently. You wear jewelry the way you carry feeling — openly, with intention, and without apology.",
  minimalist: "Your eye edits until only the essential remains. Sterling silver, brushed surfaces, and architectural proportions. Every piece you choose is a commitment — worn because it is irreplaceable, not decorative.",
  artistic: "Your aesthetic refuses category. Oxidized silver, asymmetric forms, and materials chosen for tactile interest as much as beauty. You are drawn to pieces that are also objects — small sculptures that happen to be worn.",
  mystical: "Your aesthetic is cosmological. Labradorite, moonstone, dark rhodium, and forms drawn from celestial cartography. You wear jewelry that carries meaning — not as superstition, but as personal mythology.",
  "avant-garde": "Your aesthetic operates at the edge of form. Geometric tension, unexpected material combinations, and silhouettes that challenge proportion. You wear pieces that are conversations, not conclusions.",
};

// ── Occasion Match: per occasion ──────────────────────────────────────────────
const OCCASION_MATCH: Record<string, string> = {
  wedding: "A wedding demands jewelry that holds weight across decades. Your profile calls for a piece that will read as significant in photographs fifty years from now — not a trend, but a marker of a moment that mattered.",
  "business-dinner": "The business dinner is a performance of confidence. Your profile calls for a single considered piece — something that signals taste without distraction. Jewelry that closes the room without opening a conversation.",
  "daily-luxury": "Daily luxury is the hardest discipline. Your profile calls for a piece that earns its place every morning — something light enough to forget, significant enough to notice when it is absent.",
  travel: "Travel jewelry must survive everything and still arrive elegant. Your profile calls for a piece with structural integrity — something that moves through time zones and light conditions without losing its intention.",
  anniversary: "An anniversary piece must speak to duration and depth. Your profile calls for something that acknowledges what has been built — not a gesture, but a material acknowledgment of continued choice.",
  "special-event": "A special event is permission for the exceptional. Your profile calls for a statement that matches the occasion — a piece significant enough to be remembered as part of the evening itself.",
  gift: "The most considered gifts are not chosen — they are curated. Your profile calls for a piece that communicates understanding of the recipient rather than generosity of the giver. The difference is everything.",
};

// ── Collection: investment × aesthetic ────────────────────────────────────────
const COLLECTION: Record<string, Record<string, string>> = {
  "under-300": {
    "quiet-luxury": "Celestial Essentials — Entry Collection",
    "old-money": "Celestial Essentials — Classic Line",
    romantic: "Celestial Essentials — Soft Forms",
    minimalist: "Celestial Essentials — Reduction Series",
    artistic: "Celestial Essentials — Object Study",
    mystical: "Celestial Essentials — Symbolic Series",
    "avant-garde": "Celestial Essentials — Edge Study",
  },
  "300-1000": {
    "quiet-luxury": "Designer Capsule — Quiet Edition",
    "old-money": "Designer Capsule — Heritage Line",
    romantic: "Designer Capsule — Soft Archive",
    minimalist: "Designer Capsule — Precision Series",
    artistic: "Designer Capsule — Sculptural Edit",
    mystical: "Designer Capsule — Celestial Archive",
    "avant-garde": "Designer Capsule — Structural Series",
  },
  "1000-5000": {
    "quiet-luxury": "Private Atelier — Signature Collection",
    "old-money": "Private Atelier — Heirloom Series",
    romantic: "Private Atelier — Devotion Collection",
    minimalist: "Private Atelier — Reduction Archive",
    artistic: "Private Atelier — Material Dialogue",
    mystical: "Private Atelier — Cosmic Archive",
    "avant-garde": "Private Atelier — Vanguard Series",
  },
  "5000-plus": {
    "quiet-luxury": "Private Atelier — Bespoke Commission",
    "old-money": "Private Atelier — Legacy Commission",
    romantic: "Private Atelier — Bespoke Devotion",
    minimalist: "Private Atelier — Bespoke Reduction",
    artistic: "Private Atelier — Artist Commission",
    mystical: "Private Atelier — Symbolic Commission",
    "avant-garde": "Private Atelier — Avant Commission",
  },
  bespoke: {
    "quiet-luxury": "Private Atelier — Full Bespoke",
    "old-money": "Private Atelier — Legacy Bespoke",
    romantic: "Private Atelier — Romantic Bespoke",
    minimalist: "Private Atelier — Reduction Bespoke",
    artistic: "Private Atelier — Sculptural Bespoke",
    mystical: "Private Atelier — Celestial Bespoke",
    "avant-garde": "Private Atelier — Vanguard Bespoke",
  },
};

// ── Why This Piece: aesthetic × occasion ──────────────────────────────────────
const WHY_PIECE: Record<string, Record<string, string>> = {
  "quiet-luxury": {
    wedding: "Because the most enduring ceremonies are marked by restraint. A piece that whispers on the day will speak for a lifetime.",
    "business-dinner": "Because influence is felt before it is seen. The right piece confirms what the room already suspects.",
    "daily-luxury": "Because discipline is its own form of luxury. Wearing something excellent every day is a private declaration.",
    travel: "Because elegance should be portable. A considered piece survives every context.",
    anniversary: "Because quiet things last. What endures is not the dramatic gesture but the steady, deliberate one.",
    "special-event": "Because the most memorable evenings are anchored by one thing done perfectly.",
    gift: "Because the most meaningful gifts require no explanation. They arrive already understood.",
  },
  "old-money": {
    wedding: "Because a wedding is where family becomes artifact. Choose something that will be described, not just worn.",
    "business-dinner": "Because old money never announces itself. It is simply present, and that presence is enough.",
    "daily-luxury": "Because true luxury is the refusal to compromise — even privately, even daily.",
    travel: "Because the well-traveled know that quality is the only thing that does not age poorly.",
    anniversary: "Because permanence is a form of love. The piece should feel as though it has always existed.",
    "special-event": "Because some evenings deserve to become part of the family story.",
    gift: "Because to give well is to see clearly. An heirloom-weight gift says: I know who you are.",
  },
  romantic: {
    wedding: "Because your jewelry should feel like the emotion of the day made tangible — something you will reach for on anniversaries.",
    "business-dinner": "Because warmth is not weakness. A romantic piece in a formal context is a quiet act of courage.",
    "daily-luxury": "Because you deserve to feel moved by what you wear, every single morning.",
    travel: "Because the best souvenirs are not bought — they are worn through every landscape.",
    anniversary: "Because this piece should carry the particular warmth of a love that has been chosen again and again.",
    "special-event": "Because some evenings deserve to be felt as much as they are seen.",
    gift: "Because to give romantically is to say: I thought of you when I saw this. That is the whole message.",
  },
  minimalist: {
    wedding: "Because the most precise ceremonies are also the most memorable. One perfect thing, chosen absolutely.",
    "business-dinner": "Because reduction is authority. A single considered piece outperforms an accumulation.",
    "daily-luxury": "Because you have already decided what matters. Your jewelry should reflect that clarity.",
    travel: "Because the minimalist packs one piece that works everywhere. This is it.",
    anniversary: "Because the most honest statement of duration is also the simplest.",
    "special-event": "Because the room will notice the person who wore less and wore it completely.",
    gift: "Because the best gifts are irreducible. One thing, exactly right.",
  },
  artistic: {
    wedding: "Because your ceremony deserves something that has never existed before. A piece that is also a collaboration.",
    "business-dinner": "Because the creative professional who wears something sculptural in a formal room is making a statement about value.",
    "daily-luxury": "Because you live with things that reward attention. Your jewelry should be no different.",
    travel: "Because the artistic eye finds beauty in displacement. A strong piece reads well against every backdrop.",
    anniversary: "Because the most honest anniversary gift is one that could only have been chosen by you, for them.",
    "special-event": "Because you were never going to wear what everyone else wore. This is what you were always going to choose.",
    gift: "Because to give someone an art object is to tell them: I believe you are someone who understands this.",
  },
  mystical: {
    wedding: "Because a wedding is also a ritual. The right piece carries the ceremony forward into every day after.",
    "business-dinner": "Because your symbolic intelligence is also a form of authority. The right piece signals that depth.",
    "daily-luxury": "Because meaning worn daily becomes talisman. Your jewelry is not decoration — it is practice.",
    travel: "Because the traveler who carries symbolic jewelry is never entirely away from what matters.",
    anniversary: "Because celestial things are built for duration. Stars do not observe anniversaries — they simply continue.",
    "special-event": "Because the mystical aesthetic is permission to be entirely yourself in a formal context.",
    gift: "Because a symbolic gift says: I understand what you are reaching for. Here is something that reaches with you.",
  },
  "avant-garde": {
    wedding: "Because your ceremony will not look like anyone else's. It should not be marked by anything that does.",
    "business-dinner": "Because the most disruptive presence in the room is always the one who wore something no one could categorize.",
    "daily-luxury": "Because your daily life is already a formal proposition. Your jewelry should confirm that.",
    travel: "Because the avant-garde traveler arrives as an event. The right piece makes that true from departure.",
    anniversary: "Because to mark a year of genuine partnership is to mark something genuinely unusual. The piece should reflect that.",
    "special-event": "Because you will be remembered. The piece you wear tonight is part of how.",
    gift: "Because to give something avant-garde is to say: I think you are ahead of where everyone else is standing.",
  },
};

export function generateProfile(answers: AtelierAnswers): AtelierProfile {
  const aesthetic = answers.aesthetic ?? "quiet-luxury";
  const identity = answers.identity ?? "female";
  const occasion = answers.occasion ?? "special-event";
  const investment = answers.investment ?? "300-1000";

  const archetype =
    ARCHETYPES[aesthetic]?.[identity] ??
    ARCHETYPES["quiet-luxury"]?.["female"] ??
    "The Refined Presence";

  const styleDna = STYLE_DNA[aesthetic] ?? STYLE_DNA["quiet-luxury"];

  const occasionMatch =
    OCCASION_MATCH[occasion] ?? OCCASION_MATCH["special-event"];

  const collection =
    COLLECTION[investment]?.[aesthetic] ??
    COLLECTION["300-1000"]?.["quiet-luxury"] ??
    "Celestial Essentials";

  const whyPiece =
    WHY_PIECE[aesthetic]?.[occasion] ??
    WHY_PIECE["quiet-luxury"]?.["special-event"] ??
    "Because the right piece is the one that could only have been chosen by you.";

  return { archetype, styleDna, occasionMatch, collection, whyPiece };
}
