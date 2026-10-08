export type ContactSubmission = {
  name: string;
  email: string;
  organisation: string;
  role: string;
  institutionType: string;
  useCase: string;
  timeframe: string;
  message: string;
};

function isValidEmail(email: string): boolean {
  // Bound user-controlled input before validation to avoid costly processing.
  if (email.length === 0 || email.length > 254) {
    return false;
  }

  const at = email.indexOf("@");
  const dot = email.lastIndexOf(".");
  return (
    at > 0 &&
    at === email.lastIndexOf("@") &&
    dot > at + 1 &&
    dot < email.length - 1 &&
    !/\s/u.test(email)
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function optionalString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export function isHoneypotSubmission(value: unknown): boolean {
  return isRecord(value) && optionalString(value.website).length > 0;
}

export function parseContactSubmission(
  value: unknown,
): ContactSubmission | null {
  if (!isRecord(value)) {
    return null;
  }

  const submission: ContactSubmission = {
    name: optionalString(value.name),
    email: optionalString(value.email),
    organisation: optionalString(value.organisation),
    role: optionalString(value.role),
    institutionType: optionalString(value.institutionType),
    useCase: optionalString(value.useCase),
    timeframe: optionalString(value.timeframe),
    message: optionalString(value.message),
  };

  if (
    submission.name.length < 2 ||
    !isValidEmail(submission.email) ||
    submission.organisation.length < 2 ||
    submission.message.length < 10
  ) {
    return null;
  }

  return submission;
}
