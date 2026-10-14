import { useEffect, useState } from "react";
import { getMessage } from "@/services/api";
import { createUserRequest, deleteUserRequest, listUsersRequest, updateUserRequest, type UserWriteValues } from "@/services/usersService";
import type { Notice } from "@/types/notice";
import type { User } from "@/types/user";

// lista de usuarios del panel admin + sus operaciones
export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [notice, setNotice] = useState<Notice | null>(null);

  async function load(term = search): Promise<void> {
    try {
      setUsers(await listUsersRequest(term));
    } catch (error) {
      setNotice({ error: true, text: getMessage(error) });
    }
  }

  useEffect(() => {
    load("");
  }, []);

  // devuelve "" si salió bien, o el mensaje de error para mostrarlo en el modal
  async function saveUser(values: UserWriteValues, id?: number): Promise<string> {
    try {
      if (id) await updateUserRequest({ ...values, id });
      else await createUserRequest(values);
      setNotice({ text: id ? "Usuario actualizado." : "Usuario creado correctamente." });
      await load();
      return "";
    } catch (error) {
      return getMessage(error);
    }
  }

  async function deleteUser(id: number): Promise<void> {
    try {
      await deleteUserRequest(id);
      setNotice({ text: "Usuario eliminado." });
      await load();
    } catch (error) {
      setNotice({ error: true, text: getMessage(error) });
    }
  }

  return { users, search, setSearch, load, notice, saveUser, deleteUser };
}
