import Link from "next/link";

const footerLinks = [
  {
    title: "Platform",
    links: [
      { label: "Reviews", href: "/reviews" },
      { label: "Pathways", href: "/pathways" },
      { label: "Circles", href: "/circles" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "About", href: "/about" },
      { label: "Blog", href: "/blog" },
      { label: "FAQ", href: "/faq" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-6xl px-4 py-16 lg:px-6">
        <div className="flex flex-col items-center text-center">
          <Link href="/" className="inline-block">
            <span className="font-[family-name:var(--font-playfair)] text-2xl font-bold italic text-accent">
              Curator
            </span>
          </Link>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted">
            Find the best online courses. Build learning pathways. Learn together.
          </p>
        </div>

        <div className="mx-auto mt-10 grid max-w-lg grid-cols-3 gap-8 text-center">
          {footerLinks.map((group) => (
            <div key={group.title}>
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted">
                {group.title}
              </h3>
              <ul className="space-y-2">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 border-t border-border pt-6 text-center text-xs text-muted">
          &copy; {new Date().getFullYear()} Curator. Built for self-directed learners.
        </div>
      </div>
    </footer>
  );
}
