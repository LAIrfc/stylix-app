export type JewelryCategory = "rings" | "necklaces" | "earrings" | "bracelets";

export type StyleTag =
  | "classic"
  | "bold"
  | "celestial"
  | "romantic"
  | "minimal"
  | "elegant"
  | "minimalist";

export type OccasionTag =
  | "black-tie"
  | "wedding guest"
  | "date night"
  | "work"
  | "casual brunch"
  | "holiday gift";

export type MoodTag =
  | "confident"
  | "dreamy"
  | "sensual"
  | "polished"
  | "playful"
  | "powerful";

export type MaterialFilter = "silver" | "gold" | "moissanite" | "diamond-style";

/**
 * Top-level collection category used for tab navigation.
 * - "celestial-essentials"  — Stylix signature symbolic pieces
 * - "designer-capsule"      — Curated independent designer collaborations
 * - "ai-concept-archive"    — Experimental / AI-concept pieces (limited visibility)
 */
export type CollectionCategory =
  | "celestial-essentials"
  | "designer-capsule"
  | "ai-concept-archive";

export interface ProductTags {
  styleTags: StyleTag[];
  occasionTags: OccasionTag[];
  moodTags: MoodTag[];
  metalTone: "silver" | "gold" | "rose-gold" | "mixed";
  collectionName: string;
  /** Top-level collection category for tab navigation. */
  collectionCategory: CollectionCategory;
}

export interface ProductAsset {
  imageUrl: string;
  alt: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  category: JewelryCategory;
  description: string;
  narrative: string;
  material: string;
  price: number;
  priceLabel?: string;
  /** Zodiac sign(s) most resonant with this piece's symbolism. */
  zodiacAffinity?: string[];
  /** Short symbolic meaning of the design. */
  symbolism?: string;
  /** Material energy/meaning note. */
  materialEnergy?: string;
  /** Styling note — what to wear it with. */
  stylingNotes?: string;
  /** Available customization options for Private Atelier. */
  customizationOptions?: string[];
  /** Display image used on collection/product cards. NOT used as AR overlay. */
  coverImage: string;
  gallery: ProductAsset[];
  tags: ProductTags;
  isFeatured: boolean;
  /** Max budget tier this piece fits (1–4). Used by advisor optional filter. */
  budgetTier: 1 | 2 | 3 | 4;
  /**
   * Transparent PNG or WebP used exclusively for the virtual try-on AR overlay.
   * Must have no background — ring/jewelry shape only on a fully transparent canvas.
   * Minimum 400×400 px. No drop shadow, no fill background, no white box.
   * Naming convention: /public/tryon/{slug}.png  (e.g. /public/tryon/aurora-celestial-band.png)
   * If absent, the try-on page draws a gold guide outline on the detected ring finger
   * and shows the exact file path needed. Do NOT use coverImage here.
   */
  tryOnAsset?: string;
  /**
   * Path to a .glb 3D model used for real-time Three.js ring rendering in webcam mode.
   * When present, the 3D renderer takes over from the 2D PNG overlay.
   * Naming convention: /public/models/{slug}.glb
   */
  model3D?: string;
  /** Designer or brand that created this piece (e.g. "Kiki Wang Jewelry"). */
  collaboratorName?: string;
  /** Short bio of the collaborating designer. */
  collaboratorBio?: string;
  /** Story or editorial note for the collection this piece belongs to. */
  collectionStory?: string;
  /** Designer's own note about the piece — shown on product detail page. */
  designerNote?: string;
}
