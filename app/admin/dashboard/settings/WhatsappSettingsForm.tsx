"use client";

import { useState } from "react";
import { PUBLIC_SITE_URL } from "@/app/config/constants";
import type { WhatsappSettingsView } from "@/app/lib/admin/fetchWhatsapp";
import { toPublicClientError } from "@/app/lib/publicClientError";
import SuccessPopup from "@/app/components/shared/SuccessPopup";
import {
  ADMIN_BTN_PRIMARY,
  ADMIN_CARD,
  ADMIN_ERROR,
  ADMIN_INPUT,
  ADMIN_LABEL,
} from "@/app/components/shared/crm/ui";

type Props = { initial: WhatsappSettingsView };

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className={ADMIN_LABEL}>{label}</span>
      {children}
    </label>
  );
}

function savedPlaceholder(configured: boolean, hint: string, empty: string): string {
  return configured && hint ? `Saved ${hint}` : empty;
}

export default function WhatsappSettingsForm({ initial }: Props) {
  const [saved, setSaved] = useState(initial);
  const [accessToken, setAccessToken] = useState("");
  const [phoneNumberId, setPhoneNumberId] = useState(initial.phoneNumberId);
  const [businessAccountId, setBusinessAccountId] = useState(initial.businessAccountId);
  const [appSecret, setAppSecret] = useState("");
  const [verifyToken, setVerifyToken] = useState("");
  const [geminiApiKey, setGeminiApiKey] = useState("");
  const [geminiModel, setGeminiModel] = useState(initial.geminiModel);
  const [geminiModels, setGeminiModels] = useState(initial.geminiModels ?? []);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const webhookUrl = `${PUBLIC_SITE_URL.replace(/\/+$/, "")}/api/whatsapp/webhook`;

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError(null);
    setWarning(null);
    try {
      const res = await fetch("/api/admin/whatsapp/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accessToken,
          phoneNumberId,
          businessAccountId,
          appSecret,
          verifyToken,
          geminiApiKey,
          geminiModel,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
        warning?: string;
        data?: WhatsappSettingsView;
      };
      if (!res.ok || !data.data) {
        setError(toPublicClientError(data.error, "Could not save WhatsApp settings."));
        return;
      }
      setSaved(data.data);
      setPhoneNumberId(data.data.phoneNumberId);
      setBusinessAccountId(data.data.businessAccountId);
      setGeminiModel(data.data.geminiModel);
      setGeminiModels(data.data.geminiModels ?? []);
      setAccessToken("");
      setAppSecret("");
      setVerifyToken("");
      setGeminiApiKey("");
      if (data.warning && /not available|did not return|No Gemini model/i.test(data.warning)) {
        setError(data.warning);
      } else if (data.warning) {
        setWarning(data.warning);
      }
      setSuccess(data.warning ? "Settings saved. Read the Gemini note above." : "WhatsApp settings saved.");
    } catch {
      setError("Network error. Try again.");
    } finally {
      setSaving(false);
    }
  }

  async function copyWebhook() {
    try {
      await navigator.clipboard.writeText(webhookUrl);
      setSuccess("Webhook URL copied.");
    } catch {
      setError("Could not copy the webhook URL.");
    }
  }

  return (
    <form onSubmit={onSubmit} className={`${ADMIN_CARD} p-5 sm:p-6`}>
      <div className="mb-6">
        <h2 className="text-base font-semibold text-slate-900">WhatsApp Integration</h2>
        <p className="mt-1 text-sm text-slate-500">
          Credentials are encrypted in the database. Leave a secret blank to keep the saved value.
        </p>
      </div>

      <div className="mb-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
        <p className={ADMIN_LABEL}>Webhook URL</p>
        <div className="flex gap-2">
          <input readOnly value={webhookUrl} className={`${ADMIN_INPUT} min-w-0 flex-1`} />
          <button type="button" onClick={() => void copyWebhook()} className={`${ADMIN_BTN_PRIMARY} shrink-0 whitespace-nowrap`}>
            Copy
          </button>
        </div>
      </div>

      {saved.displayPhone ? (
        <p className="mb-5 text-sm text-emerald-700">
          Website button opens WhatsApp <span className="font-semibold">+{saved.displayPhone}</span>
        </p>
      ) : (
        <p className="mb-5 text-sm text-slate-500">
          The website button appears after a valid access token and phone number ID are saved.
        </p>
      )}

      <div className="grid gap-5 md:grid-cols-2">
        <Field label="WhatsApp Access Token">
          <input
            type="password"
            autoComplete="new-password"
            value={accessToken}
            onChange={(e) => setAccessToken(e.target.value)}
            placeholder={savedPlaceholder(saved.accessTokenConfigured, saved.accessTokenHint, "Not saved yet")}
            className={ADMIN_INPUT}
          />
        </Field>
        <Field label="Phone Number ID">
          <input
            value={phoneNumberId}
            onChange={(e) => setPhoneNumberId(e.target.value)}
            inputMode="numeric"
            className={ADMIN_INPUT}
          />
        </Field>
        <Field label="Business Account ID">
          <input
            value={businessAccountId}
            onChange={(e) => setBusinessAccountId(e.target.value)}
            inputMode="numeric"
            className={ADMIN_INPUT}
          />
        </Field>
        <Field label="App Secret">
          <input
            type="password"
            autoComplete="new-password"
            value={appSecret}
            onChange={(e) => setAppSecret(e.target.value)}
            placeholder={savedPlaceholder(saved.appSecretConfigured, saved.appSecretHint, "Not saved yet")}
            className={ADMIN_INPUT}
          />
        </Field>
        <Field label="Webhook Verify Token">
          <input
            type="password"
            autoComplete="new-password"
            value={verifyToken}
            onChange={(e) => setVerifyToken(e.target.value)}
            placeholder={savedPlaceholder(saved.verifyTokenConfigured, saved.verifyTokenHint, "At least 8 characters")}
            className={ADMIN_INPUT}
          />
        </Field>
        <Field label="Gemini API Key">
          <input
            type="password"
            autoComplete="new-password"
            value={geminiApiKey}
            onChange={(e) => setGeminiApiKey(e.target.value)}
            placeholder={savedPlaceholder(saved.geminiApiKeyConfigured, saved.geminiApiKeyHint, "Not saved yet")}
            className={ADMIN_INPUT}
          />
        </Field>
        <Field label="Gemini Model">
          <input
            list="gemini-models"
            value={geminiModel}
            onChange={(e) => setGeminiModel(e.target.value)}
            placeholder="Current free-tier model"
            className={ADMIN_INPUT}
          />
          <datalist id="gemini-models">
            {geminiModels.map((model) => (
              <option key={model} value={model} />
            ))}
          </datalist>
        </Field>
      </div>

      {error ? <p className={`${ADMIN_ERROR} mt-5`}>{error}</p> : null}
      {warning ? (
        <p className="mt-5 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">{warning}</p>
      ) : null}

      <div className="mt-6 flex justify-end">
        <button type="submit" disabled={saving} className={ADMIN_BTN_PRIMARY}>
          {saving ? "Saving…" : "Save settings"}
        </button>
      </div>

      {success ? <SuccessPopup message={success} onClose={() => setSuccess(null)} /> : null}
    </form>
  );
}
