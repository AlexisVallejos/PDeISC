import type { Notice as NoticeValue } from "@/types/notice";

// mensaje de éxito o error que queda a la vista
export function Notice({ notice }: { notice: NoticeValue | null }) {
  if (!notice) return null;
  return (
    <p className={notice.error ? "notice notice-error" : "notice"} role={notice.error ? "alert" : "status"}>
      {notice.text}
    </p>
  );
}
