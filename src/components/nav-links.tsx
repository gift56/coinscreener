"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function NavLinks() {
  const pathname = usePathname();
  return (
    <Link
      href="/coins"
      className={cn("nav-link", {
        "is-active": pathname === "/coins",
      })}
    >
      All Coins
    </Link>
  );
}
