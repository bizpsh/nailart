export default function Footer() {
  return (
    <footer className="border-t border-black/10 dark:border-white/10">
      <div className="mx-auto max-w-5xl px-6 py-8 text-sm opacity-70">
        © {new Date().getFullYear()} Nailart. All rights reserved.
      </div>
    </footer>
  );
}
