export class UpdatePassword {
    userId: string;
    resetToken: string;
    password: string;
    passwordConfirm: string;
}
export class UpdateCurrentPassword {
    email: string;
    currentPassword: string;
    password: string;
    passwordConfirm: string;
}
