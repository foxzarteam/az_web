"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { AdminPartnerRow, PartnerServiceOption } from "@/app/lib/admin/fetchPartners";
import AdminModal from "@/app/components/shared/crm/AppModal";
import SuccessPopup from "@/app/components/shared/SuccessPopup";
import {
  ADMIN_BTN_DANGER,
  ADMIN_BTN_PRIMARY,
  ADMIN_BTN_SECONDARY,
  ADMIN_ERROR,
} from "@/app/components/shared/crm/ui";
import AllProductsGrid from "./AllProductsGrid";
import CatalogProductForm, {
  emptyCatalogForm,
  rowToCatalogForm,
  type CatalogProductFormValue,
} from "./CatalogProductForm";

function isStoredImagePath(path: string): boolean {
  const current = path.trim();
  return (
    current.startsWith("/images/aggregators/") ||
    current.startsWith("aggregators/") ||
    current.startsWith("cibil/") ||
    current.startsWith("https://")
  );
}

export default function ProductCatalog({
  initialPartners,
  serviceOptions,
  canDelete = false,
}: {
  initialPartners: AdminPartnerRow[];
  serviceOptions: PartnerServiceOption[];
  canDelete?: boolean;
}) {
  const router = useRouter();
  const [partners, setPartners] = useState(initialPartners);
  const [editRow, setEditRow] = useState<AdminPartnerRow | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [deleteRow, setDeleteRow] = useState<AdminPartnerRow | null>(null);
  const [form, setForm] = useState<CatalogProductFormValue>(emptyCatalogForm());
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    setPartners(initialPartners);
  }, [initialPartners]);

  const closeModals = useCallback(() => {
    setEditRow(null);
    setCreateOpen(false);
    setDeleteRow(null);
    setForm(emptyCatalogForm());
    setImageFile(null);
    setError(null);
  }, []);

  async function uploadImageIfNeeded(current: CatalogProductFormValue): Promise<string> {
    if (!imageFile) return isStoredImagePath(current.imagePath) ? current.imagePath.trim() : "";
    const body = new FormData();
    body.append("file", imageFile);
    const res = await fetch("/api/admin/partners/image", { method: "POST", body });
    const data = (await res.json().catch(() => ({}))) as { path?: string; error?: string };
    if (!res.ok || !data.path) throw new Error(data.error || "Could not upload this image.");
    return data.path;
  }

  function payload(current: CatalogProductFormValue, imagePath: string) {
    return {
      name: current.name.trim(),
      serviceId: current.selectedSortOrders.join(","),
      policy: current.policy.trim(),
      requiredDocuments: current.requiredDocuments,
      utmLink: current.utmLink.trim(),
      imagePath,
    };
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (form.selectedSortOrders.length === 0) {
      setError("Select at least one product.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const imagePath = await uploadImageIfNeeded(form);
      const res = await fetch("/api/admin/partners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload(form, imagePath)),
      });
      const data = (await res.json()) as { data?: AdminPartnerRow; error?: string; message?: string };
      if (!res.ok) {
        setError(data.error ?? data.message ?? "Could not add product.");
        return;
      }
      if (data.data) setPartners((prev) => [data.data!, ...prev]);
      closeModals();
      setSuccessMsg("Product added successfully.");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error. Try again.");
    } finally {
      setSaving(false);
    }
  }

  async function handleSaveEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editRow?.id) return;
    if (form.selectedSortOrders.length === 0) {
      setError("Select at least one product.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const imagePath = await uploadImageIfNeeded(form);
      const res = await fetch(`/api/admin/partners/${encodeURIComponent(String(editRow.id))}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload(form, imagePath)),
      });
      const data = (await res.json()) as { data?: AdminPartnerRow; error?: string; message?: string };
      if (!res.ok) {
        setError(data.error ?? data.message ?? "Could not update product.");
        return;
      }
      if (data.data) setPartners((prev) => prev.map((p) => (p.id === data.data!.id ? data.data! : p)));
      closeModals();
      setSuccessMsg("Product updated successfully.");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error. Try again.");
    } finally {
      setSaving(false);
    }
  }

  async function handleConfirmDelete() {
    if (!deleteRow?.id) return;
    setDeleting(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/partners/${encodeURIComponent(String(deleteRow.id))}`, {
        method: "DELETE",
      });
      const data = (await res.json()) as { error?: string; message?: string };
      if (!res.ok) {
        setError(data.error ?? data.message ?? "Could not delete product.");
        return;
      }
      setPartners((prev) => prev.filter((p) => p.id !== deleteRow.id));
      closeModals();
      setSuccessMsg("Product deleted successfully.");
      router.refresh();
    } catch {
      setError("Network error. Try again.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <>
      {successMsg ? <SuccessPopup message={successMsg} onClose={() => setSuccessMsg(null)} /> : null}
      <AllProductsGrid
        partners={partners}
        headerRight={
          <button type="button" onClick={() => { setCreateOpen(true); setForm(emptyCatalogForm()); setImageFile(null); setError(null); }} className={ADMIN_BTN_PRIMARY}>
            Add product
          </button>
        }
        onEdit={(row) => {
          setEditRow(row);
          setForm(rowToCatalogForm(row));
          setImageFile(null);
          setError(null);
        }}
        onDelete={canDelete ? (row) => { setDeleteRow(row); setError(null); } : undefined}
      />

      {createOpen ? (
        <AdminModal title="Add product" wide onClose={closeModals}>
          <form onSubmit={handleCreate} className="space-y-6 p-6 sm:p-8">
            {error ? <p className={ADMIN_ERROR}>{error}</p> : null}
            <CatalogProductForm form={form} setForm={setForm} serviceOptions={serviceOptions} onPickImage={setImageFile} />
            <div className="flex justify-end gap-3 border-t border-slate-200 pt-5 dark:border-dark_border">
              <button type="button" onClick={closeModals} className={ADMIN_BTN_SECONDARY}>Cancel</button>
              <button type="submit" disabled={saving} className={ADMIN_BTN_PRIMARY}>{saving ? "Saving…" : "Create"}</button>
            </div>
          </form>
        </AdminModal>
      ) : null}

      {editRow ? (
        <AdminModal title="Edit product" wide onClose={closeModals}>
          <form onSubmit={handleSaveEdit} className="space-y-6 p-6 sm:p-8">
            {error ? <p className={ADMIN_ERROR}>{error}</p> : null}
            <CatalogProductForm form={form} setForm={setForm} serviceOptions={serviceOptions} onPickImage={setImageFile} />
            <div className="flex justify-end gap-3 border-t border-slate-200 pt-5 dark:border-dark_border">
              <button type="button" onClick={closeModals} className={ADMIN_BTN_SECONDARY}>Cancel</button>
              <button type="submit" disabled={saving} className={ADMIN_BTN_PRIMARY}>{saving ? "Saving…" : "Save changes"}</button>
            </div>
          </form>
        </AdminModal>
      ) : null}

      {deleteRow ? (
        <AdminModal title="Delete product" onClose={closeModals}>
          <div className="p-6 sm:p-8">
            <p className="text-sm text-midnight_text dark:text-gray-200">
              Delete product <strong>{String(deleteRow.name ?? "")}</strong>? This cannot be undone.
            </p>
            {error ? <p className={`mt-3 ${ADMIN_ERROR}`}>{error}</p> : null}
            <div className="mt-8 flex justify-end gap-3">
              <button type="button" onClick={closeModals} className={ADMIN_BTN_SECONDARY}>Cancel</button>
              <button type="button" onClick={() => void handleConfirmDelete()} disabled={deleting} className={ADMIN_BTN_DANGER}>
                {deleting ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </AdminModal>
      ) : null}
    </>
  );
}
