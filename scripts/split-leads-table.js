const fs = require("fs");
const dir = "d:/apnizaroorat/az_web/app/admin/dashboard/leads";
const p = dir + "/LeadsTable.tsx";
const lines = fs.readFileSync(p, "utf8").split(/\r?\n/);

// 1-based ranges from earlier read
// DEFAULT_LOAN_AMOUNT + CATEGORIES..amountOrInsuranceText : lines 26-142
// EditForm..validateLeadForm + FieldErrorText : 144-237  
// LeadFormFields : 239-398
// export default LeadsTable from 400

const displayBody = lines.slice(25, 142).join("\n"); // includes DEFAULT_LOAN_AMOUNT through amountOrInsuranceText
const formLogicBody = lines.slice(143, 237).join("\n"); // EditForm through FieldErrorText
const formFieldsBody = lines.slice(238, 398).join("\n"); // LeadFormFields function
const tableRest = lines.slice(399).join("\n"); // export default function LeadsTable...

fs.writeFileSync(
  dir + "/leadDisplay.ts",
  `import type { AdminLeadRow } from "@/app/lib/admin/fetchLeads";
import {
  employmentTypeLabel,
  insuranceTypeLabel,
  loanAmountLabel,
} from "@/app/utils/leadForm";

${displayBody}
`,
);

fs.writeFileSync(
  dir + "/leadEditForm.ts",
  `import type { AdminLeadRow } from "@/app/lib/admin/fetchLeads";
import { PERSONAL_LOAN_EMI_LIMITS } from "@/app/config/constants";
import { DEFAULT_LOAN_AMOUNT } from "./leadDisplay";

${formLogicBody}
`,
);

fs.writeFileSync(
  dir + "/LeadFormFields.tsx",
  `"use client";

import LoanAmountSlider from "@/app/components/services/LoanAmountSlider";
import EmploymentIncomeFields from "@/app/components/leads/EmploymentIncomeFields";
import { INSURANCE_TYPE_OPTIONS } from "@/app/utils/leadForm";
import {
  ADMIN_BTN_SECONDARY,
  ADMIN_LABEL,
} from "../adminUi";
import {
  CATEGORIES,
  STATUSES,
  isMaskedPanValue,
} from "./leadDisplay";
import {
  type EditForm,
  type FieldErrors,
  FieldErrorText,
} from "./leadEditForm";

${formFieldsBody}
`,
);

const newTable = `"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { AdminLeadRow } from "@/app/lib/admin/fetchLeads";
import CrmDataTable, { CrmActionButton, type CrmColumn } from "../CrmDataTable";
import AdminModal from "../AdminModal";
import {
  ADMIN_BTN_DANGER,
  ADMIN_BTN_PRIMARY,
  ADMIN_BTN_SECONDARY,
  ADMIN_ERROR,
  ADMIN_INPUT,
} from "../adminUi";
import LeadFormFields from "./LeadFormFields";
import {
  VIEW_FIELDS,
  FIELD_LABELS,
  categoryLabel,
  cellText,
  amountOrInsuranceText,
  formatValue,
  isOtpVerified,
} from "./leadDisplay";
import {
  type EditForm,
  type FieldErrors,
  emptyCreateForm,
  leadToEditForm,
  validateLeadForm,
  isMaskedPanValue,
} from "./leadEditForm";

${tableRest}
`;

// Fix imports of isMaskedPanValue - it's in leadDisplay and leadEditForm needs it
// leadEditForm already has isMaskedPanValue function defined in formLogicBody

fs.writeFileSync(dir + "/LeadsTable.tsx", newTable);
console.log("extracted ok", {
  display: displayBody.split("\n").length,
  form: formLogicBody.split("\n").length,
  fields: formFieldsBody.split("\n").length,
  table: tableRest.split("\n").length,
});
