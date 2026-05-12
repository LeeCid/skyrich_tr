import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Logo } from "@/components/brand/logo";

export function Navbar() {
  const [location] = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { href: "/", label: "Ana Sayfa" },
    { href: "/urunler", label: "Ürünler" },
    { href: "/aku-bulucu", label: "Akü Bulucu" },
    { href: "/hakkimizda", label: "Hakkımızda" },
    { href: "/iletisim", label: "İletişim" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="premium-container h-24 flex items-center justify-between">
        <Link href="/" className="flex items-center group">
          <Logo 
            variant="navLarge" 
            preferredFormat="png"
            className="h-12 max-w-[280px] md:h-16 md:max-w-[400px] transition-transform duration-300 group-hover:scale-105" 
            alt="Skyrich Battery Türkiye" 
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-10">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-sm font-bold uppercase tracking-wider transition-all duration-300 relative group ${
                location === item.href ? "text-primary" : "text-text-secondary hover:text-primary"
              }`}
            >
              {item.label}
              <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ${
                location === item.href ? "scale-x-100" : ""
              }`} />
            </Link>
          ))}
        </nav>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-3 text-foreground rounded-md hover:bg-tonal-panel transition-colors border border-transparent hover:border-border"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle Menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-xl px-4 py-6 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsMenuOpen(false)}
              className={`block px-4 py-3 rounded-md text-sm font-bold uppercase tracking-wider transition-all ${
                location === item.href
                  ? "text-primary bg-tonal-panel border border-primary/30"
                  : "text-text-secondary hover:bg-tonal-panel hover:text-primary hover:border-border border border-transparent"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
