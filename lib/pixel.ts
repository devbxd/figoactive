// Thin wrapper around window.fbq (Meta Pixel) — safe to call from any
// client component even before the pixel script has loaded or if
// NEXT_PUBLIC_META_PIXEL_ID isn't set, since fbq just won't exist yet.
export function trackPixelEvent(event: string, params?: Record<string, unknown>) {
  if (typeof window !== "undefined") window.fbq?.("track", event, params);
}
