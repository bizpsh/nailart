"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/designs", label: "Designs" },
  { href: "/admin/inquiries", label: "Inquiries" },
];

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="border-b border-black/10 bg-accent-soft/40 dark:border-white/10">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
        <div className="flex items-center gap-6">
          <span className="text-sm font-semibold tracking-tight text-accent">
            Admin
          </span>
          <ul className="flex gap-4 text-sm">
            {links.map((link) => {
              const isActive =
                link.href === "/admin"
                  ? pathname === "/admin"
                  : pathname?.startsWith(link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={
                      isActive
                        ? "font-medium text-accent"
                        : "opacity-70 transition-colors hover:opacity-100 hover:text-accent"
                    }
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="rounded-md border border-black/10 px-3 py-1.5 text-sm transition-colors hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/10"
        >
          Logout
        </button>
      </nav>
    </div>
  );
}
