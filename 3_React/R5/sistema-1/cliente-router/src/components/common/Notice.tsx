import { CheckCircle2Icon } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { Notice as NoticeValue } from "@/types/notice";

interface NoticeProps {
  notice: NoticeValue | null;
  className?: string;
}

// aviso de éxito o error ({ text, error })
export function Notice({ notice, className }: NoticeProps) {
  if (!notice) return null;

  return (
    <Alert className={className} variant={notice.error ? "destructive" : "default"} role="status">
      {!notice.error && <CheckCircle2Icon />}
      <AlertDescription>{notice.text}</AlertDescription>
    </Alert>
  );
}
