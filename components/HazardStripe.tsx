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
          "repeating-linear-gradient(-45deg, #e2e61f 0 28px, #050505 28px 56px)",
      }}
    />
  );
}
