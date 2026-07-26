import { IsMatchingConstraint } from './matching.validator';

describe('IsMatchingConstraint', () => {
  const validator = new IsMatchingConstraint();

  describe('validate', () => {
    it('should return true when values match', () => {
      const args = {
        constraints: ['password'],
        object: { password: 'test123', confirmPassword: 'test123' },
        property: 'confirmPassword',
      };

      expect(validator.validate('test123', args)).toBe(true);
    });

    it('should return false when values do not match', () => {
      const args = {
        constraints: ['password'],
        object: { password: 'test123', confirmPassword: 'different' },
        property: 'confirmPassword',
      };

      expect(validator.validate('different', args)).toBe(false);
    });

    it('should return true when both are empty', () => {
      const args = {
        constraints: ['password'],
        object: { password: '', confirmPassword: '' },
        property: 'confirmPassword',
      };

      expect(validator.validate('', args)).toBe(true);
    });
  });

  describe('defaultMessage', () => {
    it('should return message referencing the related property', () => {
      const args = {
        constraints: ['password'],
        property: 'confirmPassword',
      };

      const message = validator.defaultMessage(args);
      expect(message).toBe('password and confirmPassword must match');
    });
  });
});
