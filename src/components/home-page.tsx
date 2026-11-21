"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import { messages, type Locale } from "@/lib/messages";
import { site } from "@/lib/site";
import { Brand, Icon } from "./icon";

type Overlay =
  | { kind: "reservation" }
  | { kind: "gallery"; index: number }
  | { kind: "experience"; index: number }
  | { kind: "article"; index: number }
  | null;

function Modal({
  children,
  title,
  onClose,
  closeLabel,
  wide = false,
}: {
  children: ReactNode;
  title: string;
  onClose: () => void;
  closeLabel: string;
  wide?: boolean;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    dialog?.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      dialog?.close();
      document.body.style.overflow = overflow;
      previous?.focus();
    };
  }, []);
  return (
    <dialog
      ref={ref}
      className={`[margin:auto] [padding:0] [border:0] [border-radius:20px] [width:min(580px,_calc(100vw_-_32px))] [max-height:calc(100dvh_-_40px)] [color:var(--foreground)] [background:white] [box-shadow:0_30px_90px_#10251f40] [&::backdrop]:[background:#10251f99] [&::backdrop]:[backdrop-filter:blur(5px)] ${wide ? "[width:min(940px,_calc(100vw_-_32px))]" : ""}`}
      aria-labelledby="modal-title"
      onCancel={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="[display:flex] [align-items:center] [justify-content:space-between] [gap:20px] [padding:22px_28px] [border-bottom:1px_solid_var(--line)] [position:sticky] [top:0] [background:white] [z-index:2] max-[700px]:[padding:17px_20px]">
        <h2 className="[font-size:21px] [letter-spacing:-0.6px] max-[700px]:[font-size:18px]" id="modal-title">{title}</h2>
        <button
          className="[width:38px] [height:38px] [border-radius:50%] [display:inline-flex] [align-items:center] [justify-content:center] [flex-shrink:0] [transition:background_0.2s,_transform_0.2s] [background:var(--soft)] [color:var(--foreground)] [&:hover]:[background:var(--line)] forced-colors:[border:1px_solid_ButtonText]"
          onClick={onClose}
          aria-label={closeLabel}
        >
          <Icon name="close" />
        </button>
      </div>
      {children}
    </dialog>
  );
}

