export type LeadFormData = {
  fullName: string;
  email: string;
  whatsapp: string;
  businessName: string;
  website: string;
  message: string;
  companyWebsite: string;
};

export type FormField = keyof LeadFormData;
export type ValidationErrors = Partial<Record<FormField, string>>;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function normalizeWebsite(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return "";
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

export function validateField(
  field: FormField,
  rawValue: string,
): string | undefined {
  const value = rawValue.trim();

  switch (field) {
    case "fullName":
      return value ? undefined : "Please enter your full name.";
    case "email":
      if (!value) return "Please enter your active email.";
      return emailPattern.test(value)
        ? undefined
        : "Please enter a valid email address.";
    case "whatsapp": {
      if (!value) return "Please enter your WhatsApp number.";
      if (!/^\+?[\d\s]+$/.test(value)) {
        return "Use digits, spaces, and an optional leading + only.";
      }
      const digits = value.replace(/\D/g, "");
      return digits.length >= 7 && digits.length <= 15
        ? undefined
        : "WhatsApp number must contain 7 to 15 digits.";
    }
    case "businessName":
      return value ? undefined : "Please enter your business name.";
    case "website": {
      if (!value) return undefined;
      try {
        const url = new URL(normalizeWebsite(value));
        return url.hostname.includes(".")
          ? undefined
          : "Please enter a valid website or Facebook URL.";
      } catch {
        return "Please enter a valid website or Facebook URL.";
      }
    }
    case "message":
      return rawValue.length <= 255
        ? undefined
        : "Please keep your message under 255 characters.";
    case "companyWebsite":
      return undefined;
  }
}

export function validateForm(values: LeadFormData): ValidationErrors {
  const errors: ValidationErrors = {};
  (Object.keys(values) as FormField[]).forEach((field) => {
    const error = validateField(field, values[field]);
    if (error) errors[field] = error;
  });
  return errors;
}
