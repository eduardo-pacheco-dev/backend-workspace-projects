import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationOptions,
  registerDecorator,
} from 'class-validator';

@ValidatorConstraint({ name: 'IsSecurePassword', async: false })
export class IsSecurePasswordConstraint implements ValidatorConstraintInterface {
  validate(value: any): boolean {
    if (typeof value !== 'string') return false;

    const hasMinLength = value.length >= 8;
    const hasUppercase = /[A-Z]/.test(value);
    const hasLowercase = /[a-z]/.test(value);
    const hasNumber = /[0-9]/.test(value);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);

    return hasMinLength && hasUppercase && hasLowercase && hasNumber && hasSpecialChar;
  }

  defaultMessage(): string {
    return 'Password must contain at least 8 characters, including uppercase, lowercase, number, and special character';
  }
}

export function IsSecurePassword(validationOptions?: ValidationOptions) {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      name: 'IsSecurePassword',
      target: object.constructor,
      propertyName,
      constraints: [],
      options: validationOptions,
      validator: IsSecurePasswordConstraint,
    });
  };
}
