// fecha en formato DD/MM/AA (por ejemplo 21/09/26)
export function formatDate(value?: string | number | Date | null): string {
  const date = value ? new Date(value) : null;
  if (!date || Number.isNaN(date.getTime())) return "";

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = String(date.getFullYear()).slice(-2);
  return `${day}/${month}/${year}`;
}
