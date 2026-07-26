import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { IsCnpj, CnpjConstraint } from './cnpj.constraint';

class TestDto {
  @IsCnpj({ message: 'CNPJ inválido' })
  cnpj!: string;
}

describe('CnpjConstraint', () => {
  const validator = new CnpjConstraint();

  describe('validate (direct)', () => {
    it('should return false for non-string', () => {
      expect(validator.validate(12345678901234 as any)).toBe(false);
    });

    it('should return false for wrong length', () => {
      expect(validator.validate('123456789012')).toBe(false);
      expect(validator.validate('123456789012345')).toBe(false);
    });

    it('should return false for invalid DV characters', () => {
      expect(validator.validate('123456780001AB')).toBe(false);
    });

    it('should validate classic numeric CNPJ without mask', () => {
      expect(validator.validate('11222333000181')).toBe(true);
    });

    it('should validate classic numeric CNPJ with mask', () => {
      expect(validator.validate('11.222.333/0001-81')).toBe(true);
    });

    it('should validate alphanumeric CNPJ', () => {
      expect(validator.validate('12ABC34501DE35')).toBe(true);
    });

    it('should validate alphanumeric CNPJ with mask', () => {
      expect(validator.validate('12.ABC.345/01DE-35')).toBe(true);
    });

    it('should reject CNPJ with wrong DV', () => {
      expect(validator.validate('11222333000182')).toBe(false);
      expect(validator.validate('12ABC34501DE36')).toBe(false);
    });

    it('should accept CNPJ with lowercase letters (sanitized to uppercase)', () => {
      expect(validator.validate('12abc34501de35')).toBe(true);
    });

    it('should reject CNPJ with special characters in root', () => {
      expect(validator.validate('12.345.678/00@1-95')).toBe(false);
    });
  });

  describe('DTO validation with class-validator', () => {
    it('should pass valid classic CNPJ', async () => {
      const dto = plainToInstance(TestDto, { cnpj: '11222333000181' });
      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should pass valid masked classic CNPJ', async () => {
      const dto = plainToInstance(TestDto, { cnpj: '11.222.333/0001-81' });
      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should pass valid alphanumeric CNPJ', async () => {
      const dto = plainToInstance(TestDto, { cnpj: '12ABC34501DE35' });
      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should pass valid masked alphanumeric CNPJ', async () => {
      const dto = plainToInstance(TestDto, { cnpj: '12.ABC.345/01DE-35' });
      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should fail for invalid CNPJ', async () => {
      const dto = plainToInstance(TestDto, { cnpj: '11111111111111' });
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints?.Cnpj).toBe('CNPJ inválido');
    });

    it('should fail for empty string', async () => {
      const dto = plainToInstance(TestDto, { cnpj: '' });
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });

    it('should fail for short input', async () => {
      const dto = plainToInstance(TestDto, { cnpj: '1234567890' });
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });
  });
});
