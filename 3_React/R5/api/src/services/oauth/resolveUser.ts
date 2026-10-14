import { OAuthError } from "../../oauth/oauthError.js";
import { cleanProviderName } from "../../utils/providerName.js";
import { normalizeEmail, validateEmail } from "../../validators/emailValidator.js";
import { createUser } from "../users/createUser.js";
import { findByEmail, findById } from "../users/findUser.js";
import { findByIdentity, linkIdentity } from "../users/identities.js";
import type { OAuthProfile, OAuthProvider } from "../../types/oauth.js";
import type { PublicUser } from "../../types/user.js";

// devuelve el usuario de esa cuenta de red: lo busca, lo vincula por correo o lo crea
export async function resolveOAuthUser(provider: OAuthProvider, profile: OAuthProfile): Promise<PublicUser> {
  const known = await findByIdentity(provider.name, profile.uid);
  if (known) return known;

  const email = normalizeEmail(profile.email);
  if (!profile.emailVerified || validateEmail(email)) {
    throw new OAuthError(400, `${provider.label} no nos compartió un correo verificado. Usá otra opción para ingresar.`);
  }

  // si el correo ya tiene cuenta se vincula; si no, se crea una nueva (siempre con rol "usuario")
  const existing = await findByEmail(email);
  const user = existing || (await createUser({ nombre: cleanProviderName(profile.nombre, email), email }));
  if (!user) throw new OAuthError(500, "No se pudo crear el usuario.");
  await linkIdentity(user.id, provider.name, profile.uid);
  const refreshed = await findById(user.id);
  if (!refreshed) throw new OAuthError(500, "No se pudo crear el usuario.");
  return refreshed;
}
