export class User {
  constructor(public accessToken: string, public expiration: number, public refreshToken: string, public userEmail: string = null) { }
  get token() {
    if (!this.expiration || Date.parse(new Date().toString()) > this.expiration) {
      return null
    }
    return this.accessToken
  }
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  PasswordConfirm: string;
}
