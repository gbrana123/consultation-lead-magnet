import Image from "next/image";
import { siteConfig } from "@/lib/config";

export function Header() {
  return (
    <header className="relative flex min-h-24 items-center justify-center overflow-hidden bg-deep-green px-5 py-5 sm:min-h-28">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(circle at 50% -50%, rgba(24,237,138,.35), transparent 55%)",
        }}
      />
      <Image
        src={siteConfig.brand.logo}
        alt={siteConfig.brand.logoAlt}
        width={1336}
        height={307}
        priority
        className="relative h-auto w-[170px] object-contain sm:w-[205px]"
      />
    </header>
  );
}
