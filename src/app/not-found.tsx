import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 pt-24 text-center">
      <p className="text-xs uppercase tracking-[0.35em] text-gold">404</p>
      <h1 className="mt-6 font-serif text-3xl text-ivory md:text-4xl">This piece has moved</h1>
      <p className="mt-4 max-w-md text-sm text-ivory-dim">
        The page you requested is not in our current edit. Return to the collection or speak with
        the advisor.
      </p>
      <div className="mt-10 flex flex-wrap justify-center gap-4">
        <ButtonLink href="/collection">Collection</ButtonLink>
        <ButtonLink href="/" variant="outline">
          Home
        </ButtonLink>
      </div>
      <Link href="/advisor" className="mt-8 text-xs uppercase tracking-widest text-ivory-dim hover:text-gold">
        AI Advisor
      </Link>
    </div>
  );
}
