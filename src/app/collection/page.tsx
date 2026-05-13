import { Suspense } from "react";
import { CollectionView } from "./CollectionView";

export default function CollectionPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center pt-24 text-sm text-stone-400">
          Loading collection…
        </div>
      }
    >
      <CollectionView />
    </Suspense>
  );
}
