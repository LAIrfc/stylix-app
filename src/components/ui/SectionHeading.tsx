export function SectionHeading({
  eyebrow,
  title,
  align = "left",
  theme = "light",
}: {
  eyebrow?: string;
  title: string;
  align?: "left" | "center";
  theme?: "light" | "dark";
}) {
  const textColor = theme === "dark" ? "text-ivory" : "text-ink";
  
  return (
    <div className={align === "center" ? "text-center" : ""}>
      {eyebrow && (
        <p className="mb-5 text-[10px] uppercase tracking-[0.5em] text-gold-muted">{eyebrow}</p>
      )}
      <h2 className={`font-serif text-[2rem] leading-[1.2] md:text-[2.5rem] md:leading-[1.15] lg:text-[2.75rem] lg:leading-[1.15] ${textColor}`}>
        {title}
      </h2>
    </div>
  );
}
