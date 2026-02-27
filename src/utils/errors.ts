import { isAxiosError } from "axios";

/**
 * Extrait un message d'erreur lisible depuis une erreur Axios ou inconnue.
 * Utilisé par tous les services (auth, tweets, …).
 */
export function extractErrorMessage(
  err: unknown,
  fallback = "Une erreur est survenue"
): string {
  if (isAxiosError(err)) {
    return err.response?.data?.error ?? fallback;
  }
  return fallback;
}
