// Canonical event names used across the app
export const EVENTS = {
  PAGE_VIEW: "page_view",
  COLLECTION_VIEW: "collection_view",
  PRODUCT_VIEW: "product_view",
  VIEW_3D_OPEN: "3d_view_open",
  VIEWER_3D_OPEN: "3d_viewer_open",
  VIEWER_3D_INTERACT: "3d_viewer_interact",
  TRYON_START: "tryon_start",
  TRYON_COMPLETE: "tryon_complete",
  ADVISOR_SUBMIT: "advisor_submit",
  ADVISOR_RESULT_VIEW: "advisor_result_view",
  ADVISOR_TOOL_CLICK: "advisor_tool_click",
  ADD_TO_CART: "add_to_cart",
  CART_VIEW: "cart_view",
  CHECKOUT_START: "checkout_start",
  CHECKOUT_SUBMIT: "checkout_submit",
  PURCHASE: "purchase",
  VIP_REQUEST: "vip_request",
  NEWSLETTER_SUBSCRIBE: "newsletter_subscribe",
  ATELIER_SUBMIT: "atelier_submit",
  ATELIER_PROFILE_VIEW: "atelier_profile_view",
} as const;

export type EventName = (typeof EVENTS)[keyof typeof EVENTS];
