import { useRef } from "react";
import { useLanguage } from "@/i18n/context";
import { Button } from "@/components/ui/Button";

type StepDocumentsProps = {
  photos: File[];
  photoUrls: string[];
  documents: File[];
  onPhotosChange: (files: File[]) => void;
  onDocumentsChange: (files: File[]) => void;
  onNext: () => void;
  onBack: () => void;
};

const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const ACCEPTED_DOC_TYPES = [...ACCEPTED_IMAGE_TYPES, "application/pdf"];
const MAX_PHOTOS = 5;
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

function PhotoPreview({
  file,
  url,
  onRemove,
}: {
  file: File;
  url: string;
  onRemove: () => void;
}) {
  return (
    <div className="group relative">
      {url ? (
        <img
          src={url}
          alt={file.name}
          className="h-20 w-20 rounded-lg object-cover"
        />
      ) : (
        <div className="h-20 w-20 rounded-lg bg-[var(--rcb-surface)]" />
      )}
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Supprimer ${file.name}`}
        className="absolute -top-2 -right-2 flex h-5 w-5 cursor-pointer items-center justify-center rounded-full bg-red-500 text-xs text-white"
      >
        &times;
      </button>
    </div>
  );
}

export function StepDocuments({
  photos,
  photoUrls,
  documents,
  onPhotosChange,
  onDocumentsChange,
  onNext,
  onBack,
}: StepDocumentsProps) {
  const { t } = useLanguage();
  const reg = t.registration!;
  const photoInputRef = useRef<HTMLInputElement>(null);
  const docInputRef = useRef<HTMLInputElement>(null);

  function addPhotos(fileList: FileList | null) {
    if (!fileList) return;
    const valid = Array.from(fileList).filter(
      (f) =>
        ACCEPTED_IMAGE_TYPES.includes(f.type) &&
        f.size <= MAX_FILE_SIZE,
    );
    const combined = [...photos, ...valid].slice(0, MAX_PHOTOS);
    onPhotosChange(combined);
  }

  function removePhoto(index: number) {
    onPhotosChange(photos.filter((_, i) => i !== index));
  }

  function addDocuments(fileList: FileList | null) {
    if (!fileList) return;
    const valid = Array.from(fileList).filter(
      (f) =>
        ACCEPTED_DOC_TYPES.includes(f.type) &&
        f.size <= MAX_FILE_SIZE,
    );
    onDocumentsChange([...documents, ...valid]);
  }

  function removeDocument(index: number) {
    onDocumentsChange(documents.filter((_, i) => i !== index));
  }

  return (
    <div className="mx-auto max-w-2xl space-y-10">
      {/* Photos */}
      <div>
        <h3 className="text-xl font-bold text-[var(--rcb-text-strong)]">
          {reg.photosHeading}
        </h3>
        <p className="mt-1 text-sm text-[var(--rcb-text-muted)]">
          {reg.photosDescription}
        </p>

        <div
          role="button"
          tabIndex={0}
          aria-label={reg.dropzoneText}
          onClick={() => photoInputRef.current?.click()}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              photoInputRef.current?.click();
            }
          }}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            addPhotos(e.dataTransfer.files);
          }}
          className="mt-4 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[var(--rcb-border)] bg-[var(--rcb-surface)] p-8 text-center transition-colors hover:border-[var(--rcb-primary)] focus:border-[var(--rcb-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--rcb-primary)]"
        >
          <svg className="mb-3 h-8 w-8 text-[var(--rcb-text-muted)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
            <path d="M12 16V4m0 0L8 8m4-4l4 4M4 20h16" />
          </svg>
          <p className="text-sm text-[var(--rcb-text-muted)]">
            {reg.dropzoneText}
          </p>
          <input
            ref={photoInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            capture="environment"
            className="hidden"
            onChange={(e) => addPhotos(e.target.files)}
          />
        </div>

        {photos.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-3">
            {photos.map((file, i) => (
              <PhotoPreview
                key={`${file.name}-${file.size}-${i}`}
                file={file}
                url={photoUrls[i] ?? ""}
                onRemove={() => removePhoto(i)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Documents */}
      <div>
        <h3 className="text-xl font-bold text-[var(--rcb-text-strong)]">
          {reg.documentsHeading}
        </h3>
        <p className="mt-1 text-sm text-[var(--rcb-text-muted)]">
          {reg.documentsDescription}
        </p>

        <button
          type="button"
          onClick={() => docInputRef.current?.click()}
          className="mt-4 cursor-pointer rounded-lg border border-[var(--rcb-border)] bg-[var(--rcb-bg)] px-4 py-2 text-sm font-medium text-[var(--rcb-text-strong)] transition-colors hover:bg-[var(--rcb-surface)]"
        >
          {reg.addDocumentButton}
        </button>
        <input
          ref={docInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,application/pdf"
          multiple
          className="hidden"
          onChange={(e) => addDocuments(e.target.files)}
        />

        {documents.length > 0 && (
          <ul className="mt-4 space-y-2">
            {documents.map((file, i) => (
              <li
                key={`${file.name}-${i}`}
                className="flex items-center justify-between rounded-lg border border-[var(--rcb-border)] bg-[var(--rcb-surface)] px-4 py-2 text-sm"
              >
                <span className="truncate text-[var(--rcb-text-body)]">
                  {file.name}
                </span>
                <button
                  type="button"
                  onClick={() => removeDocument(i)}
                  aria-label={`Supprimer ${file.name}`}
                  className="ml-3 cursor-pointer text-red-500 hover:text-red-700"
                >
                  &times;
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onBack}
          className="cursor-pointer text-sm font-medium text-[var(--rcb-text-muted)] transition-colors hover:text-[var(--rcb-primary)]"
        >
          &larr; {reg.backButton}
        </button>
        <Button onClick={onNext} className="cursor-pointer">
          {reg.continueButton}
        </Button>
      </div>
    </div>
  );
}
