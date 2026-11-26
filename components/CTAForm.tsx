"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { siteConfig } from "@/lib/config";
import {
  normalizeWebsite,
  validateField,
  validateForm,
  type FormField,
  type LeadFormData,
  type ValidationErrors,
} from "@/lib/validation";

const FORM_ROOT_CLASS = "consultation-form";
const FLODESK_FORM_ID = "6b07a630f7eb41a83ef6be4e";
const FLODESK_ROOT_CLASS = `ff-${FLODESK_FORM_ID}`;
const FLODESK_ACTION = `https://form.flodesk.com/forms/${FLODESK_FORM_ID}/submit`;
const FLODESK_CONFIG = "eyJ0cmlnZ2VyIjp7Im1vZGUiOiJpbW1lZGlhdGVseSIsInZhbHVlIjowfSwib25TdWNjZXNzIjp7Im1vZGUiOiJyZWRpcmVjdCIsIm1lc3NhZ2UiOiIiLCJyZWRpcmVjdFVybCI6Imh0dHBzOi8vZGlnaXRhbGdiLmdyb3duZXAuY29tL3RoYW5rLXlvdS8ifSwiY29pIjpmYWxzZSwic2hvd0ZvclJldHVyblZpc2l0b3JzIjp0cnVlLCJub3RpZmljYXRpb24iOmZhbHNlLCJnZHByIjp7ImFjY2VwdHNNYXJrZXRpbmciOmZhbHNlLCJwcml2YWN5UG9saWN5Ijp7ImVuYWJsZWQiOmZhbHNlLCJtYW5kYXRvcnkiOmZhbHNlfX0sInRyYWNraW5nQ29uZmlnIjp7Im1ldGFQaXhlbElkIjoiIiwiY29va2llQmFubmVyRW5hYmxlZCI6ZmFsc2UsImdvb2dsZUFuYWx5dGljc0lkIjoiIn19";

const FLODESK_FIELD_IDS = {
  fullName: `${FLODESK_ROOT_CLASS}-firstName`,
  email: `${FLODESK_ROOT_CLASS}-email`,
  whatsapp: `${FLODESK_ROOT_CLASS}-dI54OlXoKs`,
  website: `${FLODESK_ROOT_CLASS}-LYUOlXNi74`,
  businessName: `${FLODESK_ROOT_CLASS}-7nPPrJOgbs`,
  message: `${FLODESK_ROOT_CLASS}-xROqsEG5Wt`,
} as const;

const FLODESK_FIELD_NAMES = {
  whatsapp: "fields.whatsappNumber",
  businessName: "fields.businessName",
  website: "fields.websiteOrFacebookLink",
  message: "fields.anythingYouSay",
} as const;

type FlodeskWindow = Window & {
  fd?: ((...args: unknown[]) => void) & { q?: unknown[][] };
};

const initialValues: LeadFormData = {
  fullName: "",
  email: "",
  whatsapp: "",
  businessName: "",
  website: "",
  message: "",
  companyWebsite: "",
};

type TextInputProps = {
  id: Exclude<FormField, "message" | "companyWebsite">;
  htmlId: string;
  name: string;
  label: string;
  placeholder: string;
  value: string;
  error?: string;
  type?: "text" | "email" | "tel" | "url";
  autoComplete: string;
  required?: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onBlur: () => void;
};

function TextInput({
  id,
  htmlId,
  name,
  label,
  placeholder,
  value,
  error,
  type = "text",
  autoComplete,
  required = false,
  onChange,
  onBlur,
}: TextInputProps) {
  const errorId = `${id}-error`;
  return (
    <div>
      <label htmlFor={htmlId} className="mb-2 block text-sm font-bold text-foreground">
        {label}{required ? <span className="ml-1 text-error" aria-hidden="true">*</span> : null}
      </label>
      <input
        id={htmlId}
        data-form-field={id}
        name={name}
        type={type}
        value={value}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required={required}
        className={`${FORM_ROOT_CLASS}__control form-control`}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        onChange={onChange}
        onBlur={onBlur}
      />
      {error ? <p id={errorId} role="alert" className="mt-1.5 text-sm font-medium text-error">{error}</p> : null}
    </div>
  );
}

function ShieldIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 3 5 6v5c0 4.6 2.8 8 7 10 4.2-2 7-5.4 7-10V6l-7-3Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="m9 12 2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function CTAForm() {
  const router = useRouter();
  const { form } = siteConfig;
  const [values, setValues] = useState<LeadFormData>(initialValues);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const formRootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const flodeskWindow = window as FlodeskWindow;
    if (!flodeskWindow.fd) {
      const queuedFd = ((...args: unknown[]) => {
        queuedFd.q = queuedFd.q || [];
        queuedFd.q.push(args);
      }) as NonNullable<FlodeskWindow["fd"]>;
      queuedFd.q = [];
      flodeskWindow.fd = queuedFd;
    }

    const addScript = (id: string, src: string, options?: { type?: string; noModule?: boolean }) => {
      if (document.getElementById(id)) return;
      const script = document.createElement("script");
      script.id = id;
      script.src = src;
      script.async = true;
      if (options?.type) script.type = options.type;
      if (options?.noModule) script.noModule = true;
      document.head.appendChild(script);
    };

    addScript("flodesk-universal-module", "https://assets.flodesk.com/universal.mjs", { type: "module" });
    addScript("flodesk-universal-fallback", "https://assets.flodesk.com/universal.js", { noModule: true });
    flodeskWindow.fd?.("form:handle", {
      formId: FLODESK_FORM_ID,
      rootEl: `.${FLODESK_ROOT_CLASS}`,
    });

    const root = formRootRef.current;
    if (!root) return;
    const observer = new MutationObserver(() => {
      const stage = root.dataset.ffStage;
      if (stage === "success") {
        router.push("/thank-you/");
      } else if (stage === "error") {
        setIsSubmitting(false);
        setSubmitError(form.generalError);
      }
    });
    observer.observe(root, { attributes: true, attributeFilter: ["data-ff-stage"] });
    return () => observer.disconnect();
  }, [form.generalError, router]);

  const changeValue =
    (field: FormField) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = event.target.value;
      setValues((current) => ({ ...current, [field]: value }));
      if (errors[field]) {
        const error = validateField(field, value);
        setErrors((current) => ({ ...current, [field]: error }));
      }
    };

  const blurField = (field: FormField) => () => {
    const value = field === "website" ? normalizeWebsite(values.website) : values[field];
    if (field === "website" && value !== values.website) {
      setValues((current) => ({ ...current, website: value }));
    }
    const error = validateField(field, value);
    setErrors((current) => ({ ...current, [field]: error }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    setSubmitError("");

    const normalizedValues = {
      ...values,
      website: normalizeWebsite(values.website),
    };
    setValues(normalizedValues);
    const nextErrors = validateForm(normalizedValues);
    setErrors(nextErrors);

    const firstInvalidField = (Object.keys(nextErrors) as FormField[])[0];
    if (firstInvalidField) {
      event.preventDefault();
      event.stopPropagation();
      window.requestAnimationFrame(() => {
        document.querySelector<HTMLElement>(`[data-form-field="${firstInvalidField}"]`)?.focus();
      });
      return;
    }

    if (normalizedValues.companyWebsite) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    setIsSubmitting(true);
  };

  return (
    <section id="book" className="relative overflow-hidden bg-soft-background py-14 sm:py-20" aria-labelledby="form-title">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-52 bg-[radial-gradient(circle_at_top,rgba(24,237,138,.16),transparent_70%)]" aria-hidden="true" />
      <div className="section-shell relative">
        <div
          ref={formRootRef}
          className={`${FLODESK_ROOT_CLASS} ${FORM_ROOT_CLASS} mx-auto max-w-xl rounded-[1.75rem] border border-border bg-[linear-gradient(145deg,rgba(255,255,255,.98),rgba(239,255,247,.96))] p-5 shadow-[0_24px_70px_rgba(6,60,45,.12)] sm:p-8`}
          data-ff-el="root"
          data-ff-version="3"
          data-ff-type="inline"
          data-ff-name="inlineNoImage"
          data-ff-stage="default"
        >
          <div data-ff-el="config" data-ff-config={FLODESK_CONFIG} className="hidden" />
          <h2 id="form-title" className="text-balance text-center text-3xl font-extrabold tracking-[-0.035em] text-foreground sm:text-4xl">
            {form.title}
          </h2>

          <div className="mt-5 flex flex-wrap justify-center gap-2" aria-label="Consultation details">
            {form.chips.map((chip) => (
              <span key={chip} className="rounded-full border border-border bg-brand-soft/65 px-3 py-1.5 text-xs font-bold text-deep-green sm:text-sm">
                {chip}
              </span>
            ))}
          </div>

          <form
            className="mt-8"
            action={FLODESK_ACTION}
            method="post"
            data-ff-el="form"
            noValidate
            onSubmitCapture={handleSubmit}
          >
            <div data-ff-el="content">
            <div data-ff-el="fields" className="space-y-5">
            <TextInput
              id="fullName"
              htmlId={FLODESK_FIELD_IDS.fullName}
              name="firstName"
              label={form.fields.fullName.label}
              placeholder={form.fields.fullName.placeholder}
              value={values.fullName}
              error={errors.fullName}
              autoComplete="name"
              required
              onChange={changeValue("fullName")}
              onBlur={blurField("fullName")}
            />
            <TextInput
              id="email"
              htmlId={FLODESK_FIELD_IDS.email}
              name="email"
              label={form.fields.email.label}
              placeholder={form.fields.email.placeholder}
              value={values.email}
              error={errors.email}
              type="email"
              autoComplete="email"
              required
              onChange={changeValue("email")}
              onBlur={blurField("email")}
            />
            <TextInput
              id="whatsapp"
              htmlId={FLODESK_FIELD_IDS.whatsapp}
              name={FLODESK_FIELD_NAMES.whatsapp}
              label={form.fields.whatsapp.label}
              placeholder={form.fields.whatsapp.placeholder}
              value={values.whatsapp}
              error={errors.whatsapp}
              type="tel"
              autoComplete="tel"
              required
              onChange={changeValue("whatsapp")}
              onBlur={blurField("whatsapp")}
            />
            <TextInput
              id="businessName"
              htmlId={FLODESK_FIELD_IDS.businessName}
              name={FLODESK_FIELD_NAMES.businessName}
              label={form.fields.businessName.label}
              placeholder={form.fields.businessName.placeholder}
              value={values.businessName}
              error={errors.businessName}
              autoComplete="organization"
              required
              onChange={changeValue("businessName")}
              onBlur={blurField("businessName")}
            />
            <TextInput
              id="website"
              htmlId={FLODESK_FIELD_IDS.website}
              name={FLODESK_FIELD_NAMES.website}
              label={form.fields.website.label}
              placeholder={form.fields.website.placeholder}
              value={values.website}
              error={errors.website}
              type="url"
              autoComplete="url"
              onChange={changeValue("website")}
              onBlur={blurField("website")}
            />
            <div>
              <label htmlFor={FLODESK_FIELD_IDS.message} className="mb-2 block text-sm font-bold text-foreground">{form.fields.message.label}</label>
              <textarea
                id={FLODESK_FIELD_IDS.message}
                data-form-field="message"
                name={FLODESK_FIELD_NAMES.message}
                rows={4}
                maxLength={255}
                value={values.message}
                placeholder={form.fields.message.placeholder}
                className={`${FORM_ROOT_CLASS}__control form-control min-h-32 resize-y`}
                aria-invalid={Boolean(errors.message)}
                aria-describedby={errors.message ? "message-error" : undefined}
                onChange={changeValue("message")}
                onBlur={blurField("message")}
              />
              {errors.message ? <p id="message-error" role="alert" className="mt-1.5 text-sm font-medium text-error">{errors.message}</p> : null}
            </div>

            <div className="absolute left-[-10000px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
              <label htmlFor="companyWebsite">Company website</label>
              <input
                id="companyWebsite"
                name="confirm_email_address"
                type="text"
                value={values.companyWebsite}
                tabIndex={-1}
                autoComplete="off"
                onChange={changeValue("companyWebsite")}
              />
            </div>

            {submitError ? (
              <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-error">
                {submitError}
              </div>
            ) : null}

            <button
              type="submit"
              data-ff-el="submit"
              disabled={isSubmitting}
              className="flex min-h-13 w-full items-center justify-center rounded-full bg-primary px-6 py-3.5 text-base font-bold text-white shadow-[0_14px_30px_rgba(8,122,87,.24)] transition hover:-translate-y-0.5 hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-65 disabled:hover:translate-y-0"
            >
              {isSubmitting ? form.submitting : form.submit}
            </button>

            <p className="flex items-center justify-center gap-1.5 text-center text-sm font-medium text-muted">
              <ShieldIcon /> {form.trust}
            </p>
            </div>
            </div>
            <div data-ff-el="success" className="hidden" aria-live="polite" />
            <div data-ff-el="error" className="hidden" aria-live="assertive" />
          </form>
        </div>
      </div>
    </section>
  );
}
