export interface AuthResponse {
  idToken: string;
  localId: string;
  email: string;
  expiresIn: string;
  isLockedOut: boolean;
  isNotAllowed: boolean;
  requiresTwoFactor: boolean;
  succeeded: boolean;
}
