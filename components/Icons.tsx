import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  viewBox: "0 0 24 24",
};

export function BoltIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function PlugIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M9 2v6M15 2v6" />
      <path d="M7 8h10v3a5 5 0 0 1-5 5 5 5 0 0 1-5-5V8Z" />
      <path d="M12 16v6" />
    </svg>
  );
}

export function BuildingIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18" />
      <path d="M16 9h2a2 2 0 0 1 2 2v11" />
      <path d="M8 6h2M8 10h2M8 14h2M3 22h18" />
    </svg>
  );
}

export function ShieldIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 2 4 5v6c0 5 3.4 9.4 8 11 4.6-1.6 8-6 8-11V5l-8-3Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

export function ClockIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </svg>
  );
}

export function TestIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M9 3h6M10 3v6l-4.5 9A2 2 0 0 0 7.3 21h9.4a2 2 0 0 0 1.8-3L14 9V3" />
      <path d="M7 15h10" />
    </svg>
  );
}

export function BulbIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M9 18h6M10 21h4" />
      <path d="M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.2 1 2v.3h6v-.3c0-.8.4-1.5 1-2A7 7 0 0 0 12 2Z" />
    </svg>
  );
}

export function BellIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2H4.5L6 16Z" />
      <path d="M10 20a2 2 0 0 0 4 0" />
    </svg>
  );
}

export function SirenIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M6 14a6 6 0 0 1 12 0v3H6v-3Z" />
      <path d="M4 21h16M12 4V2M5 7 3.5 5.5M19 7l1.5-1.5" />
    </svg>
  );
}

export function EvIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M3 7a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v12H3V7Z" />
      <path d="M15 11h2l2 3v5a1.5 1.5 0 0 1-3 0v-1h-1" />
      <path d="M7 11l-1.5 3H8L7 17" />
    </svg>
  );
}

export function CameraIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M3 8a2 2 0 0 1 2-2h2l1.5-2h7L17 6h2a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8Z" />
      <circle cx="12" cy="13" r="3.5" />
    </svg>
  );
}

export function SolarIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 14h16l-1.5-6H5.5L4 14Z" />
      <path d="M4 14h16M9.5 8l-.7 6M14.5 8l.7 6M12 17v3M9 20h6" />
      <path d="M12 2v1.5M4.9 4.9l1 1M19.1 4.9l-1 1" />
    </svg>
  );
}

export function ClipboardIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="6" y="4" width="12" height="17" rx="2" />
      <path d="M9 4V3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1" />
      <path d="M9 11h6M9 15h6" />
    </svg>
  );
}

export function PhoneIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M5 3h4l2 5-3 2a14 14 0 0 0 6 6l2-3 5 2v4a2 2 0 0 1-2 2A17 17 0 0 1 3 5a2 2 0 0 1 2-2Z" />
    </svg>
  );
}

export function MailIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}

export function PinIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 22s7-6 7-12a7 7 0 0 0-14 0c0 6 7 12 7 12Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="m4 12 5 5L20 6" />
    </svg>
  );
}

export function ArrowIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export function WhatsAppIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 2a10 10 0 0 0-8.6 15l-1.3 4.7 4.8-1.3A10 10 0 1 0 12 2Zm0 18a8 8 0 0 1-4.1-1.1l-.3-.2-2.8.8.8-2.8-.2-.3A8 8 0 1 1 12 20Zm4.4-6c-.2-.1-1.4-.7-1.7-.8-.2-.1-.4-.1-.5.1-.2.2-.6.8-.8 1-.1.1-.3.2-.5.1a6.6 6.6 0 0 1-3.3-2.9c-.2-.4.2-.4.6-1.2.1-.1 0-.3 0-.4l-.7-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-1 2.3c0 1.3 1 2.6 1.1 2.8.2.2 2 3.1 5 4.3 1.8.8 2.5.8 3.4.7.5-.1 1.4-.6 1.6-1.2.2-.6.2-1 .1-1.2 0-.1-.2-.2-.5-.3Z" />
    </svg>
  );
}

export function LinkedInIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M4.98 3.5A2.5 2.5 0 1 0 5 8.5a2.5 2.5 0 0 0-.02-5ZM3 9h4v12H3V9Zm6 0h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.5c0-1.31-.02-3-1.83-3-1.83 0-2.11 1.43-2.11 2.9V21H9V9Z" />
    </svg>
  );
}

