import { IsSecurePasswordConstraint } from './password.validator';

describe('IsSecurePasswordConstraint', () => {
  const validator = new IsSecurePasswordConstraint();

  describe('validate', () => {
    it('should return false for non-string', () => {
      expect(validator.validate(123 as any)).toBe(false);
    });

    it('should return false for short password', () => {
      expect(validator.validate('Ab1!')).toBe(false);
    });

    it('should return false when missing uppercase', () => {
      expect(validator.validate('password123!')).toBe(false);
    });

    it('should return false when missing lowercase', () => {
      expect(validator.validate('PASSWORD123!')).toBe(false);
    });

    it('should return false when missing number', () => {
      expect(validator.validate('Passwordabc!')).toBe(false);
    });

    it('should return false when missing special character', () => {
      expect(validator.validate('Password123')).toBe(false);
    });

    it('should return true for valid password', () => {
      expect(validator.validate('Password123!')).toBe(true);
    });

    it('should return true for valid password with different special chars', () => {
      expect(validator.validate('Secure@Pass1')).toBe(true);
      expect(validator.validate('Another#Test2')).toBe(true);
      expect(validator.validate('Valid$Pass3')).toBe(true);
    });

    it('should return true for password at exact minimum length', () => {
      expect(validator.validate('Abcdef1!')).toBe(true);
    });
  });

  describe('defaultMessage', () => {
    it('should return the default error message', () => {
      const message = validator.defaultMessage();
      expect(message).toBe(
        'Password must contain at least 8 characters, including uppercase, lowercase, number, and special character',
      );
    });
  });
});
