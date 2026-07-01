export default function Loading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border border-gold/20 border-t-gold/80" />
        <p className="text-[10px] uppercase tracking-[0.35em] text-ivory/40">Loading</p>
      </div>
    </div>
  );
}
