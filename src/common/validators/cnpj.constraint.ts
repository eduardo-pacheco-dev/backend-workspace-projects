import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationOptions,
  registerDecorator,
} from 'class-validator';

@ValidatorConstraint({ name: 'Cnpj', async: false })
export class CnpjConstraint implements ValidatorConstraintInterface {
  validate(value: any): boolean {
    if (typeof value !== 'string') return false;

    const sanitized = value.replace(/[^0-9A-Za-z]/g, '').toUpperCase();

    if (sanitized.length !== 14) return false;

    const rootOrd = sanitized.slice(0, 12);
    const dv = sanitized.slice(12, 14);

    if (!/^[0-9A-Z]{12}$/.test(rootOrd)) return false;
    if (!/^\d{2}$/.test(dv)) return false;

    const asciiValues = rootOrd.split('').map((ch) => ch.charCodeAt(0) - 48);

    const weightsDv1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    const weightsDv2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

    const sumDv1 = asciiValues.reduce(
      (acc, val, idx) => acc + val * weightsDv1[idx],
      0,
    );
    const remainderDv1 = sumDv1 % 11;
    const expectedDv1 = remainderDv1 < 2 ? 0 : 11 - remainderDv1;

    const asciiDv1 = parseInt(dv[0], 10);
    if (asciiDv1 !== expectedDv1) return false;

    const asciiValuesWithDv1 = [...asciiValues, asciiDv1];
    const sumDv2 = asciiValuesWithDv1.reduce(
      (acc, val, idx) => acc + val * weightsDv2[idx],
      0,
    );
    const remainderDv2 = sumDv2 % 11;
    const expectedDv2 = remainderDv2 < 2 ? 0 : 11 - remainderDv2;

    const asciiDv2 = parseInt(dv[1], 10);
    return asciiDv2 === expectedDv2;
  }

  defaultMessage(): string {
    return 'Invalid CNPJ';
  }
}

export function IsCnpj(validationOptions?: ValidationOptions) {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      name: 'IsCnpj',
      target: object.constructor,
      propertyName,
      constraints: [],
      options: validationOptions,
      validator: CnpjConstraint,
    });
  };
}
