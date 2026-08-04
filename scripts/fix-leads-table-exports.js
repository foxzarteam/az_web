const fs = require("fs");

function exportNames(path, names) {
  let c = fs.readFileSync(path, "utf8");
  for (const n of names) {
    c = c.replace(new RegExp("^(const|function|type) " + n + "\\b", "m"), (m, k) => `export ${k} ${n}`);
  }
  fs.writeFileSync(path, c);
}

exportNames("d:/apnizaroorat/az_web/app/admin/dashboard/leads/leadDisplay.ts", [
  "DEFAULT_LOAN_AMOUNT",
  "CATEGORIES",
  "STATUSES",
  "VIEW_FIELDS",
  "FIELD_LABELS",
  "categoryLabel",
  "formatCurrencyInr",
  "formatValue",
  "isOtpVerified",
  "cellText",
  "amountOrInsuranceText",
]);

let edit = fs.readFileSync(
  "d:/apnizaroorat/az_web/app/admin/dashboard/leads/leadEditForm.ts",
  "utf8",
);
edit = edit.replace(/\nfunction FieldErrorText[\s\S]*$/, "\n");
for (const n of [
  "EditForm",
  "clampLoanAmount",
  "leadToEditForm",
  "emptyCreateForm",
  "FieldErrors",
  "isMaskedPanValue",
  "validateLeadForm",
]) {
  edit = edit.replace(
    new RegExp("^(type|function) " + n + "\\b", "m"),
    (m, k) => `export ${k} ${n}`,
  );
}
fs.writeFileSync(
  "d:/apnizaroorat/az_web/app/admin/dashboard/leads/leadEditForm.ts",
  edit,
);

let form = fs.readFileSync(
  "d:/apnizaroorat/az_web/app/admin/dashboard/leads/LeadFormFields.tsx",
  "utf8",
);
form = form.replace(
  `import {
  CATEGORIES,
  STATUSES,
  isMaskedPanValue,
} from "./leadDisplay";
import {
  type EditForm,
  type FieldErrors,
  FieldErrorText,
} from "./leadEditForm";
`,
  `import { CATEGORIES, STATUSES } from "./leadDisplay";
import {
  type EditForm,
  type FieldErrors,
  isMaskedPanValue,
} from "./leadEditForm";

function FieldErrorText({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <span className="mt-1 block text-xs text-red-600 dark:text-red-400">{message}</span>
  );
}
`,
);
form = form.replace(/^function LeadFormFields/m, "export default function LeadFormFields");
fs.writeFileSync(
  "d:/apnizaroorat/az_web/app/admin/dashboard/leads/LeadFormFields.tsx",
  form,
);

console.log("ok");
