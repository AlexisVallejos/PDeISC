// "Ana Pérez" -> "AP"
export function initials(name = ""): string {
  const letters = name.trim().split(/\s+/).slice(0, 2).map((word) => word[0]);
  return letters.join("").toUpperCase() || "?";
}
