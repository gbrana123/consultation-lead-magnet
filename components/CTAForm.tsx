"use client";

import { useRouter } from "next/navigation";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { siteConfig } from "@/lib/config";
import { submitLead } from "@/lib/submitLead";
import {
  normalizeWebsite,
  validateField,
  validateForm,
  type FormField,
  type LeadFormData,
  type ValidationErrors,
} from "@/lib/validation";

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
      <label htmlFor={id} className="mb-2 block text-sm font-bold text-foreground">
        {label}{required ? <span className="ml-1 text-error" aria-hidden="true">*</span> : null}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required={required}
        className="form-control"
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

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
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
      window.requestAnimationFrame(() => {
        document.getElementById(firstInvalidField)?.focus();
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await submitLead(normalizedValues);
      router.push("/thank-you");
    } catch {
      setSubmitError(form.generalError);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="book" className="relative overflow-hidden bg-soft-background py-14 sm:py-20" aria-labelledby="form-title">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-52 bg-[radial-gradient(circle_at_top,rgba(24,237,138,.16),transparent_70%)]" aria-hidden="true" />
      <div className="section-shell relative">
        <div className="mx-auto max-w-xl rounded-[1.75rem] border border-border bg-[linear-gradient(145deg,rgba(255,255,255,.98),rgba(239,255,247,.96))] p-5 shadow-[0_24px_70px_rgba(6,60,45,.12)] sm:p-8">
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

          <form className="mt-8 space-y-5" noValidate onSubmit={handleSubmit}>
            <TextInput
              id="fullName"
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
              <label htmlFor="message" className="mb-2 block text-sm font-bold text-foreground">{form.fields.message.label}</label>
              <textarea
                id="message"
                name="message"
                rows={4}
                maxLength={500}
                value={values.message}
                placeholder={form.fields.message.placeholder}
                className="form-control min-h-32 resize-y"
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
                name="companyWebsite"
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
              disabled={isSubmitting}
              className="flex min-h-13 w-full items-center justify-center rounded-full bg-primary px-6 py-3.5 text-base font-bold text-white shadow-[0_14px_30px_rgba(8,122,87,.24)] transition hover:-translate-y-0.5 hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-65 disabled:hover:translate-y-0"
            >
              {isSubmitting ? form.submitting : form.submit}
            </button>

            <p className="flex items-center justify-center gap-1.5 text-center text-sm font-medium text-muted">
              <ShieldIcon /> {form.trust}
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
