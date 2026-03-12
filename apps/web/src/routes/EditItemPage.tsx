import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { useLanguage } from "@/i18n/context";
import { apiRequest, isNetworkError } from "@/lib/api-client";
import { Button } from "@/components/ui/Button";
import { getButtonClasses } from "@/lib/button-styles";
import { ServiceUnavailable } from "@/components/auth/ServiceUnavailable";
import { ITEM_CATEGORIES } from "@rnbp/shared";
import type { ItemWithFiles } from "@rnbp/shared";

type FormData = {
  name: string;
  category: string;
  brand: string;
  model: string;
  year: string;
  serialNumber: string;
  estimatedValue: string;
  description: string;
};

export function EditItemPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [form, setForm] = useState<FormData>({
    name: "",
    category: "",
    brand: "",
    model: "",
    year: "",
    serialNumber: "",
    estimatedValue: "",
    description: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notFound, setNotFound] = useState(false);
  const [backendDown, setBackendDown] = useState(false);

  const edit = t.editItem;
  const reg = t.registration;

  useEffect(() => {
    if (!id) return;
    apiRequest<{ item: ItemWithFiles }>(`/items/${id}`)
      .then(({ item }) => {
        setForm({
          name: item.name,
          category: item.category,
          brand: item.brand ?? "",
          model: item.model ?? "",
          year: item.year?.toString() ?? "",
          serialNumber: item.serialNumber ?? "",
          estimatedValue: item.estimatedValue?.toString() ?? "",
          description: item.description ?? "",
        });
      })
      .catch((err) => {
        if (isNetworkError(err)) {
          setBackendDown(true);
        } else if (err.status === 404 || err.status === 403) {
          setNotFound(true);
        } else {
          setError(err.message);
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  function update(field: keyof FormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSave() {
    if (saving) return;
    setSaving(true);
    setError("");

    const body: Record<string, unknown> = {
      name: form.name,
      category: form.category,
      brand: form.brand,
      model: form.model,
      year: form.year ? Number(form.year) : undefined,
      serialNumber: form.serialNumber,
      estimatedValue: form.estimatedValue ? Number(form.estimatedValue) : undefined,
      description: form.description,
    };

    try {
      await apiRequest(`/items/${id}`, { method: "PATCH", body });
      navigate("/tableau-de-bord");
    } catch (err) {
      setError(err instanceof Error ? err.message : (edit?.error ?? "Erreur"));
    } finally {
      setSaving(false);
    }
  }

  const categoryLabels = t.allCategories.items;
  const categoryOptions = ITEM_CATEGORIES.map((slug, i) => ({
    value: slug,
    label: categoryLabels[i] ?? slug,
  }));

  const canSave = form.name.trim() !== "" && form.category !== "";
  const maxYear = new Date().getFullYear() + 1;

  if (backendDown) {
    return (
      <section className="min-h-[80vh] bg-[var(--rcb-white)]">
        <ServiceUnavailable />
      </section>
    );
  }

  if (loading) {
    return (
      <section className="min-h-[80vh] bg-[var(--rcb-white)]">
        <div className="section-shell py-16">
          <div className="flex justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--rcb-primary)] border-t-transparent" />
          </div>
        </div>
      </section>
    );
  }

  if (notFound) {
    return (
      <section className="min-h-[80vh] bg-[var(--rcb-white)]">
        <div className="section-shell py-16 text-center">
          <p className="text-lg text-[var(--rcb-text-muted)]">
            {edit?.notFound ?? "Bien introuvable."}
          </p>
          <Link
            to="/tableau-de-bord"
            className={`${getButtonClasses("primary", "sm")} mt-6`}
          >
            {edit?.backToDashboard ?? "Retour au tableau de bord"}
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-[80vh] bg-[var(--rcb-white)]">
      <div className="section-shell py-16">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-[var(--rcb-text-strong)]">
            {edit?.heading ?? "Modifier le bien"}
          </h1>
          <Link
            to="/tableau-de-bord"
            className="text-sm font-medium text-[var(--rcb-primary)] hover:underline"
          >
            {edit?.backToDashboard ?? "Retour au tableau de bord"}
          </Link>
        </div>

        {error && (
          <div className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="mx-auto mt-8 max-w-2xl space-y-5">
          <div>
            <label htmlFor="edit-category" className="mb-1 block text-sm font-medium text-[var(--rcb-text-strong)]">
              {reg?.categoryLabel ?? "Catégorie"} *
            </label>
            <select
              id="edit-category"
              value={form.category}
              onChange={(e) => update("category", e.target.value)}
              className="h-12 w-full rounded-lg border border-[var(--rcb-border)] bg-[var(--rcb-bg)] px-4 text-[var(--rcb-text-body)] focus:border-[var(--rcb-primary)] focus:outline-none"
            >
              <option value="">{reg?.categoryPlaceholder ?? "Sélectionnez une catégorie"}</option>
              {categoryOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="edit-name" className="mb-1 block text-sm font-medium text-[var(--rcb-text-strong)]">
              {reg?.nameLabel ?? "Nom du bien"} *
            </label>
            <input
              id="edit-name"
              type="text"
              required
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              className="h-12 w-full rounded-lg border border-[var(--rcb-border)] bg-[var(--rcb-bg)] px-4 text-[var(--rcb-text-body)] focus:border-[var(--rcb-primary)] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label htmlFor="edit-brand" className="mb-1 block text-sm font-medium text-[var(--rcb-text-strong)]">
                {reg?.brandLabel ?? "Marque"}
              </label>
              <input
                id="edit-brand"
                type="text"
                value={form.brand}
                onChange={(e) => update("brand", e.target.value)}
                className="h-12 w-full rounded-lg border border-[var(--rcb-border)] bg-[var(--rcb-bg)] px-4 text-[var(--rcb-text-body)] focus:border-[var(--rcb-primary)] focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="edit-model" className="mb-1 block text-sm font-medium text-[var(--rcb-text-strong)]">
                {reg?.modelLabel ?? "Modèle"}
              </label>
              <input
                id="edit-model"
                type="text"
                value={form.model}
                onChange={(e) => update("model", e.target.value)}
                className="h-12 w-full rounded-lg border border-[var(--rcb-border)] bg-[var(--rcb-bg)] px-4 text-[var(--rcb-text-body)] focus:border-[var(--rcb-primary)] focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="edit-year" className="mb-1 block text-sm font-medium text-[var(--rcb-text-strong)]">
                {reg?.yearLabel ?? "Année"}
              </label>
              <input
                id="edit-year"
                type="number"
                min="1900"
                max={maxYear}
                value={form.year}
                onChange={(e) => update("year", e.target.value)}
                className="h-12 w-full rounded-lg border border-[var(--rcb-border)] bg-[var(--rcb-bg)] px-4 text-[var(--rcb-text-body)] focus:border-[var(--rcb-primary)] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label htmlFor="edit-serial" className="mb-1 block text-sm font-medium text-[var(--rcb-text-strong)]">
              {reg?.serialLabel ?? "Numéro de série (original)"}
            </label>
            <input
              id="edit-serial"
              type="text"
              value={form.serialNumber}
              onChange={(e) => update("serialNumber", e.target.value)}
              className="h-12 w-full rounded-lg border border-[var(--rcb-border)] bg-[var(--rcb-bg)] px-4 text-[var(--rcb-text-body)] focus:border-[var(--rcb-primary)] focus:outline-none"
            />
            <p className="mt-1 text-xs text-[var(--rcb-text-muted)]">
              {reg?.serialExplanation ?? "Si votre bien possède un numéro de série du fabricant, entrez-le ici."}
            </p>
          </div>

          <div>
            <label htmlFor="edit-value" className="mb-1 block text-sm font-medium text-[var(--rcb-text-strong)]">
              {reg?.valueLabel ?? "Valeur estimée ($)"}
            </label>
            <input
              id="edit-value"
              type="number"
              min="1000"
              value={form.estimatedValue}
              onChange={(e) => update("estimatedValue", e.target.value)}
              className="h-12 w-full rounded-lg border border-[var(--rcb-border)] bg-[var(--rcb-bg)] px-4 text-[var(--rcb-text-body)] focus:border-[var(--rcb-primary)] focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="edit-description" className="mb-1 block text-sm font-medium text-[var(--rcb-text-strong)]">
              {reg?.descriptionLabel ?? "Description"}
            </label>
            <textarea
              id="edit-description"
              rows={3}
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              className="w-full rounded-lg border border-[var(--rcb-border)] bg-[var(--rcb-bg)] px-4 py-3 text-[var(--rcb-text-body)] focus:border-[var(--rcb-primary)] focus:outline-none"
            />
          </div>

          <Button
            onClick={handleSave}
            disabled={!canSave || saving}
          >
            {saving
              ? (edit?.saving ?? "Enregistrement\u2026")
              : (edit?.saveButton ?? "Enregistrer les modifications")}
          </Button>
        </div>
      </div>
    </section>
  );
}
