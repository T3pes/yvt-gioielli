export default function Wordmark({
  brand,
  className = "",
  size = "md",
}: {
  brand: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const parts = brand.trim().split(/\s+/);
  const first = parts[0];
  const rest = parts.slice(1).join(" ");

  const sizes = {
    sm: ["text-[15px]", "text-[8px]"],
    md: ["text-[19px] md:text-[22px]", "text-[8.5px] md:text-[9px]"],
    lg: ["text-[30px] md:text-[38px]", "text-[10px] md:text-[11px]"],
  }[size];

  return (
    <span className={`inline-flex flex-col items-center leading-none ${className}`}>
      <span
        className={`display uppercase ${sizes[0]}`}
        style={{ letterSpacing: "0.26em", textIndent: "0.26em" }}
      >
        {first}
      </span>
      {rest && (
        <span
          className={`mt-[6px] uppercase ${sizes[1]} opacity-70`}
          style={{ letterSpacing: "0.44em", textIndent: "0.44em" }}
        >
          {rest}
        </span>
      )}
    </span>
  );
}
