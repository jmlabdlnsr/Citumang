import type { ReactNode, SVGProps } from "react";

export type IconName =
  | "arrow"
  | "up-right"
  | "pin"
  | "waves"
  | "leaf"
  | "shield"
  | "camera"
  | "sun"
  | "chat"
  | "close"
  | "menu"
  | "chevron"
  | "check"
  | "mail"
  | "compass";

export function Icon({
  name,
  ...props
}: SVGProps<SVGSVGElement> & { name: IconName }) {
  const paths: Record<IconName, ReactNode> = {
    arrow: <path d="M4 12h15M13 6l6 6-6 6" />,
    "up-right": <path d="M6 18 18 6M6 6h12v12" />,
    pin: (
      <>
        <path d="M20 10c0 6-8 11-8 11S4 16 4 10a8 8 0 1 1 16 0Z" />
        <circle cx="12" cy="10" r="2.5" />
      </>
    ),
    waves: (
      <path d="M2 6c3-4 7 4 10 0s7 4 10 0M2 12c3-4 7 4 10 0s7 4 10 0M2 18c3-4 7 4 10 0s7 4 10 0" />
    ),
    leaf: (
      <>
        <path d="M20 3C8 2 2 9 6 16s16 4 14-13Z" />
        <path d="M3 21 15 9M8 16v-5M8 16h5" />
      </>
    ),
    shield: (
      <>
        <path d="m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6l8-3Z" />
        <path d="m8 12 3 3 5-6" />
      </>
    ),
    camera: (
      <>
        <path d="M8 6 10 3h4l2 3h4a1 1 0 0 1 1 1v12H3V7a1 1 0 0 1 1-1Z" />
        <circle cx="12" cy="12" r="4" />
      </>
    ),
    sun: (
      <>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5 19 19M5 19l1.5-1.5M17.5 6.5 19 5" />
      </>
    ),
    chat: (
      <>
        <path d="M21 11.5a9 9 0 0 1-13.5 7.8L3 21l1.6-4.8A9 9 0 1 1 21 11.5Z" />
        <path d="M8 7c0 5 4 9 8 8l1-2-3-1-1 1-2-2 1-1-2-3Z" />
      </>
    ),
    close: <path d="m6 6 12 12M6 18 18 6" />,
    menu: <path d="M4 6h16M4 12h16M4 18h16" />,
    chevron: <path d="m6 9 6 6 6-6" />,
    check: <path d="m5 12 4 4L19 6" />,
    mail: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 6 9 7 9-7" />
      </>
    ),
    compass: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="m16 8-2 6-6 2 2-6Z" />
      </>
    ),
  };
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {paths[name]}
    </svg>
  );
}

export function Brand({
  inverted = false,
  homeLabel,
}: {
  inverted?: boolean;
  homeLabel: string;
}) {
  return (
    <a
      className={`group inline-flex shrink-0 items-center gap-2.5 text-2xl font-extrabold tracking-tight transition-colors max-[700px]:gap-2 max-[700px]:text-xl ${inverted ? "text-white" : "text-[var(--foreground)]"}`}
      href="#beranda"
      aria-label={homeLabel}
    >
      <svg
        className="size-10 transition-transform duration-200 group-hover:-rotate-6 max-[700px]:size-8"
        width="39"
        height="39"
        viewBox="0 0 40 40"
        fill="none"
        aria-hidden="true"
      >
        <circle cx="20" cy="20" r="20" fill="#d87842" />
        <circle cx="26" cy="12" r="5" fill="#f7d8a6" />
        <path d="M0 26c9-12 15-11 24-5 6 4 11 2 16-2v21H0Z" fill="#a94f2b" />
        <path
          d="M14 20c19 1-10 9 3 13 3 1 7 1 11 0"
          stroke="white"
          strokeWidth="2.6"
          strokeLinecap="round"
        />
      </svg>
      <span>
        Citumang<span className="text-[#e58b50]">.</span>
      </span>
    </a>
  );
}
