"use client";

import Image from "next/image";
import Link from "next/link";
import { AGENT_PROFILE, buildWhatsAppHref } from "@/app/agent/agent-config";
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

function IconWhatsApp({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

export default function AgentLanding() {
  const wa = buildWhatsAppHref(AGENT_PROFILE.phone);
  const telDigits = AGENT_PROFILE.phone.replace(/\D/g, "");
  const telHref =
    telDigits.length === 10
      ? `tel:+91${telDigits}`
      : telDigits.length > 10
        ? `tel:+${telDigits}`
        : `tel:${AGENT_PROFILE.phone.replace(/\s/g, "")}`;

  return (
    <main className="agent-landing relative min-w-0 overflow-hidden bg-[#f4f7fc] dark:bg-[#0a0f18]">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="agent-landing-blob absolute -right-20 -top-28 h-[420px] w-[420px] rounded-full bg-primary/25 blur-[100px] dark:bg-primary/20" />
        <div className="agent-landing-blob agent-landing-blob--delayed absolute -left-32 top-1/4 h-[340px] w-[340px] rounded-full bg-cyan/20 blur-[90px] dark:bg-cyan/10" />
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-primary/[0.07] to-transparent dark:from-primary/10" />
        <div
          className="absolute inset-0 opacity-[0.4] dark:opacity-[0.12]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgb(47 115 242 / 0.12) 1px, transparent 0)`,
            backgroundSize: "28px 28px",
          }}
        />
      </div>

      <div className="relative z-[1] mx-auto max-w-full px-4 pb-16 pt-24 sm:px-6 sm:pb-20 sm:pt-28 md:pt-32 lg:max-w-6xl lg:px-8">
        {/* Compact hero */}
        <header className="mb-10 flex flex-col items-center text-center lg:mb-12" data-aos="fade-down">
          <span className="agent-badge mb-4 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-white/90 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-primary shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5 dark:text-sky-300">
            Apni Zaroorat · Advisor
          </span>
          <h1 className="w-full text-[2rem] font-bold leading-[1.1] tracking-tight text-midnight_text dark:text-white sm:text-4xl md:text-5xl">
            <span className="agent-name-gradient bg-gradient-to-r from-[#102D47] via-primary to-[#0369a1] bg-[length:200%_auto] bg-clip-text text-transparent dark:from-white dark:via-sky-200 dark:to-sky-400">
              {AGENT_PROFILE.displayName}
            </span>
          </h1>
          <p className="mt-2 text-base font-medium text-primary dark:text-sky-400 sm:text-lg">{AGENT_PROFILE.role}</p>
        </header>

        <div className="grid gap-6 lg:grid-cols-12 lg:gap-8 lg:items-start">
          {/* Profile card */}
          <aside
            className="agent-glass-card flex flex-col rounded-3xl border border-white/70 bg-white/75 p-6 shadow-[0_25px_60px_-15px_rgba(47,115,242,0.18)] backdrop-blur-xl dark:border-white/10 dark:bg-semidark/75 dark:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] sm:p-8 lg:col-span-5"
            data-aos="fade-right"
            data-aos-delay="80"
          >
            <div className="flex justify-center">
              <div className="relative shrink-0">
                <div className="absolute -inset-0.5 rounded-full bg-gradient-to-br from-primary via-sky-400 to-cyan opacity-80 blur-[1.5px]" aria-hidden />
                <div className="relative h-20 w-20 overflow-hidden rounded-full border-[3px] border-white shadow-md dark:border-darklight">
                  {AGENT_PROFILE.photoUrl ? (
                    <Image
                      src={AGENT_PROFILE.photoUrl}
                      alt={AGENT_PROFILE.displayName}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary via-[#2563eb] to-sky-600 text-lg font-bold tracking-tight text-white">
                      {AGENT_PROFILE.avatarInitials}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-8 space-y-3 border-t border-slate-200/80 pt-8 dark:border-white/10">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray dark:text-gray-500">Location</p>
              <div className="flex gap-3 rounded-2xl bg-slate-50/90 px-4 py-3 dark:bg-white/[0.04]">
                <IconMap className="mt-0.5 h-5 w-5 shrink-0 text-primary dark:text-sky-400" />
                <p className="whitespace-pre-line text-sm leading-relaxed text-midnight_text/90 dark:text-gray-300">
                  {AGENT_PROFILE.address}
                </p>
              </div>
            </div>

            <div className="mt-8 space-y-2 border-t border-slate-200/80 pt-8 dark:border-white/10">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray dark:text-gray-500">Contact</p>
              <a
                href={telHref}
                className="group flex items-center gap-3 rounded-2xl border border-transparent bg-slate-50/90 px-4 py-3 transition hover:border-primary/20 hover:bg-white hover:shadow-md dark:bg-white/[0.04] dark:hover:border-sky-500/20 dark:hover:bg-white/[0.06]"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-white dark:bg-sky-500/15 dark:text-sky-300 dark:group-hover:bg-sky-500 dark:group-hover:text-white">
                  <IconPhone className="h-5 w-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-xs text-gray dark:text-gray-500">Phone</span>
                  <span className="font-semibold text-midnight_text dark:text-white">{AGENT_PROFILE.phone}</span>
                </span>
              </a>
              <a
                href={`mailto:${AGENT_PROFILE.email}`}
                className="group flex items-center gap-3 rounded-2xl border border-transparent bg-slate-50/90 px-4 py-3 transition hover:border-primary/20 hover:bg-white hover:shadow-md dark:bg-white/[0.04] dark:hover:border-sky-500/20 dark:hover:bg-white/[0.06]"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-white dark:bg-sky-500/15 dark:text-sky-300 dark:group-hover:bg-sky-500 dark:group-hover:text-white">
                  <IconMail className="h-5 w-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-xs text-gray dark:text-gray-500">Email</span>
                  <span className="break-all font-semibold text-midnight_text dark:text-white">{AGENT_PROFILE.email}</span>
                </span>
              </a>
              {wa !== "#" ? (
                <a
                  href={wa}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 rounded-2xl border border-transparent bg-emerald-500/[0.08] px-4 py-3 transition hover:border-emerald-500/30 hover:bg-emerald-500/10 hover:shadow-md dark:bg-emerald-500/10"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-600 transition group-hover:bg-emerald-500 group-hover:text-white dark:text-emerald-400">
                    <IconWhatsApp className="h-5 w-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-xs text-gray dark:text-gray-500">WhatsApp</span>
                    <span className="font-semibold text-midnight_text dark:text-white">Message instantly</span>
                  </span>
                </a>
              ) : null}
            </div>

            <div className="mt-8 border-t border-slate-200/80 pt-8 dark:border-white/10">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray dark:text-gray-500">Services</p>
              <p className="mt-1 text-xs text-gray dark:text-gray-500">Areas I can help you with</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {AGENT_PROFILE.services.map((name) => (
                  <span
                    key={name}
                    className="inline-flex items-center rounded-full border border-primary/20 bg-gradient-to-b from-white to-slate-50/90 px-3 py-1.5 text-[11px] font-semibold text-midnight_text shadow-sm ring-1 ring-slate-200/80 dark:border-sky-500/25 dark:from-semidark dark:to-darklight dark:text-sky-100 dark:ring-white/10 sm:px-4 sm:py-2 sm:text-xs"
                  >
                    {name}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-auto pt-8">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-sm font-medium text-gray transition hover:text-primary dark:text-gray-400 dark:hover:text-sky-400"
              >
                <span aria-hidden>←</span> Back to Apni Zaroorat
              </Link>
            </div>
          </aside>

          {/* Form */}
          <div className="lg:col-span-7" data-aos="fade-left" data-aos-delay="120">
            <AgentLeadForm agentName={AGENT_PROFILE.displayName} />
          </div>
        </div>
      </div>
    </main>
  );
}
