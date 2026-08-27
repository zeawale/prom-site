export type LeadResult =
  | { ok: true }
  | { ok: false; error: string; fieldErrors?: Record<string, string> }