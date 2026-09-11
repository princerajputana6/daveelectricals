export default function HazardStripe({
  className = "",
  height = 28,
}: {
  className?: string;
  height?: number;
}) {
  return (
    <div
      aria-hidden="true"
      className={`w-full ${className}`}
      style={{
        height,
        backgroundImage:
          "repeating-linear-gradient(-45deg, #14a1e6 0 16px, #ffffff 16px 32px)",
      }}
    />
  );
}