function Reservation({ locale }: { locale: Locale }) {
  const t = messages[locale].reservation;
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [people, setPeople] = useState("2");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");
  const [copied, setCopied] = useState("");
  const nameRef = useRef<HTMLInputElement>(null);
  const dateRef = useRef<HTMLInputElement>(null);
  const peopleRef = useRef<HTMLInputElement>(null);
  const today = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next: Record<string, string> = {};
    if (!name.trim()) next.name = t.nameRequired;
    if (!date || date < today)
      next.date = t.dateInvalid;
    if (!/^\d+$/.test(people) || Number(people) < 1 || Number(people) > 200)
      next.people = t.peopleInvalid;
    setErrors(next);
    if (Object.keys(next).length) {
      (next.name ? nameRef : next.date ? dateRef : peopleRef).current?.focus();
      return;
    }
    const formatted = new Intl.DateTimeFormat(locale === "id" ? "id-ID" : "en-US", {
      dateStyle: "long",
      timeZone: "Asia/Jakarta",
    }).format(new Date(`${date}T12:00:00+07:00`));
    setMessage(t.message(name.trim(), people, formatted));
  }

  return (
    <div className="[padding:26px_28px] max-[700px]:[padding:20px]">
      <p className="[color:var(--muted)] [font-size:13px]">
        {t.intro}
      </p>
      {!site.whatsappNumber && (
        <p className="[display:flex] [align-items:center] [gap:8px] [padding:11px_14px] [margin:20px_0] [background:var(--soft)] [color:var(--primary-hover)] [border-radius:8px] [font-size:11px]">
          <Icon name="compass" /> {t.demoNotice}
        </p>
      )}
      {message ? (
        <div className="[&_h3]:[font-size:18px] [&_h3]:[margin:24px_0_12px]">
          <h3>{t.messageReady}</h3>
          <p className="[padding:18px] [background:var(--soft)] [border-radius:12px] [font-size:13px] [line-height:1.9] [user-select:text]">{message}</p>
          <p className="[color:var(--muted)] [font-size:10px] [line-height:1.8] [margin:14px_0]">
            {site.whatsappNumber
              ? t.messageToWhatsApp
              : t.previewOnly}
          </p>
          <div className="[display:flex] [align-items:center] [gap:20px] [flex-wrap:wrap]">
            {site.whatsappNumber ? (
              <a
                className="[display:inline-flex] [align-items:center] [justify-content:center] [gap:12px] [padding:14px_22px] [border-radius:var(--radius-control)] [font-size:12px] [line-height:1.5] [font-weight:700] [min-height:46px] [transition:background_0.2s,_transform_0.2s,_box-shadow_0.2s] [white-space:nowrap] [cursor:pointer] [&:hover]:[transform:translateY(-2px)] [&:active]:[transform:translateY(0)] forced-colors:[border:1px_solid_ButtonText] [background:var(--primary)] [color:white] [&:hover]:[background:var(--primary-hover)] [&:hover]:[box-shadow:0_6px_18px_#d8784225]"
                href={`https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(message)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {locale === "id" ? "Lanjut ke WhatsApp" : "Continue to WhatsApp"} <Icon name="up-right" />
              </a>
            ) : (
              <button
                className="[display:inline-flex] [align-items:center] [justify-content:center] [gap:12px] [padding:14px_22px] [border-radius:var(--radius-control)] [font-size:12px] [line-height:1.5] [font-weight:700] [min-height:46px] [transition:background_0.2s,_transform_0.2s,_box-shadow_0.2s] [white-space:nowrap] [cursor:pointer] [&:hover]:[transform:translateY(-2px)] [&:active]:[transform:translateY(0)] forced-colors:[border:1px_solid_ButtonText] [background:var(--primary)] [color:white] [&:hover]:[background:var(--primary-hover)] [&:hover]:[box-shadow:0_6px_18px_#d8784225]"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(message);
                    setCopied(t.copySuccess);
                  } catch {
                    setCopied(t.copyFailure);
                  }
                }}
              >
                {t.copy} <Icon name="arrow" />
              </button>
            )}
            <button
              className="[display:inline-flex] [align-items:center] [gap:14px] [background:transparent] [color:var(--foreground)] [font-size:12px] [font-weight:700] [min-height:44px] [padding:0] [&:hover]:[color:var(--primary)] [&_svg]:[transition:transform_0.2s] [&:hover_svg]:[transform:translateX(3px)]"
              onClick={() => {
                setMessage("");
                setCopied("");
              }}
            >
              {t.editPlan}
            </button>
          </div>
          <p className="[min-height:24px] [margin-top:10px] [font-size:11px] [color:var(--primary-hover)]" role="status">
            {copied}
          </p>
        </div>
      ) : (
        <form onSubmit={submit} noValidate>
          <div className="[margin-top:18px] [&_label]:[display:block] [&_label]:[font-size:12px] [&_label]:[font-weight:600] [&_label]:[margin-bottom:6px] [&_input]:[display:block] [&_input]:[width:100%] [&_input]:[min-width:0] [&_input]:[border:1px_solid_var(--line)] [&_input]:[background:white] [&_input]:[border-radius:8px] [&_input]:[height:46px] [&_input]:[padding:10px_12px] [&_input]:[color:var(--foreground)]">
            <label htmlFor="guest-name">{t.name}</label>
            <input
              id="guest-name"
              required
              ref={nameRef}
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t.namePlaceholder}
              maxLength={100}
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "name-error" : undefined}
              className="aria-invalid:[border-color:#b42318]"
            />
            {errors.name && (
              <p className="[color:#b42318] [font-size:11px] [margin-top:5px]" id="name-error">
                {errors.name}
              </p>
            )}
          </div>
          <div className="[display:grid] [grid-template-columns:1.25fr_1fr] [gap:16px] max-[700px]:[grid-template-columns:1fr] max-[700px]:[gap:0]">
            <div className="[margin-top:18px] [&_label]:[display:block] [&_label]:[font-size:12px] [&_label]:[font-weight:600] [&_label]:[margin-bottom:6px] [&_input]:[display:block] [&_input]:[width:100%] [&_input]:[min-width:0] [&_input]:[border:1px_solid_var(--line)] [&_input]:[background:white] [&_input]:[border-radius:8px] [&_input]:[height:46px] [&_input]:[padding:10px_12px] [&_input]:[color:var(--foreground)]">
              <label htmlFor="visit-date">{t.date}</label>
              <input
                id="visit-date"
                required
                ref={dateRef}
                type="date"
                min={today}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                aria-invalid={!!errors.date}
                aria-describedby={errors.date ? "date-error" : undefined}
                className="aria-invalid:[border-color:#b42318]"
              />
              {errors.date && (
                <p className="[color:#b42318] [font-size:11px] [margin-top:5px]" id="date-error">
                  {errors.date}
                </p>
              )}
            </div>
            <div className="[margin-top:18px] [&_label]:[display:block] [&_label]:[font-size:12px] [&_label]:[font-weight:600] [&_label]:[margin-bottom:6px] [&_input]:[display:block] [&_input]:[width:100%] [&_input]:[min-width:0] [&_input]:[border:1px_solid_var(--line)] [&_input]:[background:white] [&_input]:[border-radius:8px] [&_input]:[height:46px] [&_input]:[padding:10px_12px] [&_input]:[color:var(--foreground)]">
              <label htmlFor="guest-count">{t.people}</label>
              <input
                id="guest-count"
                required
                ref={peopleRef}
                type="number"
                min="1"
                max="200"
                value={people}
                onChange={(e) => setPeople(e.target.value)}
                aria-invalid={!!errors.people}
                aria-describedby={errors.people ? "people-error" : undefined}
                className="aria-invalid:[border-color:#b42318]"
              />
              {errors.people && (
                <p className="[color:#b42318] [font-size:11px] [margin-top:5px]" id="people-error">
                  {errors.people}
                </p>
              )}
            </div>
          </div>
          <button className="[display:inline-flex] [align-items:center] [justify-content:center] [gap:12px] [padding:14px_22px] [border-radius:var(--radius-control)] [font-size:12px] [line-height:1.5] [font-weight:700] [min-height:46px] [transition:background_0.2s,_transform_0.2s,_box-shadow_0.2s] [white-space:nowrap] [cursor:pointer] [&:hover]:[transform:translateY(-2px)] [&:active]:[transform:translateY(0)] forced-colors:[border:1px_solid_ButtonText] [background:var(--primary)] [color:white] [&:hover]:[background:var(--primary-hover)] [&:hover]:[box-shadow:0_6px_18px_#d8784225] [margin-top:25px] [width:100%]" type="submit">
            {t.submit} <Icon name="chat" />
          </button>
          <p className="[color:var(--muted)] [font-size:10px] [line-height:1.8] [margin:14px_0]">
            {t.disclaimer}
          </p>
        </form>
      )}
    </div>
  );
}

const sectionWidth = "mx-auto w-full max-w-[1200px] px-5 sm:px-8 lg:px-10";
const eyebrowStyle = "mb-3 text-xs font-bold uppercase tracking-[0.22em] text-[var(--primary)]";
const primaryAction = "inline-flex items-center justify-center gap-2 rounded-full bg-[var(--primary)] px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-black/15 transition hover:-translate-y-0.5 hover:bg-[var(--primary-hover)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f5b27d]";
const heroAction = "inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--primary)] px-8 py-4 text-sm font-semibold text-white shadow-lg shadow-black/15 transition hover:-translate-y-0.5 hover:bg-[var(--primary-hover)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f5b27d]";
const floatingWhatsAppStyle = "fixed bottom-5 right-5 z-40 grid size-14 place-items-center rounded-full bg-[#25D366] text-white shadow-xl shadow-black/25 transition hover:-translate-y-0.5 hover:bg-[#20b858] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#128c4a]";

export default function HomePage({ locale }: { locale: Locale }) {
  const router = useRouter();
  const t = messages[locale];
  const { photos } = t;
  const experiences = t.packages.experiences;
  const articles = t.articles.items;
  const { navigation } = t;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [active, setActive] = useState<string>(navigation[0].href);
  const [navScrolled, setNavScrolled] = useState(false);
  const [overlay, setOverlay] = useState<Overlay>(null);
  const menuRef = useRef<HTMLButtonElement>(null);
  const reserve = () => {
    setMobileOpen(false);
    setOverlay({ kind: "reservation" });
  };
  const close = () => setOverlay(null);
  const whatsappHref = site.whatsappNumber
    ? `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(t.whatsapp.message)}`
    : null;

  useEffect(() => {
    const updateNavbar = () => setNavScrolled(window.scrollY > 24);
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(`#${entry.target.id}`);
        }
      },
      { rootMargin: "-20% 0px -65% 0px", threshold: 0 },
    );
    for (const item of navigation) {
      const target = document.querySelector(item.href);
      if (target) observer.observe(target);
    }
    updateNavbar();
    window.addEventListener("scroll", updateNavbar, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", updateNavbar);
    };
  }, [navigation]);

  return (
    <>
      <a
        className="fixed left-4 top-[-5rem] z-[60] rounded-lg bg-white px-4 py-3 text-[var(--foreground)] shadow-lg focus:top-4"
        href="#konten"
      >
        {t.accessibility.skipToContent}
      </a>
      <main id="konten">
        <header
          className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
            navScrolled
              ? "border-b border-white/10 bg-[#10251f] shadow-lg shadow-black/10"
              : "bg-transparent"
          }`}
        >
          <div className={`${sectionWidth} relative flex min-h-[82px] items-center justify-between gap-5`}>
            <Brand inverted homeLabel={t.accessibility.homeLink} />
            <nav className="hidden items-center gap-7 lg:flex" aria-label={t.accessibility.mainNavigation}>
              {navigation.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className={`relative py-3 text-sm font-medium transition-colors after:absolute after:inset-x-0 after:-bottom-px after:h-0.5 after:bg-[#e58b50] after:transition-transform ${active === item.href ? "text-white after:scale-x-100" : "text-white/75 after:scale-x-0 hover:text-white"}`}
                  aria-current={active === item.href ? "location" : undefined}
                >
                  {item.label}
                </a>
              ))}
            </nav>
            <div className="flex items-center gap-3">
              <nav className="flex items-center gap-1 text-xs font-semibold text-white" aria-label={t.language.label}>
                {(["id", "en"] as const).map((target, index) => (
                  <span key={target} className="flex items-center gap-1">
                    {index > 0 && <span aria-hidden="true" className="text-white/50">|</span>}
                    <a
                      className={`rounded px-1.5 py-2 transition hover:text-[#f5bd8d] ${locale === target ? "text-[#f5bd8d]" : "text-white/75"}`}
                      href={`/${target}`}
                      lang={target}
                      aria-current={locale === target ? "page" : undefined}
                      onClick={(event) => {
                        event.preventDefault();
                        const hash =
                          window.location.hash ||
                          (active !== navigation[0].href ? active : "");
                        router.push(`/${target}${hash}`);
                      }}
                    >
                      {target.toUpperCase()}
                    </a>
                  </span>
                ))}
              </nav>
              <button
                className="hidden items-center gap-2 rounded-md border border-white/50 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white sm:inline-flex"
                onClick={reserve}
              >
                {t.header.inquiry} <Icon name="arrow" width="16" height="16" />
              </button>
              <button
                ref={menuRef}
                className="grid size-10 place-items-center rounded-full border border-white/25 text-white transition hover:bg-white/10 lg:hidden"
                aria-label={mobileOpen ? t.accessibility.closeMenu : t.accessibility.openMenu}
                aria-expanded={mobileOpen}
                aria-controls="mobile-navigation"
                onClick={() => setMobileOpen((open) => !open)}
              >
                <Icon name={mobileOpen ? "close" : "menu"} />
              </button>
            </div>
            {mobileOpen && (
              <nav
                id="mobile-navigation"
                className="absolute inset-x-0 top-[calc(100%+0.5rem)] rounded-2xl border border-white/15 bg-[#10251f]/95 p-3 shadow-2xl backdrop-blur-xl lg:hidden"
                aria-label={t.accessibility.mobileNavigation}
                onKeyDown={(event) => {
                  if (event.key === "Escape") {
                    setMobileOpen(false);
                    menuRef.current?.focus();
                  }
                }}
              >
                {navigation.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className="flex items-center justify-between rounded-xl px-4 py-3 text-sm text-white/85 transition hover:bg-white/10 hover:text-white"
                    onClick={() => {
                      setActive(item.href);
                      setMobileOpen(false);
                    }}
                  >
                    {item.label} <Icon name="arrow" width="16" height="16" />
                  </a>
                ))}
              </nav>
            )}
          </div>
        </header>
        <section
          id="beranda"
          className="relative isolate flex min-h-[760px] flex-col justify-center overflow-hidden bg-[#10251f] text-white lg:min-h-[820px]"
          aria-label={t.hero.regionLabel}
        >
          <Image
            className="absolute inset-0 -z-10 object-cover"
            src={photos[0].src}
            alt={photos[0].alt}
            fill
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#10251f]/55 via-[#10251f]/25 to-[#10251f]/50" />
          <div className={`${sectionWidth} relative z-10 py-36 text-center sm:py-40`}>
            <h1 className="mx-auto max-w-5xl text-4xl font-semibold leading-[1.08] tracking-[-0.04em] text-white drop-shadow-lg sm:text-5xl lg:text-6xl">
              {t.hero.title}
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-white/80 sm:text-lg sm:leading-8">
              {t.hero.description}
            </p>
            <div className="mt-9 flex justify-center">
              <a className={heroAction} href="#paket-wisata">
                {t.hero.action} <Icon name="arrow" width="18" height="18" />
              </a>
            </div>
          </div>
        </section>

        <section id="profil" className="bg-[#f7f7f3] py-20 sm:py-28">
          <div className={`${sectionWidth} grid items-center gap-12 lg:grid-cols-2 lg:gap-20`}>
            <div className="relative mx-auto w-full max-w-xl pb-12 pr-8 sm:pb-14 sm:pr-12">
              <div className="relative h-[330px] overflow-hidden rounded-[2rem] sm:h-[440px]">
                <Image src={photos[0].src} alt={photos[0].alt} fill sizes="(max-width: 700px) 90vw, 560px" className="object-cover" />
              </div>
              <div className="absolute bottom-0 right-0 h-40 w-40 overflow-hidden rounded-3xl border-[6px] border-[#f7f7f3] shadow-xl sm:h-56 sm:w-56">
                <Image src={photos[2].src} alt={photos[2].alt} fill sizes="220px" className="object-cover" />
              </div>
              <div className="absolute left-4 top-6 rounded-full bg-white/95 px-4 py-2 text-xs font-semibold text-[#294037] shadow-lg sm:left-8 sm:top-8">
                {t.profile.imageCaption}
              </div>
            </div>
            <div>
              <p className={eyebrowStyle}>{t.profile.eyebrow}</p>
              <h2 className="max-w-xl text-3xl font-semibold leading-tight tracking-[-0.035em] text-[var(--foreground)] sm:text-5xl">
                {t.profile.title}
              </h2>
              <p className="mt-6 max-w-xl text-base leading-7 text-[var(--muted)]">
                {t.profile.description}
              </p>
              <div className="mt-8 grid gap-5 sm:grid-cols-2">
                {t.profile.highlights.map((highlight) => (
                  <div className="border-l-2 border-[#d87842] pl-4" key={highlight.title}>
                    <h3 className="font-semibold text-[var(--foreground)]">{highlight.title}</h3>
                    <p className="mt-1 text-sm leading-6 text-[var(--muted)]">{highlight.description}</p>
                  </div>
                ))}
              </div>
              <a className={`${primaryAction} mt-8`} href="#informasi">
                {t.profile.action} <Icon name="arrow" width="17" height="17" />
              </a>
            </div>
          </div>
        </section>

        <section className="bg-white py-20 sm:py-28" aria-labelledby="destinasi-title">
          <div className={sectionWidth}>
            <div className="mb-9 flex flex-col gap-4 sm:mb-12 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className={eyebrowStyle}>{t.destinations.eyebrow}</p>
                <h2 id="destinasi-title" className="text-3xl font-semibold tracking-[-0.03em] text-[var(--foreground)] sm:text-4xl">
                  {t.destinations.title}
                </h2>
              </div>
              <p className="max-w-md text-sm leading-6 text-[var(--muted)]">
                {t.destinations.description}
              </p>
            </div>
            <div className="grid gap-4 lg:grid-cols-3 lg:grid-rows-2">
              {photos.map((photo, index) => (
                <button
                  key={photo.src}
                  className={`group relative min-h-[260px] overflow-hidden rounded-[1.5rem] text-left sm:min-h-[320px] ${index === 0 ? "lg:col-span-2 lg:row-span-2 lg:min-h-[540px]" : "lg:min-h-[263px]"}`}
                  onClick={() => setOverlay({ kind: "gallery", index })}
                  aria-label={`${t.destinations.openPhoto} ${photo.location}`}
                >
                  <Image src={photo.src} alt={photo.alt} fill sizes={index === 0 ? "(max-width: 1024px) 100vw, 760px" : "(max-width: 1024px) 100vw, 380px"} className="object-cover transition duration-700 group-hover:scale-105" />
                  <span className="absolute inset-0 bg-gradient-to-t from-[#101d18]/85 via-[#101d18]/10 to-transparent" />
                  <span className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-8">
                    <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.22em] text-[#f5bd8d]">0{index + 1} / {t.destinations.category}</span>
                    <span className="block text-2xl font-semibold sm:text-3xl">{photo.location}</span>
                    <span className="mt-2 inline-flex items-center gap-2 text-sm text-white/80">{t.destinations.openPhoto} <Icon name="arrow" width="15" height="15" /></span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section>

        <section id="paket-wisata" className="bg-[#eef0e9] py-20 sm:py-28" aria-labelledby="paket-title">
          <div className={sectionWidth}>
            <div className="mb-9 flex flex-col gap-5 sm:mb-12 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className={eyebrowStyle}>{t.packages.eyebrow}</p>
                <h2 id="paket-title" className="text-3xl font-semibold tracking-[-0.03em] text-[var(--foreground)] sm:text-4xl">
                  {t.packages.title}
                </h2>
              </div>
              <p className="max-w-md text-sm leading-6 text-[var(--muted)]">
                {t.packages.description}
              </p>
            </div>
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {experiences.map((item, index) => (
                <article key={item.title} className="overflow-hidden rounded-[1.5rem] bg-white shadow-sm ring-1 ring-black/5 transition hover:-translate-y-1 hover:shadow-xl">
                  <button
                    className="group relative block h-56 w-full overflow-hidden text-left"
                    onClick={() => setOverlay({ kind: "experience", index })}
                    aria-label={`${t.packages.openDetails} ${item.title}`}
                  >
                    <Image src={photos[item.photo].src} alt={photos[item.photo].alt} fill sizes="(max-width: 700px) 100vw, 400px" className="object-cover transition duration-700 group-hover:scale-105" />
                    <span className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
                    <span className="absolute bottom-4 left-5 rounded-full bg-white/95 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-[#35433c]">{item.category}</span>
                  </button>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-[var(--foreground)]">{item.title}</h3>
                    <p className="mt-3 min-h-12 text-sm leading-6 text-[var(--muted)]">{item.description}</p>
                    <div className="mt-6 flex items-center justify-between gap-3 border-t border-[var(--line)] pt-5">
                      <button className="text-sm font-semibold text-[var(--foreground)] transition hover:text-[var(--primary)]" onClick={() => setOverlay({ kind: "experience", index })}>
                        {t.packages.openDetails}
                      </button>
                      <button className={`${primaryAction} px-4 py-2.5 text-xs`} onClick={reserve}>
                        {t.packages.inquire} <Icon name="arrow" width="14" height="14" />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="galeri" className="bg-[#f7f7f3] py-20 sm:py-28" aria-labelledby="galeri-title">
          <div className={sectionWidth}>
            <div className="mb-9 flex items-end justify-between gap-5 sm:mb-12">
              <div>
                <p className={eyebrowStyle}>{t.gallery.eyebrow}</p>
                <h2 id="galeri-title" className="text-3xl font-semibold tracking-[-0.03em] text-[var(--foreground)] sm:text-4xl">{t.gallery.title}</h2>
              </div>
              <span className="hidden text-sm text-[var(--muted)] sm:inline">{t.gallery.hint}</span>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3">
              {photos.map((photo, index) => (
                <button
                  key={photo.src}
                  className={`group relative overflow-hidden rounded-2xl text-left ${index === 0 ? "col-span-2 aspect-[1.7] lg:col-span-1 lg:aspect-[0.95]" : "aspect-[0.95]"}`}
                  onClick={() => setOverlay({ kind: "gallery", index })}
                  aria-label={`${t.gallery.openPhoto} ${photo.location}`}
                >
                  <Image src={photo.src} alt={photo.alt} fill sizes="(max-width: 700px) 50vw, 400px" className="object-cover transition duration-700 group-hover:scale-105" />
                  <span className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <span className="absolute bottom-4 left-4 text-sm font-semibold text-white sm:bottom-6 sm:left-6 sm:text-base">{photo.label}</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        <section id="artikel" className="bg-white py-20 sm:py-28" aria-labelledby="artikel-title">
          <div className={sectionWidth}>
            <div className="mb-9 flex flex-col gap-4 sm:mb-12 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className={eyebrowStyle}>{t.articles.eyebrow}</p>
                <h2 id="artikel-title" className="text-3xl font-semibold tracking-[-0.03em] text-[var(--foreground)] sm:text-4xl">{t.articles.title}</h2>
              </div>
              <p className="max-w-sm text-sm leading-6 text-[var(--muted)]">{t.articles.description}</p>
            </div>
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {articles.map((article, index) => (
                <article key={article.title} className="flex min-h-[280px] flex-col rounded-[1.5rem] border border-[var(--line)] bg-[#fbfbf8] p-6 sm:p-7">
                  <div className="mb-7 flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--primary)]">{article.category}</span>
                    <span className="text-2xl font-light text-[#c8cec5]">0{index + 1}</span>
                  </div>
                  <h3 className="text-xl font-semibold leading-snug text-[var(--foreground)]">{article.title}</h3>
                  <p className="mt-3 flex-1 text-sm leading-6 text-[var(--muted)]">{article.text.slice(0, 130)}...</p>
                  <button className="mt-6 inline-flex items-center gap-2 self-start text-sm font-semibold text-[var(--foreground)] transition hover:text-[var(--primary)]" onClick={() => setOverlay({ kind: "article", index })}>
                    {t.articles.read} <Icon name="arrow" width="15" height="15" />
                  </button>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="informasi" className="bg-[#f7f7f3] py-20 sm:py-28" aria-labelledby="informasi-title">
          <div className={`${sectionWidth} grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20`}>
            <div>
              <p className={eyebrowStyle}>{t.information.eyebrow}</p>
              <h2 id="informasi-title" className="max-w-lg text-3xl font-semibold leading-tight tracking-[-0.03em] text-[var(--foreground)] sm:text-4xl">
                {t.information.title}
              </h2>
              <p className="mt-5 max-w-lg text-sm leading-7 text-[var(--muted)]">
                {t.information.description}
              </p>
              <a className={`${primaryAction} mt-7`} href={site.mapsUrl} target="_blank" rel="noopener noreferrer">
                <Icon name="pin" width="17" height="17" /> {t.information.map}
              </a>
              <div className="mt-8 rounded-2xl border border-[var(--line)] bg-white p-5">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--muted)]">{t.information.contact}</p>
                <p className="mt-2 font-semibold text-[var(--foreground)]">{site.location[locale]}</p>
                <p className="mt-1 text-sm text-[var(--muted)]">{site.phoneDisplay}</p>
              </div>
            </div>
            <div className="divide-y divide-[var(--line)] border-y border-[var(--line)]">
              {t.information.faq.map(({ question, answer }) => (
                <details key={question} className="group py-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-5 text-base font-semibold text-[var(--foreground)] marker:hidden">
                    {question}
                    <Icon name="chevron" className="shrink-0 text-[var(--primary)] transition-transform group-open:rotate-180" width="18" height="18" />
                  </summary>
                  <p className="max-w-2xl pt-4 text-sm leading-7 text-[var(--muted)]">{answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#142720] py-16 text-white sm:py-20">
          <div className={`${sectionWidth} flex flex-col items-start justify-between gap-8 sm:flex-row sm:items-center`}>
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-[#e9a16e]">{t.cta.eyebrow}</p>
              <h2 className="max-w-2xl text-3xl font-semibold leading-tight sm:text-4xl">{t.cta.title}</h2>
              <p className="mt-3 max-w-xl text-sm leading-6 text-white/70">{t.cta.description}</p>
            </div>
            <button className={`${primaryAction} shrink-0`} onClick={reserve}>
              {t.cta.action} <Icon name="arrow" width="17" height="17" />
            </button>
          </div>
        </section>
      </main>

      <footer className="bg-[#0d1b16] py-12 text-white">
        <div className={`${sectionWidth} grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_0.8fr_0.8fr]`}>
          <div>
            <Brand inverted homeLabel={t.accessibility.homeLink} />
            <p className="mt-4 max-w-sm text-sm leading-6 text-white/65">{t.footer.description}</p>
          </div>
          <div className="flex flex-col items-start gap-3 text-sm text-white/70">
            <h3 className="mb-1 font-semibold text-white">{t.footer.explore}</h3>
            {navigation.map((item) => <a className="transition hover:text-[#f1a370]" key={item.href} href={item.href}>{item.label}</a>)}
          </div>
          <div className="flex flex-col items-start gap-3 text-sm text-white/70">
            <h3 className="mb-1 font-semibold text-white">{t.footer.contact}</h3>
            <span>{site.location[locale]}</span>
            <span>{site.phoneDisplay}</span>
            <span>{site.email}</span>
          </div>
        </div>
        <div className={`${sectionWidth} mt-10 border-t border-white/15 pt-5 text-xs text-white/50`}>
          {t.footer.copyright}
        </div>
      </footer>

      {whatsappHref ? (
        <a
          className={floatingWhatsAppStyle}
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t.whatsapp.ariaLabel}
          title={t.whatsapp.title}
        >
          <Icon name="chat" width="22" height="22" />
        </a>
      ) : (
        <button
          className={floatingWhatsAppStyle}
          type="button"
          onClick={reserve}
          aria-label={t.whatsapp.ariaLabel}
          title={t.whatsapp.title}
        >
          <Icon name="chat" width="22" height="22" />
        </button>
      )}

      {overlay && (
        <Modal
          key={overlay.kind}
          title={
            overlay.kind === "reservation"
              ? t.reservation.title
              : overlay.kind === "gallery"
                ? photos[overlay.index].label
                : overlay.kind === "experience"
                  ? experiences[overlay.index].title
                  : articles[overlay.index].title
          }
          onClose={close}
          closeLabel={t.accessibility.closeDialog}
          wide={overlay.kind === "gallery"}
        >
          {overlay.kind === "reservation" && <Reservation locale={locale} />}
          {overlay.kind === "gallery" && (
            <div className="p-5">
              <div className="relative h-[min(60vw,520px)] overflow-hidden rounded-xl bg-[#10251f]">
                <Image src={photos[overlay.index].src} alt={photos[overlay.index].alt} fill sizes="(max-width: 700px) 95vw, 900px" className="object-contain" />
              </div>
              <div className="mt-4 flex items-center justify-between gap-4">
                <div aria-live="polite">
                  <p className="font-semibold text-[var(--foreground)]">{photos[overlay.index].location}</p>
                  <p className="mt-1 text-xs text-[var(--muted)]">{overlay.index + 1} / {photos.length} | {t.gallery.dialogPreview}</p>
                </div>
                <div className="flex gap-2">
                  <button className="grid size-10 place-items-center rounded-full bg-[var(--soft)] text-[var(--foreground)]" aria-label={t.gallery.previousPhoto} onClick={() => setOverlay({ kind: "gallery", index: (overlay.index + photos.length - 1) % photos.length })}>
                    <Icon name="arrow" className="rotate-180" />
                  </button>
                  <button className="grid size-10 place-items-center rounded-full bg-[var(--primary)] text-white" aria-label={t.gallery.nextPhoto} onClick={() => setOverlay({ kind: "gallery", index: (overlay.index + 1) % photos.length })}>
                    <Icon name="arrow" />
                  </button>
                </div>
              </div>
              <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
                {photos.map((photo, index) => (
                  <button key={photo.src} className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-lg ${overlay.index === index ? "ring-2 ring-[var(--primary)] ring-offset-2" : "opacity-65 hover:opacity-100"}`} aria-label={`${t.gallery.showPhoto} ${photo.location}`} aria-pressed={overlay.index === index} onClick={() => setOverlay({ kind: "gallery", index })}>
                    <Image src={photo.src} alt="" fill sizes="100px" className="object-cover" />
                  </button>
                ))}
              </div>
            </div>
          )}
          {overlay.kind === "experience" && (
            <div className="p-6 sm:p-8">
              <div className="relative mb-6 h-56 overflow-hidden rounded-2xl">
                <Image src={photos[experiences[overlay.index].photo].src} alt={photos[experiences[overlay.index].photo].alt} fill sizes="600px" className="object-cover" />
              </div>
              <p className="text-sm leading-7 text-[var(--muted)]">{experiences[overlay.index].details}</p>
              <ul className="my-6 space-y-3">
                {experiences[overlay.index].notes.map((note) => <li className="flex items-start gap-3 text-sm text-[var(--foreground)]" key={note}><Icon name="check" className="mt-0.5 text-[var(--primary)]" width="17" height="17" />{note}</li>)}
              </ul>
              <p className="mb-5 text-xs leading-5 text-[var(--muted)]">{t.dialogs.activityDetails}</p>
              <button className={primaryAction} onClick={reserve}>{t.dialogs.askAboutActivity} <Icon name="arrow" /></button>
            </div>
          )}
          {overlay.kind === "article" && (
            <div className="p-6 sm:p-8">
              <div className="relative mb-6 h-56 overflow-hidden rounded-2xl">
                <Image src={photos[articles[overlay.index].photo].src} alt={photos[articles[overlay.index].photo].alt} fill sizes="600px" className="object-cover" />
              </div>
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-[var(--primary)]">{articles[overlay.index].category}</p>
              <p className="text-sm leading-7 text-[var(--muted)]">{articles[overlay.index].text}</p>
              <button className={`${primaryAction} mt-6`} onClick={close}>{t.dialogs.back} <Icon name="arrow" /></button>
            </div>
          )}
        </Modal>
      )}
    </>
  );
}