export function InstagramIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 2.2c3.2 0 3.6 0 4.85.07 1.17.05 1.8.25 2.23.42.56.21.96.47 1.38.89.42.42.68.82.89 1.38.17.42.36 1.06.42 2.23.06 1.27.07 1.65.07 4.85s0 3.58-.07 4.85c-.06 1.17-.25 1.8-.42 2.23-.21.56-.47.96-.89 1.38-.42.42-.82.68-1.38.89-.42.17-1.06.36-2.23.42-1.27.06-1.65.07-4.85.07s-3.58 0-4.85-.07c-1.17-.06-1.8-.25-2.23-.42a3.8 3.8 0 0 1-1.38-.89 3.8 3.8 0 0 1-.89-1.38c-.17-.42-.36-1.06-.42-2.23C2.2 15.58 2.2 15.2 2.2 12s0-3.58.07-4.85c.06-1.17.25-1.8.42-2.23.21-.56.47-.96.89-1.38.42-.42.82-.68 1.38-.89.42-.17 1.06-.36 2.23-.42C8.42 2.2 8.8 2.2 12 2.2Zm0 1.8c-3.15 0-3.5 0-4.74.07-.9.04-1.39.19-1.71.32-.43.17-.74.37-1.06.69-.32.32-.52.63-.69 1.06-.13.32-.28.81-.32 1.71C3.4 8.5 3.4 8.85 3.4 12s0 3.5.07 4.74c.04.9.19 1.39.32 1.71.17.43.37.74.69 1.06.32.32.63.52 1.06.69.32.13.81.28 1.71.32 1.24.07 1.59.07 4.74.07s3.5 0 4.74-.07c.9-.04 1.39-.19 1.71-.32.43-.17.74-.37 1.06-.69.32-.32.52-.63.69-1.06.13-.32.28-.81.32-1.71.07-1.24.07-1.59.07-4.74s0-3.5-.07-4.74c-.04-.9-.19-1.39-.32-1.71a2.85 2.85 0 0 0-.69-1.06 2.85 2.85 0 0 0-1.06-.69c-.32-.13-.81-.28-1.71-.32C15.5 4 15.15 4 12 4Zm0 3.05A4.95 4.95 0 1 1 12 17a4.95 4.95 0 0 1 0-9.9Zm0 1.8a3.15 3.15 0 1 0 0 6.3 3.15 3.15 0 0 0 0-6.3Zm5.15-.9a1.15 1.15 0 1 1 0 2.3 1.15 1.15 0 0 1 0-2.3Z" />
    </svg>
  );
}

export function MenuIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M3 6h18M3 12h18M3 18h18" />
    </svg>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

export function DashboardIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="3" y="3" width="7" height="9" rx="1.5" />
      <rect x="14" y="3" width="7" height="5" rx="1.5" />
      <rect x="14" y="12" width="7" height="9" rx="1.5" />
      <rect x="3" y="16" width="7" height="5" rx="1.5" />
    </svg>
  );
}

export function UsersIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2 21v-2a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4v2" />
      <circle cx="17" cy="9" r="2.5" />
      <path d="M22 21v-1.5a3.5 3.5 0 0 0-3.5-3.5H17" />
    </svg>
  );
}

export function SettingsIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}

export function ChartIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M3 21h18" />
      <path d="M7 21V11M12 21V5M17 21v-7" />
    </svg>
  );
}

export function HouseIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M3 11 12 3l9 8" />
      <path d="M5 10v10h14V10" />
      <path d="M10 20v-6h4v6" />
    </svg>
  );
}

export function RestaurantIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M7 2v9a3 3 0 0 0 6 0V2M10 11v11" />
      <path d="M17 2c-1.5 1-2 3-2 5v5h2v9" />
    </svg>
  );
}

export function ShopIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M3 9h18l-1 11H4L3 9Z" />
      <path d="M3 9 5 4h14l2 5" />
      <path d="M9 13a3 3 0 0 0 6 0" />
    </svg>
  );
}

export function FactoryIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M3 21V11l5 3V11l5 3V7l8 6v8H3Z" />
      <path d="M7 17h2M13 17h2M17 17h2" />
    </svg>
  );
}

export function SchoolIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M2 9 12 4l10 5-10 5L2 9Z" />
      <path d="M6 11v4c0 2 3 3 6 3s6-1 6-3v-4" />
      <path d="M22 9v6" />
    </svg>
  );
}

export function HospitalIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 22V4h16v18" />
      <path d="M12 7v8M8 11h8" />
      <path d="M3 22h18" />
    </svg>
  );
}

export function CouncilIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M3 22h18M4 22V10l8-6 8 6v12" />
      <path d="M7 22V13M12 22v-9M17 22V13" />
    </svg>
  );
}

export function PubIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M7 3h10v7a5 5 0 0 1-10 0V3Z" />
      <path d="M17 6h2a2 2 0 0 1 0 4h-2" />
      <path d="M9 15v6M15 15v6M6 21h12" />
    </svg>
  );
}

export function BagIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M5 8h14l-1 12a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 8Z" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" />
    </svg>
  );
}

export function FlagIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M5 21V4M5 4h11l-2 4 2 4H5" />
    </svg>
  );
}

export function TruckIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M2 7h11v10H2zM13 10h5l3 3v4h-8" />
      <circle cx="6.5" cy="18" r="1.8" />
      <circle cx="16.5" cy="18" r="1.8" />
    </svg>
  );
}

export function StarIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="m12 2 3 6.3 6.9.9-5 4.8 1.3 6.8L12 17.6 5.8 20.8l1.3-6.8-5-4.8 6.9-.9L12 2Z" />
    </svg>
  );
}

export const serviceIcons: Record<
  string,
  (props: IconProps) => React.JSX.Element
> = {
  plug: PlugIcon,
  building: BuildingIcon,
  shield: ShieldIcon,
  clock: ClockIcon,
  test: TestIcon,
  bulb: BulbIcon,
  bell: BellIcon,
  siren: SirenIcon,
  ev: EvIcon,
  camera: CameraIcon,
  solar: SolarIcon,
  clipboard: ClipboardIcon,
};

export const sectorIcons: Record<
  string,
  (props: IconProps) => React.JSX.Element
> = {
  house: HouseIcon,
  restaurant: RestaurantIcon,
  shop: ShopIcon,
  factory: FactoryIcon,
  school: SchoolIcon,
  hospital: HospitalIcon,
  council: CouncilIcon,
  pub: PubIcon,
};
