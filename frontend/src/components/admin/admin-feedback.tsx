"use client";

import type { MouseEvent, ReactNode } from "react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useFormStatus } from "react-dom";
import { AlertTriangle, CheckCircle2, Info, Loader2, X, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastType = "success" | "error" | "info" | "warning";

type ToastInput = {
  type?: ToastType;
  title: string;
  description?: string;
  duration?: number;
};

type ToastItem = ToastInput & {
  id: string;
  type: ToastType;
};

type AdminFeedbackContextValue = {
  notify: (toast: ToastInput) => string;
  dismiss: (id: string) => void;
};

type ServerAction = (formData: FormData) => Promise<void> | void;

const AdminFeedbackContext = createContext<AdminFeedbackContextValue | null>(null);

function serializeForm(form: HTMLFormElement) {
  return JSON.stringify(
    Array.from(new FormData(form).entries()).map(([key, entry]) => {
      if (typeof File !== "undefined" && entry instanceof File) {
        return [key, `${entry.name}:${entry.size}:${entry.lastModified}`];
      }

      return [key, String(entry)];
    })
  );
}

function toastIcon(type: ToastType) {
  if (type === "success") return CheckCircle2;
  if (type === "error") return XCircle;
  if (type === "warning") return AlertTriangle;
  return Info;
}

function toastClassName(type: ToastType) {
  if (type === "success") return "border-emerald-200 bg-emerald-50 text-emerald-900";
  if (type === "error") return "border-red-200 bg-red-50 text-red-900";
  if (type === "warning") return "border-amber-200 bg-amber-50 text-amber-950";
  return "border-border bg-background text-foreground";
}

export function AdminFeedbackProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timersRef = useRef(new Map<string, ReturnType<typeof setTimeout>>());

  const dismiss = useCallback((id: string) => {
    const timer = timersRef.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timersRef.current.delete(id);
    }

    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const notify = useCallback(
    (toast: ToastInput) => {
      const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
      const item: ToastItem = {
        ...toast,
        id,
        type: toast.type ?? "info",
      };

      setToasts((current) => [item, ...current].slice(0, 4));

      const timer = setTimeout(() => dismiss(id), toast.duration ?? 4200);
      timersRef.current.set(id, timer);

      return id;
    },
    [dismiss]
  );

  useEffect(
    () => () => {
      timersRef.current.forEach((timer) => clearTimeout(timer));
      timersRef.current.clear();
    },
    []
  );

  const value = useMemo(() => ({ notify, dismiss }), [dismiss, notify]);

  return (
    <AdminFeedbackContext.Provider value={value}>
      {children}
      <div className="fixed right-4 top-4 z-[80] flex w-[min(24rem,calc(100vw-2rem))] flex-col gap-3">
        {toasts.map((toast) => {
          const Icon = toastIcon(toast.type);

          return (
            <div
              key={toast.id}
              role="status"
              className={cn(
                "rounded-lg border p-4 shadow-lg backdrop-blur",
                toastClassName(toast.type)
              )}
            >
              <div className="flex items-start gap-3">
                <Icon className="mt-0.5 h-5 w-5 shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-black">{toast.title}</p>
                  {toast.description ? (
                    <p className="mt-1 text-xs font-medium leading-relaxed opacity-80">
                      {toast.description}
                    </p>
                  ) : null}
                </div>
                <button
                  type="button"
                  onClick={() => dismiss(toast.id)}
                  className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md transition-colors hover:bg-black/5"
                  title="Bildirimi kapat"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </AdminFeedbackContext.Provider>
  );
}

export function useAdminToast() {
  const context = useContext(AdminFeedbackContext);

  if (!context) {
    throw new Error("useAdminToast must be used inside AdminFeedbackProvider");
  }

  return context;
}

export function useUnsavedChangesWarning(enabled: boolean, message = "Kaydedilmemiş değişiklikler var.") {
  useEffect(() => {
    if (!enabled) return;

    function handleBeforeUnload(event: BeforeUnloadEvent) {
      event.preventDefault();
      event.returnValue = message;
      return message;
    }

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [enabled, message]);
}

function ActionFormStatusBridge({ onPendingChange }: { onPendingChange: (pending: boolean) => void }) {
  const { pending } = useFormStatus();

  useEffect(() => {
    onPendingChange(pending);
  }, [onPendingChange, pending]);

  return null;
}

export function AdminActionForm({
  action,
  children,
  className,
  successMessage = "İşlem başarıyla tamamlandı.",
  successDescription,
  trackDirty = false,
  unsavedMessage = "Kaydedilmemiş değişiklikler var.",
}: {
  action: ServerAction;
  children: ReactNode;
  className?: string;
  successMessage?: string;
  successDescription?: string;
  trackDirty?: boolean;
  unsavedMessage?: string;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const initialSnapshotRef = useRef("");
  const submittedRef = useRef(false);
  const wasPendingRef = useRef(false);
  const [pending, setPending] = useState(false);
  const [dirty, setDirty] = useState(false);
  const { notify } = useAdminToast();

  const updateSnapshot = useCallback(() => {
    if (!formRef.current) return;
    initialSnapshotRef.current = serializeForm(formRef.current);
  }, []);

  const checkDirty = useCallback(() => {
    if (!trackDirty || !formRef.current || !initialSnapshotRef.current) return;
    setDirty(serializeForm(formRef.current) !== initialSnapshotRef.current);
  }, [trackDirty]);

  useEffect(() => {
    if (trackDirty) updateSnapshot();
  }, [trackDirty, updateSnapshot]);

  useUnsavedChangesWarning(trackDirty && dirty && !pending, unsavedMessage);

  useEffect(() => {
    if (pending) {
      wasPendingRef.current = true;
      return;
    }

    if (wasPendingRef.current && submittedRef.current) {
      if (trackDirty) {
        updateSnapshot();
        setDirty(false);
      }

      notify({
        type: "success",
        title: successMessage,
        description: successDescription,
      });
    }

    wasPendingRef.current = false;
    submittedRef.current = false;
  }, [notify, pending, successDescription, successMessage, trackDirty, updateSnapshot]);

  function handleChange() {
    if (!trackDirty) return;
    window.setTimeout(checkDirty, 0);
  }

  return (
    <form
      ref={formRef}
      action={action}
      className={className}
      onSubmitCapture={() => {
        submittedRef.current = true;
      }}
      onInputCapture={handleChange}
      onChangeCapture={handleChange}
    >
      <ActionFormStatusBridge onPendingChange={setPending} />
      {children}
    </form>
  );
}

export function AdminSubmitButton({
  children,
  pendingChildren = "İşleniyor",
  className,
}: {
  children: ReactNode;
  pendingChildren?: ReactNode;
  className?: string;
}) {
  const { pending } = useFormStatus();

  return (
    <button
      disabled={pending}
      className={cn(
        "inline-flex h-10 items-center justify-center gap-2 rounded-md bg-macework px-5 text-sm font-black text-white transition-colors hover:bg-macework-hover disabled:cursor-not-allowed disabled:opacity-60",
        className
      )}
    >
      {pending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          {pendingChildren}
        </>
      ) : (
        children
      )}
    </button>
  );
}

export function ConfirmSubmitButton({
  children,
  pendingChildren = "İşleniyor",
  title,
  description,
  confirmLabel = "Onayla",
  cancelLabel = "Vazgeç",
  className,
  name,
  value,
  formAction,
  formNoValidate,
}: {
  children: ReactNode;
  pendingChildren?: ReactNode;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  className?: string;
  name?: string;
  value?: string;
  formAction?: string | ServerAction;
  formNoValidate?: boolean;
}) {
  const { data, pending } = useFormStatus();
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const confirmedRef = useRef(false);
  const isThisPending =
    pending && (!name || value === undefined || String(data?.get(name) ?? "") === value);

  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    if (confirmedRef.current) return;

    event.preventDefault();
    setOpen(true);
  }

  function handleConfirm() {
    confirmedRef.current = true;
    setOpen(false);

    window.requestAnimationFrame(() => {
      buttonRef.current?.click();
      window.setTimeout(() => {
        confirmedRef.current = false;
      }, 0);
    });
  }

  return (
    <>
      <button
        ref={buttonRef}
        type="submit"
        name={name}
        value={value}
        formAction={formAction}
        formNoValidate={formNoValidate}
        disabled={pending}
        onClick={handleClick}
        className={cn(
          "inline-flex h-10 items-center justify-center gap-2 rounded-md border border-red-200 bg-background px-4 text-sm font-black text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60",
          className
        )}
      >
        {isThisPending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            {pendingChildren}
          </>
        ) : (
          children
        )}
      </button>

      {open ? (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/45 px-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="admin-confirm-title"
            className="w-full max-w-md rounded-lg border border-border bg-background p-5 shadow-xl"
          >
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-red-50 text-red-600">
                <AlertTriangle className="h-5 w-5" />
              </span>
              <div>
                <h2 id="admin-confirm-title" className="text-lg font-black">
                  {title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {description}
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap justify-end gap-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="h-10 rounded-md border border-border bg-background px-4 text-sm font-black transition-colors hover:bg-muted"
              >
                {cancelLabel}
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                className="h-10 rounded-md bg-red-600 px-4 text-sm font-black text-white transition-colors hover:bg-red-700"
              >
                {confirmLabel}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
