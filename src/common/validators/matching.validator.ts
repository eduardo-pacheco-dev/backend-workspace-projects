import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationOptions,
  registerDecorator,
} from 'class-validator';

@ValidatorConstraint({ name: 'IsMatching', async: false })
export class IsMatchingConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: any): boolean {
    const [relatedPropertyName] = args.constraints;
    const relatedValue = args.object[relatedPropertyName];
    return value === relatedValue;
  }

  defaultMessage(args: any): string {
    const [relatedPropertyName] = args.constraints;
    return `${relatedPropertyName} and ${args.property} must match`;
  }
}

export function IsMatching(
  relatedPropertyName: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      name: 'IsMatching',
      target: object.constructor,
      propertyName,
      constraints: [relatedPropertyName],
      options: validationOptions,
      validator: IsMatchingConstraint,
    });
  };
}
