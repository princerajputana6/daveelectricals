import Image from "next/image";

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`flex items-center ${className}`}>
      <Image
        src="/logo.jpeg"
        alt="Dave Electrical Services"
        width={199}
        height={103}
        priority
        className="h-11 w-auto rounded-md"
      />
    </span>
  );
}
