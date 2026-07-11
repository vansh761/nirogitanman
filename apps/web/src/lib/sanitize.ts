// Strips HTML tags and control characters from free-text user input before
// it's stored. This is defense-in-depth: React already escapes output by
// default (no dangerouslySetInnerHTML on user content anywhere in this
// codebase), but sanitizing on the way in means the raw stored data is also
// safe if it's ever exported, emailed, or rendered somewhere less careful.
export function sanitizeText(input: string): string {
  return input
    .replace(/<[^>]*>/g, "") // strip HTML tags
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "") // strip control chars
    .trim();
}
