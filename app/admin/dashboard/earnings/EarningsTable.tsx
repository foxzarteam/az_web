"use client";

import CrmDataTable, { type CrmColumn } from "../CrmDataTable";

export type EarningLedgerRow = {
  id: string;
  date: string;
  type: string;
  amount: number;
  balance: number;
  note: string;
};

function formatMoney(n: number) {
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(n);
  } catch {
    return `₹${n}`;
  }
}

const columns: CrmColumn<EarningLedgerRow>[] = [
  {
    id: "date",
    header: "Date",
    sortable: true,
    sortValue: (r) => r.date,
    searchValue: (r) => r.date,
    cell: (r) => r.date || "—",
  },
  {
    id: "type",
    header: "Type",
    sortable: true,
    sortValue: (r) => r.type,
    searchValue: (r) => r.type,
    cell: (r) => r.type || "—",
  },
  {
    id: "amount",
    header: "Amount",
    sortable: true,
    sortValue: (r) => r.amount,
    searchValue: (r) => String(r.amount),
    cell: (r) => formatMoney(r.amount),
  },
  {
    id: "balance",
    header: "Balance",
    sortable: true,
    sortValue: (r) => r.balance,
    searchValue: (r) => String(r.balance),
    cell: (r) => formatMoney(r.balance),
  },
  {
    id: "note",
    header: "Note",
    sortable: true,
    sortValue: (r) => r.note,
    searchValue: (r) => r.note,
    cell: (r) => r.note || "—",
  },
];

export default function EarningsTable({ rows = [] }: { rows?: EarningLedgerRow[] }) {
  return (
    <CrmDataTable
      rows={rows}
      columns={columns}
      getRowId={(r) => r.id}
      searchPlaceholder="Search earnings…"
      emptyMessage="No records found."
      comfortable
    />
  );
}
