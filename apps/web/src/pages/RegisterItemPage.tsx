import { useState, useEffect, useCallback } from "react";
import { useLanguage } from "@/i18n/context";
import { useAuth, setRefreshToken } from "@/lib/auth-context";
import { apiRequest, setAccessToken, isNetworkError } from "@/lib/api-client";
import { getErrorMessage } from "@/lib/error-utils";
import { useCart } from "@/lib/cart-context";
import { ServiceUnavailable } from "@/components/auth/ServiceUnavailable";
import { StepIndicator } from "@/components/registration/StepIndicator";
import { StepItemDetails } from "@/components/registration/StepItemDetails";
import { StepDocuments } from "@/components/registration/StepDocuments";
import { StepStickerUpsell } from "@/components/registration/StepStickerUpsell";
import { StepAccount } from "@/components/registration/StepAccount";
import { RegistrationConfirmation } from "@/components/registration/RegistrationConfirmation";

type ItemData = {
  name: string;
  category: string;
  brand: string;
  model: string;
  year: string;
  serialNumber: string;
  estimatedValue: string;
  description: string;
};

type AccountData = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
};

const STORAGE_KEY = "rnbp_registration_draft";

function loadDraft(): { item: ItemData; account: AccountData; termsAccepted: boolean } | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveDraft(item: ItemData, account: AccountData, termsAccepted: boolean) {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ item, account, termsAccepted }));
}

function clearDraft() {
  sessionStorage.removeItem(STORAGE_KEY);
}

const emptyItem: ItemData = {
  name: "",
  category: "",
  brand: "",
  model: "",
  year: "",
  serialNumber: "",
  estimatedValue: "",
  description: "",
};

const emptyAccount: AccountData = {
  email: "",
  password: "",
  firstName: "",
  lastName: "",
  phone: "",
};

export function RegisterItemPage() {
  const { t } = useLanguage();
  const { user, refreshAuth } = useAuth();
  const { updateItemId } = useCart();
  const reg = t.registration;

  const draft = loadDraft();
  const [step, setStep] = useState(1);
  const [itemData, setItemData] = useState<ItemData>(draft?.item ?? emptyItem);
  const [accountData, setAccountData] = useState<AccountData>(draft?.account ?? emptyAccount);
  const [termsAccepted, setTermsAccepted] = useState(draft?.termsAccepted ?? false);
  const [photos, setPhotos] = useState<File[]>([]);
  const [documents, setDocuments] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [backendDown, setBackendDown] = useState(false);
  const [completed, setCompleted] = useState(false);

  // Connecté = 3 steps, non connecté = 4
  const totalSteps = user ? 3 : 4;

  // Scroll to top on step change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [step]);

  // Debounced save to sessionStorage
  useEffect(() => {
    const timeout = setTimeout(() => {
      saveDraft(itemData, accountData, termsAccepted);
    }, 500);
    return () => clearTimeout(timeout);
  }, [itemData, accountData, termsAccepted]);

  const buildItemBody = useCallback((): Record<string, unknown> => ({
    name: itemData.name,
    category: itemData.category,
    description: itemData.description || undefined,
    brand: itemData.brand || undefined,
    model: itemData.model || undefined,
    year: itemData.year ? Number(itemData.year) : undefined,
    serialNumber: itemData.serialNumber || undefined,
    estimatedValue: itemData.estimatedValue
      ? Number(itemData.estimatedValue)
      : undefined,
  }), [itemData]);

  const handleSubmitLoggedIn = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const body = buildItemBody();
      const res = await apiRequest<{ item: { id: string } }>(
        "/items",
        { method: "POST", body },
      );

      clearDraft();
      // Mettre à jour le panier si un autocollant a été ajouté pendant l'enregistrement
      updateItemId(`pending:${itemData.name}`, res.item.id);
      setCompleted(true);
      setStep(totalSteps + 1); // confirmation
    } catch (err) {
      if (isNetworkError(err)) { setBackendDown(true); return; }
      setError(getErrorMessage(err, t));
    } finally {
      setLoading(false);
    }
  }, [buildItemBody, totalSteps, itemData.name, updateItemId, t]);

  const handleSubmitWithAccount = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const res = await apiRequest<{
        item: { id: string };
        accessToken: string;
        refreshToken: string;
      }>("/auth/register-with-item", {
        method: "POST",
        body: {
          account: {
            email: accountData.email,
            password: accountData.password,
            firstName: accountData.firstName,
            lastName: accountData.lastName,
            phone: accountData.phone || undefined,
          },
          item: buildItemBody(),
        },
      });

      setAccessToken(res.accessToken);
      setRefreshToken(res.refreshToken);
      await refreshAuth();

      clearDraft();
      // Mettre à jour le panier si un autocollant a été ajouté pendant l'enregistrement
      updateItemId(`pending:${itemData.name}`, res.item.id);
      setCompleted(true);
      setStep(totalSteps + 1); // confirmation
    } catch (err) {
      if (isNetworkError(err)) { setBackendDown(true); return; }
      setError(getErrorMessage(err, t));
    } finally {
      setLoading(false);
    }
  }, [accountData, buildItemBody, totalSteps, refreshAuth, itemData.name, updateItemId, t]);

  if (backendDown) {
    return (
      <section className="min-h-[70vh] bg-[var(--rcb-white)]">
        <ServiceUnavailable />
      </section>
    );
  }

  // Confirmation screen
  if (completed) {
    return (
      <section className="section-shell py-16">
        <RegistrationConfirmation totalSteps={totalSteps} />
      </section>
    );
  }

  return (
    <section className="section-shell py-16">
      <h1 className="text-center text-3xl font-bold text-[var(--rcb-text-strong)]">
        {reg?.heading ?? "Enregistrer un bien"}
      </h1>
      <p className="mt-2 text-center text-lg text-[var(--rcb-text-muted)]">
        {reg?.description ?? ""}
      </p>

      <div className="mt-10">
        <StepIndicator currentStep={step} totalSteps={totalSteps} />
      </div>

      <div className="mt-12">
        {step === 1 && (
          <StepItemDetails
            data={itemData}
            onChange={setItemData}
            onNext={() => setStep(2)}
            termsAccepted={termsAccepted}
            onTermsChange={setTermsAccepted}
          />
        )}

        {step === 2 && (
          <StepDocuments
            photos={photos}
            documents={documents}
            onPhotosChange={setPhotos}
            onDocumentsChange={setDocuments}
            onNext={() => setStep(3)}
            onBack={() => setStep(1)}
          />
        )}

        {step === 3 && (
          <StepStickerUpsell
            itemName={itemData.name}
            onNext={() => {
              if (user) {
                handleSubmitLoggedIn();
              } else {
                setStep(4);
              }
            }}
            onBack={() => setStep(2)}
          />
        )}

        {step === 4 && !user && (
          <StepAccount
            data={accountData}
            onChange={setAccountData}
            onSubmit={handleSubmitWithAccount}
            onBack={() => setStep(3)}
            loading={loading}
            error={error}
          />
        )}
      </div>
    </section>
  );
}
