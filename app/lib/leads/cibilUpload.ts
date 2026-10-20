/** Same byte cap as server/src/leads/loan-rules.ts. The form does not show this number. */
const CIBIL_REPORT_MAX_BYTES = 200 * 1024 * 1024;

const CIBIL_FILE_TYPES = new Set(["application/pdf", "image/jpeg", "image/png", "image/webp"]);

export type CibilUpload = { name: string; mime: string; data: string };

/** Optional CIBIL file. The size limit is the same constant the API uses. */
export function readOptionalCibilUpload(file: File): Promise<
  { ok: true; file: CibilUpload } | { ok: false; message: string }
> {
  const mime = file.type === "image/jpg" ? "image/jpeg" : file.type;
  if (!CIBIL_FILE_TYPES.has(mime)) {
    return Promise.resolve({ ok: false, message: "Upload a PDF or image (JPG, PNG, WEBP)." });
  }
  if (file.size > CIBIL_REPORT_MAX_BYTES) {
    return Promise.resolve({ ok: false, message: "This file is too large." });
  }
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      const raw = String(reader.result ?? "");
      const data = raw.includes(",") ? raw.slice(raw.indexOf(",") + 1) : raw;
      if (!data) resolve({ ok: false, message: "Could not read the CIBIL report." });
      else resolve({ ok: true, file: { name: file.name, mime, data } });
    };
    reader.onerror = () => resolve({ ok: false, message: "Could not read the CIBIL report." });
    reader.readAsDataURL(file);
  });
}
