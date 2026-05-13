/**
 * Schema-aligned TypeScript shapes for Supabase tables (see `supabase/schema.sql`).
 * Use with `@supabase/supabase-js` generated types when connected.
 */

export interface DbUser {
  id: string;
  email: string;
  name: string | null;
  created_at: string;
}

export interface DbProduct {
  id: string;
  name: string;
  category: string;
  description: string;
  material: string;
  price: number;
  cover_image: string;
  is_featured: boolean;
}

export interface DbProductTag {
  product_id: string;
  style_tag: string;
  occasion_tag: string;
  mood_tag: string;
  metal_tone: string;
  collection_name: string;
}

export interface DbProductAsset {
  product_id: string;
  image_url: string;
  model_3d_url: string | null;
  tryon_asset_url: string | null;
}

export interface DbAdvisorSession {
  id: string;
  user_id: string | null;
  outfit_image: string | null;
  occasion: string;
  style: string;
  mood: string;
  budget: string | null;
  jewelry_category: string | null;
  created_at: string;
}

export interface DbAdvisorResult {
  session_id: string;
  recommended_product_ids: string[];
  explanation: string;
  styling_tip: string;
}

export interface DbTryonSession {
  id: string;
  user_id: string | null;
  uploaded_photo_url: string;
  selected_product_id: string;
  result_url: string | null;
  created_at: string;
}

export interface DbCustomizationRequest {
  id: string;
  user_id: string | null;
  inspiration_text: string;
  reference_image: string | null;
  budget_range: string;
  deadline: string | null;
  status: string;
}

export interface DbVipRequest {
  id: string;
  user_id: string | null;
  service_type: string;
  message: string;
  created_at: string;
}

export interface DbNewsletterSubscriber {
  email: string;
  created_at: string;
}
