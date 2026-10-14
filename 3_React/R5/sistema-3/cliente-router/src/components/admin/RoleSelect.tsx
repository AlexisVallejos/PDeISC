import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Rol } from "@/types/user";

interface RoleSelectProps {
  id: string;
  value: Rol;
  onChange: (value: Rol) => void;
}

export function RoleSelect({ id, value, onChange }: RoleSelectProps) {
  return (
    <Select value={value} onValueChange={(value) => onChange(value as Rol)}>
      <SelectTrigger id={id} className="w-full"><SelectValue /></SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="usuario">Usuario</SelectItem>
          <SelectItem value="administrador">Administrador</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
