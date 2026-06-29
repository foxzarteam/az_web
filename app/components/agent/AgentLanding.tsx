"use client";

import Image from "next/image";
import Link from "next/link";
import { AGENT_PROFILE } from "@/app/agent/agent-config";
import AgentLeadForm from "./AgentLeadForm";

function IconPhone({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  );
}

function IconMail({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );
}

function IconMap({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

/** Same width + padding as other site pages (footer, about, services). */
const PAGE_WRAP = "container mx-auto w-full max-w-full md:max-w-screen-md lg:max-w-screen-xl px-4 sm:px-6 lg:px-8";

export default function AgentLanding() {
  const telDigits = AGENT_PROFILE.phone.replace(/\D/g, "");
  const telHref =
    telDigits.length === 10
      ? `tel:+91${telDigits}`
      : telDigits.length > 10
        ? `tel:+${telDigits}`
        : `tel:${AGENT_PROFILE.phone.replace(/\s/g, "")}`;

  return (
    <main className="agent-portfolio relative min-h-screen min-w-0 overflow-x-hidden bg-gradient-to-br from-light via-white to-[#f5f0ff] text-midnight_text dark:from-[#040810] dark:via-[#0a1424] dark:to-[#060a12] dark:text-[#f0f6fa]">
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden>
        <div className="agent-landing-blob absolute -right-20 top-[-8%] h-[min(560px,58vw)] w-[min(560px,58vw)] rounded-full bg-primary/20 blur-[110px] dark:bg-primary/25" />
        <div className="agent-landing-blob agent-landing-blob--delayed absolute -left-28 top-[28%] h-[min(400px,70vw)] w-[min(400px,70vw)] rounded-full bg-cyan/25 blur-[100px] dark:bg-cyan/15" />
        <div className="absolute bottom-[-15%] left-1/2 h-[480px] w-[min(90vw,520px)] -translate-x-1/2 rounded-full bg-skyBlue/20 blur-[110px] dark:bg-primary/20" />
        <div
          className="absolute inset-0 opacity-[0.35] dark:opacity-[0.08]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgb(66 54 251 / 0.14) 1px, transparent 0)`,
            backgroundSize: "24px 24px",
          }}
        />
      </div>

      <div className="relative z-[1]">
        <header className="border-b border-primary/10 bg-white/70 backdrop-blur-lg dark:border-primary/20 dark:bg-[#080f18]/75">
          <div className={`flex items-center justify-between gap-4 py-4 ${PAGE_WRAP}`}>
            <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.22em] text-primary dark:border-primary/30 dark:bg-primary/15 dark:text-sky-200">
              Your advisor
            </span>
            <Link
              href="/"
              className="rounded-full border border-primary/25 bg-gradient-to-r from-white to-light px-4 py-2 text-xs font-bold text-midnight_text shadow-md shadow-primary/10 transition hover:border-primary/50 hover:shadow-lg hover:shadow-primary/20 dark:border-primary/35 dark:from-semidark dark:to-darklight dark:text-white dark:hover:border-cyan/40"
            >
              Apni Zaroorat
            </Link>
          </div>
        </header>

        {/* Hero */}
        <section className={`py-16 sm:py-20 lg:grid lg:grid-cols-12 lg:gap-12 lg:py-24 ${PAGE_WRAP}`}>
          <div className="lg:col-span-7" data-aos="fade-up">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">Apni Zaroorat</p>
            <div className="mt-3 h-1 w-14 rounded-full theme-gradient-bg" aria-hidden />
            <h1 className="mt-5 theme-gradient-text text-[1.65rem] xs:text-[1.85rem] sm:text-4xl lg:text-[3.25rem] font-bold leading-[1.12] tracking-tight">
              {AGENT_PROFILE.displayName}
            </h1>
            <p className="mt-3 text-lg font-semibold text-secondary sm:text-xl dark:text-sky-200/90">{AGENT_PROFILE.role}</p>
            <p className="mt-8 max-w-xl text-base leading-relaxed text-gray sm:text-[1.05rem] dark:text-gray-300">
              {AGENT_PROFILE.headline}
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-3">
              <a
                href="#contact"
                className="btn-gradient inline-flex items-center justify-center rounded-full px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-primary/35 transition hover:opacity-95"
              >
                Get in touch
              </a>
              <a
                href={telHref}
                className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-3 text-sm font-bold text-primary transition hover:bg-primary/10 dark:border-cyan/30 dark:bg-cyan/10 dark:text-cyan-200 dark:hover:bg-cyan/15"
              >
                <IconPhone className="h-4 w-4" />
                Call me
              </a>
            </div>
          </div>

          <div className="relative mt-14 flex justify-center lg:col-span-5 lg:mt-0" data-aos="fade-up" data-aos-delay="80">
            <div className="relative mx-auto aspect-square w-full max-w-[min(100%,276px)] sm:max-w-[min(100%,336px)] lg:mx-0 lg:max-w-[min(100%,352px)]">
              <div
                className="absolute -inset-3 rounded-[2rem] bg-gradient-to-br from-primary/40 via-cyan/30 to-skyBlue/25 opacity-90 blur-2xl dark:from-primary/30 dark:via-cyan/20"
                aria-hidden
              />
              <div className="relative flex h-full min-h-0 flex-col overflow-hidden rounded-[1.75rem] border-2 border-primary/25 bg-gradient-to-b from-white to-light shadow-2xl shadow-primary/25 ring-1 ring-white/80 dark:border-primary/30 dark:from-darklight dark:to-semidark dark:shadow-primary/20 dark:ring-white/5">
                {AGENT_PROFILE.photoUrl ? (
                  <div className="relative min-h-0 w-full flex-1">
                    <Image
                      src={AGENT_PROFILE.photoUrl}
                      alt={AGENT_PROFILE.displayName}
                      fill
                      className="object-cover object-top"
                      sizes="(max-width: 640px) 276px, 352px"
                      priority
                    />
                  </div>
                ) : (
                  <div className="flex min-h-0 flex-1 flex-col items-center justify-center theme-gradient-bg px-4 py-6 text-center sm:px-6 sm:py-8">
                    <span className="text-5xl font-semibold tracking-tight text-white/95 sm:text-6xl lg:text-7xl">{AGENT_PROFILE.avatarInitials}</span>
                    <span className="mt-2 text-xs font-medium text-white/70 sm:mt-3 sm:text-sm">Advisor</span>
                  </div>
                )}
                <div className="shrink-0 border-t border-primary/10 bg-gradient-to-r from-primary/[0.06] via-transparent to-accent/[0.06] px-4 py-3 dark:border-primary/20 sm:px-5 sm:py-3.5">
                  <p className="text-[11px] font-medium leading-snug text-gray dark:text-gray-300 sm:text-xs sm:leading-relaxed">
                    Loans and insurance help through Apni Zaroorat.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact + form */}
        <section
          id="contact"
          className="scroll-mt-24 border-t border-primary/15 bg-white py-16 dark:border-primary/20 dark:bg-darkmode sm:py-20 md:py-24"
        >
          <div className={`${PAGE_WRAP} flex flex-col gap-16 md:gap-24`}>
            <div className="grid gap-12 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-5" data-aos="fade-up">
              <h2 className="text-xs font-bold uppercase tracking-[0.28em] text-primary">Contact</h2>
              <p className="mt-3 text-2xl font-bold tracking-tight text-midnight_text dark:text-white sm:text-3xl">Contact me</p>
              <p className="mt-3 text-gray dark:text-gray-300">
                Use the form or call. I read every message and reply as soon as I can, often within one working day.
              </p>

              <ul className="mt-10 space-y-4">
                <li>
                  <a
                    href={telHref}
                    className="flex items-start gap-4 rounded-2xl border border-primary/15 bg-white/90 p-4 shadow-md shadow-primary/5 backdrop-blur-sm transition hover:border-primary/40 hover:shadow-lg hover:shadow-primary/15 dark:border-white/10 dark:bg-darklight/90 dark:hover:border-primary/50"
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-cyan/30 text-primary">
                      <IconPhone className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-primary/80 dark:text-sky-300/90">Phone</p>
                      <p className="mt-0.5 font-semibold text-midnight_text dark:text-white">{AGENT_PROFILE.phone}</p>
                    </div>
                  </a>
                </li>
                <li>
                  <a
                    href={`mailto:${AGENT_PROFILE.email}`}
                    className="flex items-start gap-4 rounded-2xl border border-primary/15 bg-white/90 p-4 shadow-md shadow-primary/5 backdrop-blur-sm transition hover:border-primary/40 hover:shadow-lg hover:shadow-primary/15 dark:border-white/10 dark:bg-darklight/90 dark:hover:border-primary/50"
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-cyan/30 text-primary">
                      <IconMail className="h-5 w-5" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-primary/80 dark:text-sky-300/90">Email</p>
                      <p className="mt-0.5 break-all font-semibold text-midnight_text dark:text-white">{AGENT_PROFILE.email}</p>
                    </div>
                  </a>
                </li>
                <li className="flex items-start gap-4 rounded-2xl border border-primary/15 bg-white/90 p-4 shadow-md shadow-primary/5 backdrop-blur-sm dark:border-white/10 dark:bg-darklight/90">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-cyan/30 text-primary">
                    <IconMap className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-primary/80 dark:text-sky-300/90">Location</p>
                    <p className="mt-0.5 whitespace-pre-line text-sm font-medium leading-relaxed text-midnight_text dark:text-white">{AGENT_PROFILE.address}</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="lg:col-span-7" data-aos="fade-up" data-aos-delay="100">
              <AgentLeadForm agentName={AGENT_PROFILE.displayName} />
            </div>
            </div>

            <ul
              className="grid gap-4 sm:grid-cols-3 sm:gap-5 lg:gap-6"
              data-aos="fade-up"
              aria-label="How we support you"
            >
              {AGENT_PROFILE.contactBoxes.map((box) => (
                <li
                  key={box.title}
                  className="relative flex flex-col overflow-hidden rounded-2xl border border-primary/15 bg-white p-5 shadow-md shadow-primary/10 sm:p-6 dark:border-white/10 dark:bg-darklight dark:shadow-lg dark:shadow-black/20"
                >
                  <div
                    className="absolute inset-x-0 top-0 h-1 theme-gradient-bg opacity-90"
                    aria-hidden
                  />
                  <p className="mt-2 text-lg font-bold tracking-tight text-midnight_text dark:text-white">{box.title}</p>
                  <p className="mt-2 text-sm leading-relaxed text-gray dark:text-gray-300">{box.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </main>
  );
}
