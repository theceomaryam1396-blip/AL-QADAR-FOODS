import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  CATEGORIES,
  WHATSAPP_LINK,
  PHONE_DISPLAY,
  EMAIL,
  waOrderLink,
  type MenuItem,
} from "@/data/menu";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import heroImg from "@/assets/hero.jpg";
import cateringImg from "@/assets/cat-catering.jpg";
import niazImg from "@/assets/cat-niaz.jpg";
import ownerImg from "@/assets/owner.svg";
import qrImg from "@/assets/qr.svg";
import logoImg from "@/assets/logo.svg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AL-QADAR FOODS POINT — BBQ, Biryani & Premium Catering in Lahore" },
      {
        name: "description",
        content:
          "Authentic BBQ, biryani, fast food and premium catering in Lahore. Dine-in, delivery, weddings, corporate events & Muharram Niaz. Order on WhatsApp.",
      },
      { property: "og:title", content: "AL-QADAR FOODS POINT — Lahore" },
      {
        property: "og:description",
        content:
          "Premium BBQ & Catering Services in Lahore. Order via WhatsApp.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: Home,
});

type CartLine = { item: MenuItem; categoryName: string; qty: number; key: string };

function Home() {
  const [cart, setCart] = useState<CartLine[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [activeCat, setActiveCat] = useState<string>(CATEGORIES[0].id);
  const [search, setSearch] = useState("");
  const [cateringOpen, setCateringOpen] = useState(false);

  const totalQty = cart.reduce((s, l) => s + l.qty, 0);
  const totalPrice = cart.reduce((s, l) => s + l.qty * l.item.price, 0);

  function addToCart(item: MenuItem, categoryName: string) {
    const key = `${categoryName}-${item.id}`;
    setCart((prev) => {
      const existing = prev.find((l) => l.key === key);
      if (existing)
        return prev.map((l) => (l.key === key ? { ...l, qty: l.qty + 1 } : l));
      return [...prev, { item, categoryName, qty: 1, key }];
    });
    setCartOpen(true);
  }
  function updateQty(key: string, delta: number) {
    setCart((prev) =>
      prev
        .map((l) => (l.key === key ? { ...l, qty: l.qty + delta } : l))
        .filter((l) => l.qty > 0),
    );
  }
  function removeLine(key: string) {
    setCart((prev) => prev.filter((l) => l.key !== key));
  }

  const activeCategory = useMemo(
    () => CATEGORIES.find((c) => c.id === activeCat) ?? CATEGORIES[0],
    [activeCat],
  );
  const filteredItems = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return activeCategory.items;
    return activeCategory.items.filter((i) =>
      (i.name + " " + (i.variant ?? "")).toLowerCase().includes(q),
    );
  }, [activeCategory, search]);

  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);

  const paymentMethods = [
    { label: "Cash on Delivery", icon: "💵", action: "cash" },
    { label: "Easypaisa", icon: "📱", action: "easypaisa" },
    { label: "JazzCash", icon: "💸", action: "jazzcash" },
    { label: "Bank Transfer", icon: "🏦", action: "bank" },
    { label: "Credit Card", icon: "💳", action: "card" },
    { label: "Debit Card", icon: "💳", action: "card" },
  ];

  function handlePaymentSelection(label: string) {
    setSelectedPaymentMethod(label);
    setPaymentModalOpen(true);
  }

  function getPaymentDescription(method: string | null) {
    switch (method) {
      case "Cash on Delivery":
        return "Pay in cash at delivery. Perfect for quick and easy orders.";
      case "Easypaisa":
        return "Send payment using Easypaisa to our registered business number via app or USSD.";
      case "JazzCash":
        return "Send payment using JazzCash to our business wallet, then confirm via WhatsApp.";
      case "Bank Transfer":
        return "Transfer to our bank account. Send the transaction details on WhatsApp after payment.";
      case "Credit Card":
      case "Debit Card":
        return "Use our secure checkout to pay by card, or place your order first and pay on delivery.";
      default:
        return "Select a payment method to get checkout instructions.";
    }
  }

  function getWhatsAppMessage(method: string | null) {
    const base = "Assalam-o-Alaikum, I want to place an order from AL-QADAR FOODS POINT.";
    if (!method) return base;
    return `${base} I would like to pay with ${method}. Please send payment details.`;
  }

  function handleProceedToCheckout() {
    window.open(waOrderLink(getWhatsAppMessage(selectedPaymentMethod)), "_blank");
    setPaymentModalOpen(false);
  }

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <Nav onCartClick={() => setCartOpen(true)} cartCount={totalQty} />

      {/* HERO */}
      <header className="relative isolate overflow-hidden">
        <img
          src={heroImg}
          alt="Sizzling BBQ platter at AL-QADAR FOODS POINT"
          width={1920}
          height={1080}
          fetchPriority="high"
          className="absolute inset-0 h-full w-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background" />
        <div className="relative mx-auto max-w-7xl px-6 py-32 sm:py-40 lg:py-48">
          <div className="max-w-3xl animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-gold">
              ★ Premium Restaurant & Catering · Lahore
            </span>
            <h1 className="mt-6 font-display text-5xl font-bold leading-[1.05] sm:text-6xl lg:text-7xl">
              Authentic <span className="text-gradient-gold">BBQ</span>,
              Biryani & <span className="text-gradient-gold">Premium Catering</span> in Lahore
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
              Fresh, hygienic and delicious food for dine-in, delivery and events —
              weddings, corporate functions, and Muharram arrangements.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <a
                href={waOrderLink(
                  "Assalam-o-Alaikum, I want to place an order from AL-QADAR FOODS POINT.",
                )}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-gold px-7 py-3.5 text-sm font-bold text-gold-foreground shadow-gold transition hover:scale-[1.03]"
              >
                🍽 Order on WhatsApp
              </a>
              <a
                href="#menu"
                className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-card px-7 py-3.5 text-sm font-semibold text-foreground transition hover:border-gold hover:bg-gold/10"
              >
                📖 View Menu
              </a>
              <button
                onClick={() => setCateringOpen(true)}
                className="inline-flex items-center gap-2 rounded-full border border-orange/40 bg-orange/10 px-7 py-3.5 text-sm font-semibold text-orange transition hover:bg-orange/20"
              >
                🍱 Catering Services
              </button>
              <a
                href="#niaz"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-7 py-3.5 text-sm font-semibold text-foreground transition hover:border-gold/40"
              >
                🕌 Muharram Niaz
              </a>
            </div>
            <dl className="mt-12 grid max-w-2xl grid-cols-3 gap-6 border-t border-border pt-8">
              {[
                ["10+", "Years experience"],
                ["50–400", "Guests catered"],
                ["100%", "Hygienic"],
              ].map(([n, l]) => (
                <div key={l}>
                  <dt className="font-display text-3xl font-bold text-gold">{n}</dt>
                  <dd className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">{l}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </header>

      {/* ABOUT */}
      <Section id="about" eyebrow="Our Story" title="A premium Lahore food brand, built on trust">
        <div className="grid gap-10 md:grid-cols-[260px_1fr] md:items-center">
          <div className="relative mx-auto h-64 w-64 overflow-hidden rounded-2xl ring-gold shadow-gold md:h-auto md:w-full md:aspect-square">
            <img
              src={ownerImg}
              alt="Usman Waheed — Owner, AL-QADAR FOODS POINT"
              loading="lazy"
              className="h-full w-full object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background to-transparent p-4">
              <p className="text-sm font-semibold text-foreground">Usman Waheed</p>
              <p className="text-xs text-gold">Founder & Owner</p>
            </div>
          </div>
          <div>
            <p className="text-lg leading-relaxed text-muted-foreground">
              <span className="font-semibold text-foreground">AL-QADAR FOODS POINT</span> is a
              premium BBQ, fast food, and catering brand based in Lahore. We specialize in
              restaurant dining, home delivery, event catering, and large-scale food services —
              from intimate family dinners to weddings of 400+ guests.
            </p>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {[
                "Fresh ingredients daily",
                "Professional chefs",
                "Hygienic kitchen standards",
                "Fast delivery service",
                "Large event catering experts",
                "Custom food packages",
              ].map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm">
                  <span className="text-gold">✓</span> {f}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* WHY CHOOSE US */}
      <Section eyebrow="Why Choose Us" title="Trusted across Lahore">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[
            ["🧼", "100% Hygienic", "Spotless kitchen, fresh prep daily."],
            ["⭐", "Premium Ingredients", "Sourced fresh, never compromised."],
            ["💬", "Fast WhatsApp Response", "Quick replies, smooth orders."],
            ["👨‍🍳", "Expert Catering Team", "10+ years of large-event experience."],
            ["🚚", "Lahore-Wide Delivery", "Reliable, on-time delivery coverage."],
            ["💰", "Affordable Packages", "Custom menus for every budget."],
          ].map(([icon, title, desc]) => (
            <div
              key={title}
              className="hover-lift rounded-2xl border border-border bg-card p-6 shadow-card"
            >
              <div className="text-3xl">{icon}</div>
              <h3 className="mt-4 font-display text-xl font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* MENU */}
      <Section id="menu" eyebrow="Our Menu" title="Fresh, hot, and made to order">
        {/* Category cards */}
        <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              onClick={() => {
                setActiveCat(c.id);
                document.getElementById("menu-list")?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              className={`group relative overflow-hidden rounded-2xl border text-left transition ${
                activeCat === c.id
                  ? "border-gold shadow-gold"
                  : "border-border hover:border-gold/50"
              }`}
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={c.image}
                  alt={c.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="font-display text-lg font-bold">{c.name}</h3>
                <p className="text-xs text-muted-foreground">{c.tagline}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Active category items */}
        <div id="menu-list" className="rounded-3xl border border-border bg-card/50 p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-widest text-gold">Showing</p>
              <h3 className="font-display text-2xl font-bold sm:text-3xl">{activeCategory.name}</h3>
            </div>
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search items…"
              className="w-full max-w-xs rounded-full border border-border bg-background px-5 py-2.5 text-sm outline-none transition focus:border-gold"
            />
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="group flex items-center justify-between gap-4 rounded-xl border border-border/60 bg-background/60 p-4 transition hover:border-gold/40"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="truncate font-semibold">{item.name}</p>
                    {item.popular && (
                      <span className="shrink-0 rounded-full bg-orange/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-orange">
                        Popular
                      </span>
                    )}
                  </div>
                  {item.variant && (
                    <p className="text-xs text-muted-foreground">{item.variant}</p>
                  )}
                  <p className="mt-1 font-display text-lg font-bold text-gold">
                    Rs {item.price.toLocaleString()}/-
                  </p>
                </div>
                <button
                  onClick={() => addToCart(item, activeCategory.name)}
                  className="shrink-0 rounded-full bg-gradient-gold px-4 py-2 text-xs font-bold text-gold-foreground shadow-gold transition hover:scale-105"
                >
                  + Add
                </button>
              </div>
            ))}
            {filteredItems.length === 0 && (
              <p className="col-span-full py-8 text-center text-sm text-muted-foreground">
                No items match "{search}".
              </p>
            )}
          </div>
        </div>
      </Section>

      {/* CATERING */}
      <Section id="catering" eyebrow="Catering Services" title="From 50 to 400 guests — done right">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <div className="overflow-hidden rounded-3xl ring-gold shadow-gold">
            <img
              src={cateringImg}
              alt="Premium catering setup"
              loading="lazy"
              className="aspect-[4/3] w-full object-cover"
            />
          </div>
          <div>
            <p className="text-muted-foreground">
              We handle the full experience — buffet setup, live BBQ stations, serving staff,
              event planning, and fully custom menus. Trusted across Lahore for weddings,
              walima, mehndi, corporate events, Aqeeqah, school & university events.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {[
                "Weddings", "Walima", "Mehndi", "Corporate", "University",
                "School", "Aqeeqah", "Iftar", "Muharram Niaz", "Outdoor Stalls",
              ].map((e) => (
                <span key={e} className="rounded-full border border-gold/30 bg-gold/5 px-3 py-1 text-xs text-foreground">
                  {e}
                </span>
              ))}
            </div>
            <button
              onClick={() => setCateringOpen(true)}
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-gold px-7 py-3.5 text-sm font-bold text-gold-foreground shadow-gold transition hover:scale-105"
            >
              📩 Get a Custom Quote
            </button>
          </div>
        </div>
      </Section>

      {/* MUHARRAM NIAZ */}
      <Section id="niaz" eyebrow="Muharram Al-Haram" title="Niaz & Degh Booking Open">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr] lg:items-center">
          <div className="overflow-hidden rounded-3xl ring-gold">
            <img
              src={niazImg}
              alt="Mutton Haleem for Niaz"
              loading="lazy"
              className="aspect-[4/3] w-full object-cover"
            />
          </div>
          <div>
            <p className="text-muted-foreground">
              Trusted partner for Niaz distribution during Muharram-ul-Haram. Premium quality
              degs, hygienic packing boxes, and on-time delivery across Lahore.
            </p>
            <div className="mt-6 overflow-x-auto rounded-2xl border border-border">
              <table className="w-full text-sm">
                <thead className="bg-card text-gold">
                  <tr className="text-left">
                    <th className="px-4 py-3">Particulars</th>
                    <th className="px-4 py-3">Quantity</th>
                    <th className="px-4 py-3 text-right">Full</th>
                    <th className="px-4 py-3 text-right">Half</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {NIAZ.map((r) => (
                    <tr key={r.name} className="hover:bg-card/60">
                      <td className="px-4 py-2.5 font-medium">{r.name}</td>
                      <td className="px-4 py-2.5 text-muted-foreground">{r.qty}</td>
                      <td className="px-4 py-2.5 text-right text-gold">Rs {r.full.toLocaleString()}</td>
                      <td className="px-4 py-2.5 text-right">Rs {r.half.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <a
              href={waOrderLink(
                "Assalam-o-Alaikum, I want to book Muharram Niaz / Degh from AL-QADAR FOODS POINT.",
              )}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-gold px-7 py-3.5 text-sm font-bold text-gold-foreground shadow-gold transition hover:scale-105"
            >
              🕌 Book Niaz on WhatsApp
            </a>
          </div>
        </div>
      </Section>

      {/* DELIVERY + PAYMENT */}
      <Section eyebrow="Delivery & Payment" title="Lahore-wide delivery, every method accepted">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-6">
            <h3 className="font-display text-xl font-bold">🚚 Delivery Areas</h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {["Ghaziabad","Mughalpura","Saddar","Al Hafeez Garden","Jallo Side","Wapda Town Extensions","Surrounding Lahore"].map((a) => (
                <span key={a} className="rounded-full border border-border bg-background px-3 py-1 text-xs">{a}</span>
              ))}
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              Delivery availability depends on order size and distance.
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6">
            <h3 className="font-display text-xl font-bold">💳 Payment Methods</h3>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {paymentMethods.map((method) => (
                <Button
                  key={method.label}
                  variant="outline"
                  className="group flex flex-col items-start justify-between gap-3 rounded-3xl border-border bg-background p-4 text-left transition hover:-translate-y-0.5 hover:border-primary hover:bg-primary/10"
                  onClick={() => handlePaymentSelection(method.label)}
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-2xl transition group-hover:bg-primary group-hover:text-primary-foreground">
                    {method.icon}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-foreground">{method.label}</p>
                    <p className="mt-1 text-xs text-muted-foreground">Tap to select</p>
                  </div>
                </Button>
              ))}
            </div>
            <p className="mt-4 text-xs text-muted-foreground">All secure payment methods accepted.</p>
          </div>
        </div>
      </Section>
      <AlertDialog open={paymentModalOpen} onOpenChange={setPaymentModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Payment Method Selected</AlertDialogTitle>
            <AlertDialogDescription>
              {getPaymentDescription(selectedPaymentMethod)}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="mt-4 rounded-3xl border border-border bg-background p-4 text-sm text-muted-foreground">
            <p className="font-semibold text-foreground">Selected option</p>
            <p className="mt-1 text-base">{selectedPaymentMethod ?? "No method selected"}</p>
          </div>
          <div className="mt-4 text-sm text-muted-foreground">
            For a restaurant checkout, the smoothest experience is to confirm your order via WhatsApp and tell us which payment method you chose.
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Close</AlertDialogCancel>
            <AlertDialogAction onClick={handleProceedToCheckout}>
              Continue to WhatsApp
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* REVIEWS */}
      <Section eyebrow="Customer Love" title="What Lahore is saying">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {REVIEWS.map((r) => (
            <div key={r.name} className="hover-lift rounded-2xl border border-border bg-card p-6 shadow-card">
              <div className="flex items-center gap-1 text-gold">{"★".repeat(5)}<span className="ml-2 text-xs text-muted-foreground">{r.stars}</span></div>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">"{r.text}"</p>
              <p className="mt-4 text-sm font-semibold">{r.name}</p>
              <p className="text-xs text-muted-foreground">{r.where}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* CONTACT + QR */}
      <Section id="contact" eyebrow="Get in Touch" title="Visit, call, or scan to order">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="rounded-2xl border border-border bg-card p-6">
            <h3 className="font-display text-xl font-bold text-gold">🍽 Restaurant Outlet</h3>
            <p className="mt-3 text-sm text-muted-foreground">
              Al Hafeez Garden Phase 1, Ibrahim Block,<br />Ghoda Chowk, Lahore
            </p>
            <a
              href="https://maps.google.com/?q=Al+Hafeez+Garden+Phase+1+Ibrahim+Block+Ghoda+Chowk+Lahore"
              target="_blank" rel="noreferrer"
              className="mt-4 inline-block text-xs font-semibold text-orange hover:underline"
            >View on Google Maps →</a>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6">
            <h3 className="font-display text-xl font-bold text-gold">🍳 Central Kitchen</h3>
            <p className="mt-3 text-sm text-muted-foreground">
              Ali Villas Society, Opposite Sozo Water Park, Lahore
            </p>
            <a
              href="https://maps.google.com/?q=Ali+Villas+Society+Sozo+Water+Park+Lahore"
              target="_blank" rel="noreferrer"
              className="mt-4 inline-block text-xs font-semibold text-orange hover:underline"
            >View on Google Maps →</a>
          </div>
          <div className="rounded-2xl border border-gold/40 bg-gradient-to-br from-card to-background p-6 text-center">
            <p className="text-xs uppercase tracking-widest text-gold">Scan to Order</p>
            <img
              src={qrImg}
              alt="WhatsApp order QR code"
              loading="lazy"
              className="mx-auto mt-3 h-40 w-40 rounded-xl bg-white p-2"
            />
            <p className="mt-3 text-xs text-muted-foreground">Open WhatsApp & order instantly</p>
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <a href={`tel:+92${PHONE_DISPLAY.replace(/\s/g, "").slice(1)}`} className="rounded-2xl border border-border bg-card p-5 text-center hover:border-gold/40">
            <div className="text-2xl">📞</div>
            <div className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">Call</div>
            <div className="font-semibold">{PHONE_DISPLAY}</div>
          </a>
          <a href={WHATSAPP_LINK} target="_blank" rel="noreferrer" className="rounded-2xl border border-border bg-card p-5 text-center hover:border-gold/40">
            <div className="text-2xl">💬</div>
            <div className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">WhatsApp</div>
            <div className="font-semibold">Chat now</div>
          </a>
          <a href={`mailto:${EMAIL}`} className="rounded-2xl border border-border bg-card p-5 text-center hover:border-gold/40">
            <div className="text-2xl">✉️</div>
            <div className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">Email</div>
            <div className="truncate font-semibold">{EMAIL}</div>
          </a>
        </div>
      </Section>

      <Footer />

      {/* Floating CTAs */}
      <div className="fixed bottom-5 right-5 z-40 flex flex-col gap-3">
        <a
          href={WHATSAPP_LINK} target="_blank" rel="noreferrer"
          aria-label="WhatsApp"
          className="grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-2xl shadow-gold transition hover:scale-110"
        >💬</a>
        <a
          href={`tel:+92${PHONE_DISPLAY.replace(/\s/g, "").slice(1)}`}
          aria-label="Call"
          className="grid h-14 w-14 place-items-center rounded-full bg-gradient-gold text-2xl text-gold-foreground shadow-gold transition hover:scale-110"
        >📞</a>
      </div>

      {/* Sticky Order Now (mobile) */}
      <button
        onClick={() => setCartOpen(true)}
        className="fixed bottom-5 left-5 z-40 inline-flex items-center gap-2 rounded-full bg-card/95 px-5 py-3 text-sm font-bold shadow-card backdrop-blur border border-gold/40 hover:border-gold sm:hidden"
      >
        🛒 Cart {totalQty > 0 && <span className="rounded-full bg-gold px-2 py-0.5 text-xs text-gold-foreground">{totalQty}</span>}
      </button>

      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        cart={cart}
        updateQty={updateQty}
        removeLine={removeLine}
        totalPrice={totalPrice}
      />
      <CateringModal open={cateringOpen} onClose={() => setCateringOpen(false)} />
    </div>
  );
}

const NIAZ = [
  { name: "Chicken Masala Biryani", qty: "10+10 kg", full: 17000, half: 9000 },
  { name: "Chicken Biryani", qty: "10+10 kg", full: 15000, half: 8000 },
  { name: "Chicken Pulao", qty: "10+10 kg", full: 15000, half: 8000 },
  { name: "Mutton Biryani", qty: "10+10 kg", full: 36000, half: 18000 },
  { name: "Mutton Yakhani Pulao", qty: "10+10 kg", full: 36000, half: 18000 },
  { name: "Beef Biryani", qty: "10+10 kg", full: 24000, half: 12000 },
  { name: "Beef Yakhani Pulao", qty: "10+10 kg", full: 24000, half: 12000 },
  { name: "Chana Pulao", qty: "10+3 kg", full: 11000, half: 6000 },
  { name: "Vegetable Pulao", qty: "10+3 kg", full: 12000, half: 6500 },
  { name: "Zarda", qty: "10 kg", full: 13000, half: 7000 },
  { name: "Mutanjan", qty: "10 kg", full: 15000, half: 8000 },
  { name: "Gur walay Chawal", qty: "10 kg", full: 16000, half: 8500 },
  { name: "Gur walay Chawal (Special)", qty: "10 kg", full: 20000, half: 10500 },
  { name: "Chicken Korma", qty: "12 kg", full: 13000, half: 7000 },
  { name: "Beef Korma (Mix)", qty: "10 kg", full: 18000, half: 9500 },
  { name: "Beef Korma (Boneless)", qty: "10 kg", full: 21000, half: 11000 },
  { name: "Mutton Kunna (Mix)", qty: "10 kg", full: 36000, half: 18000 },
  { name: "Mutton Kunna (Machli)", qty: "10 kg", full: 40000, half: 20000 },
  { name: "Chicken Haleem / Daleem", qty: "12+12 kg", full: 24000, half: 12500 },
  { name: "Mutton Haleem / Daleem", qty: "12+12 kg", full: 60000, half: 30000 },
  { name: "Beef Haleem", qty: "12+12 kg", full: 34000, half: 17000 },
  { name: "Chicken Palak", qty: "10+10 kg", full: 20000, half: 10500 },
  { name: "Mutton Palak", qty: "10+10 kg", full: 38000, half: 20000 },
  { name: "Beef Palak", qty: "10+10 kg", full: 30000, half: 15500 },
];

const REVIEWS = [
  { name: "Ahmed R.", where: "DHA, Lahore", stars: "4.9", text: "Best chicken karahi in Lahore. The flavour is unmatched and delivery is always on time." },
  { name: "Sana M.", where: "Johar Town", stars: "4.8", text: "Catered our walima for 250 guests — the mutton biryani was the talk of the night." },
  { name: "Bilal K.", where: "Model Town", stars: "4.9", text: "Their BBQ platter is restaurant quality at home. Highly recommended for parties." },
  { name: "Hira A.", where: "Bahria Town", stars: "4.7", text: "Booked degh of haleem for Muharram Niaz. Hygienic packing, premium taste, on time." },
  { name: "Usman T.", where: "Cantt", stars: "4.8", text: "WhatsApp ordering is super smooth. Food arrived hot and fresh." },
  { name: "Fatima S.", where: "Gulberg", stars: "4.9", text: "Club sandwich and biryani are my favorites. Quality has never dropped." },
];

/* ---------- Sub-components ---------- */

function Section({
  id, eyebrow, title, children,
}: { id?: string; eyebrow: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="relative mx-auto max-w-7xl px-6 py-20 sm:py-24">
      <div className="mb-12 max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-gold">{eyebrow}</p>
        <h2 className="mt-3 font-display text-4xl font-bold sm:text-5xl">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function Nav({ onCartClick, cartCount }: { onCartClick: () => void; cartCount: number }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <nav className={`fixed inset-x-0 top-0 z-50 transition ${scrolled ? "bg-background/85 backdrop-blur border-b border-border" : "bg-transparent"}`}>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <a href="#" className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-gold font-display text-base font-bold text-gold-foreground">AQ</span>
          <span className="hidden font-display text-lg font-bold sm:inline">AL-QADAR FOODS</span>
        </a>
        <div className="hidden items-center gap-8 text-sm font-medium md:flex">
          <a href="#menu" className="text-muted-foreground hover:text-gold">Menu</a>
          <a href="#catering" className="text-muted-foreground hover:text-gold">Catering</a>
          <a href="#niaz" className="text-muted-foreground hover:text-gold">Niaz</a>
          <a href="#about" className="text-muted-foreground hover:text-gold">About</a>
          <a href="#contact" className="text-muted-foreground hover:text-gold">Contact</a>
        </div>
        <button onClick={onCartClick} className="relative inline-flex items-center gap-2 rounded-full bg-gradient-gold px-4 py-2 text-sm font-bold text-gold-foreground shadow-gold hover:scale-105 transition">
          🛒 Cart
          {cartCount > 0 && (
            <span className="absolute -right-2 -top-2 grid h-5 min-w-5 place-items-center rounded-full bg-orange px-1 text-[10px] font-bold text-background">
              {cartCount}
            </span>
          )}
        </button>
      </div>
    </nav>
  );
}

function CartDrawer({
  open, onClose, cart, updateQty, removeLine, totalPrice,
}: {
  open: boolean; onClose: () => void;
  cart: CartLine[]; updateQty: (k: string, d: number) => void; removeLine: (k: string) => void;
  totalPrice: number;
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");

  function checkout() {
    if (cart.length === 0) return;
    if (!name || !phone || !address) {
      alert("Please fill in your name, phone and address.");
      return;
    }
    const lines = cart
      .map((l) => `• ${l.qty} × ${l.item.name}${l.item.variant ? ` (${l.item.variant})` : ""} — Rs ${(l.item.price * l.qty).toLocaleString()}`)
      .join("\n");
    const msg = `Assalam-o-Alaikum, I want to place an order from AL-QADAR FOODS POINT.

*Order:*
${lines}

*Total: Rs ${totalPrice.toLocaleString()}*

*Name:* ${name}
*Phone:* ${phone}
*Address:* ${address}
${notes ? `*Notes:* ${notes}` : ""}`;
    window.open(waOrderLink(msg), "_blank");
  }

  return (
    <>
      <div className={`fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition ${open ? "opacity-100" : "pointer-events-none opacity-0"}`} onClick={onClose} />
      <aside className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-card shadow-2xl transition-transform ${open ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex items-center justify-between border-b border-border p-5">
          <h3 className="font-display text-xl font-bold">Your Order</h3>
          <button onClick={onClose} className="text-2xl text-muted-foreground hover:text-foreground">×</button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {cart.length === 0 ? (
            <p className="py-12 text-center text-sm text-muted-foreground">Cart is empty. Add items from the menu.</p>
          ) : (
            <ul className="space-y-3">
              {cart.map((l) => (
                <li key={l.key} className="rounded-xl border border-border bg-background p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">{l.item.name}</p>
                      {l.item.variant && <p className="text-xs text-muted-foreground">{l.item.variant}</p>}
                      <p className="mt-1 text-sm font-bold text-gold">Rs {(l.item.price * l.qty).toLocaleString()}</p>
                    </div>
                    <button onClick={() => removeLine(l.key)} className="text-xs text-muted-foreground hover:text-destructive">Remove</button>
                  </div>
                  <div className="mt-2 inline-flex items-center gap-3 rounded-full border border-border px-2 py-1">
                    <button onClick={() => updateQty(l.key, -1)} className="h-6 w-6 rounded-full bg-secondary text-sm">−</button>
                    <span className="text-sm font-semibold">{l.qty}</span>
                    <button onClick={() => updateQty(l.key, +1)} className="h-6 w-6 rounded-full bg-gold text-sm text-gold-foreground">+</button>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {cart.length > 0 && (
            <div className="mt-6 space-y-3">
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-gold" />
              <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone number" className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-gold" />
              <textarea value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Delivery address" rows={2} className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-gold" />
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Notes (optional)" rows={2} className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-gold" />
            </div>
          )}
        </div>

        <div className="border-t border-border p-5">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Total</span>
            <span className="font-display text-2xl font-bold text-gold">Rs {totalPrice.toLocaleString()}</span>
          </div>
          <button
            onClick={checkout}
            disabled={cart.length === 0}
            className="w-full rounded-full bg-gradient-gold px-6 py-3.5 text-sm font-bold text-gold-foreground shadow-gold transition hover:scale-[1.02] disabled:opacity-50"
          >
            💬 Send Order on WhatsApp
          </button>
        </div>
      </aside>
    </>
  );
}

function CateringModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [form, setForm] = useState({
    name: "", phone: "", eventType: "Wedding", date: "",
    guests: "100", budget: "", location: "", notes: "",
  });
  function submit(e: React.FormEvent) {
    e.preventDefault();
    const msg = `Assalam-o-Alaikum, I want a catering quote from AL-QADAR FOODS POINT.

*Name:* ${form.name}
*Phone:* ${form.phone}
*Event:* ${form.eventType}
*Date:* ${form.date}
*Guests:* ${form.guests}
*Budget:* ${form.budget}
*Location:* ${form.location}
${form.notes ? `*Details:* ${form.notes}` : ""}`;
    window.open(waOrderLink(msg), "_blank");
    onClose();
  }
  return (
    <>
      <div className={`fixed inset-0 z-50 bg-black/70 backdrop-blur-sm transition ${open ? "opacity-100" : "pointer-events-none opacity-0"}`} onClick={onClose} />
      <div className={`fixed inset-0 z-50 grid place-items-center p-4 transition ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}>
        <div className="w-full max-w-lg rounded-2xl border border-gold/30 bg-card p-6 shadow-gold">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs uppercase tracking-widest text-gold">Catering Inquiry</p>
              <h3 className="mt-1 font-display text-2xl font-bold">Get a custom quote</h3>
            </div>
            <button onClick={onClose} className="text-2xl text-muted-foreground hover:text-foreground">×</button>
          </div>
          <form onSubmit={submit} className="mt-5 grid gap-3 sm:grid-cols-2">
            <input required value={form.name} onChange={(e)=>setForm({...form,name:e.target.value})} placeholder="Full name" className="sm:col-span-2 rounded-lg border border-border bg-background px-3 py-2.5 text-sm focus:border-gold outline-none" />
            <input required value={form.phone} onChange={(e)=>setForm({...form,phone:e.target.value})} placeholder="Phone" className="rounded-lg border border-border bg-background px-3 py-2.5 text-sm focus:border-gold outline-none" />
            <select value={form.eventType} onChange={(e)=>setForm({...form,eventType:e.target.value})} className="rounded-lg border border-border bg-background px-3 py-2.5 text-sm focus:border-gold outline-none">
              {["Wedding","Walima","Mehndi","Birthday","Corporate","University","School","Muharram Niaz","Aqeeqah","Iftar","Other"].map((o)=>(<option key={o}>{o}</option>))}
            </select>
            <input required type="date" value={form.date} onChange={(e)=>setForm({...form,date:e.target.value})} className="rounded-lg border border-border bg-background px-3 py-2.5 text-sm focus:border-gold outline-none" />
            <input required type="number" min={50} max={400} value={form.guests} onChange={(e)=>setForm({...form,guests:e.target.value})} placeholder="Guests (50–400)" className="rounded-lg border border-border bg-background px-3 py-2.5 text-sm focus:border-gold outline-none" />
            <input value={form.budget} onChange={(e)=>setForm({...form,budget:e.target.value})} placeholder="Budget (PKR)" className="rounded-lg border border-border bg-background px-3 py-2.5 text-sm focus:border-gold outline-none" />
            <input required value={form.location} onChange={(e)=>setForm({...form,location:e.target.value})} placeholder="Event location" className="sm:col-span-2 rounded-lg border border-border bg-background px-3 py-2.5 text-sm focus:border-gold outline-none" />
            <textarea value={form.notes} onChange={(e)=>setForm({...form,notes:e.target.value})} rows={3} placeholder="Additional requirements" className="sm:col-span-2 rounded-lg border border-border bg-background px-3 py-2.5 text-sm focus:border-gold outline-none" />
            <button type="submit" className="sm:col-span-2 rounded-full bg-gradient-gold px-6 py-3 text-sm font-bold text-gold-foreground shadow-gold transition hover:scale-[1.02]">
              💬 Send Inquiry on WhatsApp
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

function Footer() {
  return (
    <footer className="relative border-t border-border bg-card">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-gradient-gold font-display text-base font-bold text-gold-foreground">AQ</span>
            <span className="font-display text-lg font-bold">AL-QADAR FOODS</span>
          </div>
          <img
            src={logoImg}
            alt="Al Qadar Foods"
            loading="lazy"
            className="mt-4 h-24 w-auto rounded-md object-contain opacity-90"
          />
          <p className="mt-4 text-sm text-muted-foreground">
            Premium BBQ, biryani & catering serving Lahore with hygiene and heart.
          </p>
        </div>
        <div>
          <h4 className="font-display text-base font-bold text-gold">Explore</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><a href="#menu" className="hover:text-gold">Menu</a></li>
            <li><a href="#catering" className="hover:text-gold">Catering</a></li>
            <li><a href="#niaz" className="hover:text-gold">Muharram Niaz</a></li>
            <li><a href="#about" className="hover:text-gold">About</a></li>
            <li><a href="#contact" className="hover:text-gold">Contact</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-display text-base font-bold text-gold">Contact</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>📞 {PHONE_DISPLAY}</li>
            <li>📞 0320 4743042</li>
            <li>📞 0300 8853583</li>
            <li>✉️ {EMAIL}</li>
            <li>🕒 Always open</li>
          </ul>
        </div>
        <div>
          <h4 className="font-display text-base font-bold text-gold">Follow</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><a href={WHATSAPP_LINK} target="_blank" rel="noreferrer" className="hover:text-gold">WhatsApp</a></li>
            <li><a href="https://www.facebook.com/share/1D9DNgEkEW/" target="_blank" rel="noreferrer" className="hover:text-gold">Facebook</a></li>
            <li><a href="https://www.instagram.com/alqadarfoods" target="_blank" rel="noreferrer" className="hover:text-gold">Instagram</a></li>
            <li><a href="https://www.youtube.com/@AlQadarFoods" target="_blank" rel="noreferrer" className="hover:text-gold">YouTube</a></li>
            <li><a href="https://tiktok.com/@alqadarfoods" target="_blank" rel="noreferrer" className="hover:text-gold">TikTok</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border py-5 text-center text-xs text-muted-foreground">
        © 2026 AL-QADAR FOODS POINT. All Rights Reserved. · Founder: Usman Waheed
      </div>
    </footer>
  );
}
