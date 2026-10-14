import type { FormEvent } from "react";
import { Search } from "lucide-react";

interface UserSearchProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
}

export function UserSearch({ value, onChange, onSearch }: UserSearchProps) {
  function submit(event: FormEvent) {
    event.preventDefault();
    onSearch();
  }

  return <form className="atelier-search" onSubmit={submit} role="search"><Search size={23} aria-hidden="true" /><input value={value} onChange={(event) => onChange(event.target.value)} placeholder="Buscar usuario..." maxLength={100} aria-label="Buscar usuarios" /><button type="submit" aria-label="Buscar">Buscar</button></form>;
}
