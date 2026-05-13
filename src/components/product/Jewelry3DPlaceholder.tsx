/**
 * MVP: CSS-based rotating jewelry silhouette.
 * Future: load `model_3d_url` from `product_assets` via <model-viewer> or Three.js scene.
 * See https://modelviewer.dev/ for drop-in glTF viewer when assets are ready.
 */

export function Jewelry3DPlaceholder({ label = "3D preview" }: { label?: string }) {
  return (
    <div className="relative flex aspect-square w-full max-w-md items-center justify-center overflow-hidden rounded-sm border border-ivory/10 bg-gradient-to-b from-ink-muted to-ink-deep">
      <div className="absolute inset-0 bg-subtle-radial opacity-90" aria-hidden />
      <div
        className="relative h-48 w-48 animate-spin rounded-full border-2 border-gold/40 shadow-[0_0_60px_rgba(201,169,98,0.15)]"
        style={{ animationDuration: "22s" }}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="h-36 w-36 rounded-full border border-gold/20 bg-ink-deep/40 backdrop-blur-sm" />
      </div>
      <p className="absolute bottom-6 left-0 right-0 text-center text-[10px] uppercase tracking-[0.3em] text-ivory-dim">
        {label}
      </p>
    </div>
  );
}
