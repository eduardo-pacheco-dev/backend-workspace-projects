import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConflictException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { ObjectLiteral, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { User } from '../users/user.entity';
import { EmailService } from '../email/email.service';

jest.mock('bcrypt');

type MockRepository<T extends ObjectLiteral = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

const createMockRepository = <T extends ObjectLiteral = any>(): MockRepository<T> => ({
  find: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  createQueryBuilder: jest.fn(),
});

const mockEmailService = {
  sendConfirmationEmail: jest.fn(),
  sendPasswordResetCode: jest.fn(),
};

const mockJwtService = {
  sign: jest.fn(),
};

describe('AuthService', () => {
  let service: AuthService;
  let usersRepository: MockRepository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: createMockRepository(),
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: EmailService,
          useValue: mockEmailService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersRepository = module.get(getRepositoryToken(User));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return user without password when credentials are valid', async () => {
      const user = {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'hashedPassword',
      };

      const queryBuilder = {
        addSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(user),
      };

      usersRepository.createQueryBuilder!.mockReturnValue(queryBuilder);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true as never);

      const result = await service.validateUser('john@example.com', 'password');

      expect(usersRepository.createQueryBuilder).toHaveBeenCalledWith('user');
      expect(result).toBeDefined();
      expect(result).not.toHaveProperty('password');
      expect(result.email).toBe('john@example.com');
    });

    it('should return null when user is not found', async () => {
      const queryBuilder = {
        addSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(undefined),
      };

      usersRepository.createQueryBuilder!.mockReturnValue(queryBuilder);

      const result = await service.validateUser('notfound@example.com', 'password');

      expect(result).toBeNull();
    });

    it('should return null when password is invalid', async () => {
      const user = {
        id: 1,
        email: 'john@example.com',
        password: 'hashedPassword',
      };

      const queryBuilder = {
        addSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(user),
      };

      usersRepository.createQueryBuilder!.mockReturnValue(queryBuilder);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false as never);

      const result = await service.validateUser('john@example.com', 'wrongPassword');

      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should return access token and user data', async () => {
      const user = {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        companyId: null,
      };

      mockJwtService.sign.mockReturnValue('jwt-token');

      const result = await service.login(user);

      expect(mockJwtService.sign).toHaveBeenCalledWith({
        sub: user.id,
        email: user.email,
        companyId: user.companyId,
      });
      expect(result).toEqual({
        access_token: 'jwt-token',
        user: {
          id: 1,
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          companyId: null,
        },
      });
    });
  });

  describe('register', () => {
    const registerDto = {
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane@example.com',
      confirmEmail: 'jane@example.com',
      password: 'Password123!',
      confirmPassword: 'Password123!',
    };

    it('should create a user and return data without password and confirmationToken', async () => {
      usersRepository.findOne!.mockResolvedValue(undefined);
      usersRepository.create!.mockReturnValue(registerDto);
      usersRepository.save!.mockResolvedValue({
        ...registerDto,
        id: 1,
        password: 'hashed',
        confirmationToken: 'token123',
      });

      (bcrypt.genSalt as jest.Mock).mockResolvedValue('salt');
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed');
      mockEmailService.sendConfirmationEmail.mockResolvedValue(true);

      const result = await service.register(registerDto);

      expect(usersRepository.findOne).toHaveBeenCalledWith({
        where: { email: 'jane@example.com' },
      });
      expect(usersRepository.create).toHaveBeenCalled();
      expect(usersRepository.save).toHaveBeenCalled();
      expect(mockEmailService.sendConfirmationEmail).toHaveBeenCalledWith(
        'jane@example.com',
        'Jane',
        expect.any(String),
      );
      expect(result).not.toHaveProperty('password');
      expect(result).not.toHaveProperty('confirmationToken');
      expect(result.email).toBe('jane@example.com');
    });

    it('should throw ConflictException when email is already registered', async () => {
      usersRepository.findOne!.mockResolvedValue({ id: 1, email: 'jane@example.com' });

      await expect(service.register(registerDto)).rejects.toThrow(ConflictException);
      expect(usersRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('confirmEmail', () => {
    it('should confirm email when token is valid', async () => {
      const user = { id: 1, confirmationToken: 'valid-token' };

      const queryBuilder = {
        addSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(user),
      };

      usersRepository.createQueryBuilder!.mockReturnValue(queryBuilder);

      const result = await service.confirmEmail('valid-token');

      expect(usersRepository.update).toHaveBeenCalledWith(1, {
        emailConfirmed: true,
        confirmationToken: undefined,
      });
      expect(result).toEqual({ message: 'Email confirmed successfully' });
    });

    it('should throw BadRequestException when token is invalid', async () => {
      const queryBuilder = {
        addSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(undefined),
      };

      usersRepository.createQueryBuilder!.mockReturnValue(queryBuilder);

      await expect(service.confirmEmail('invalid-token')).rejects.toThrow(BadRequestException);
    });
  });

  describe('getProfile', () => {
    it('should return user when found', async () => {
      const user = { id: 1, firstName: 'John', email: 'john@example.com' };

      usersRepository.findOne!.mockResolvedValue(user);

      const result = await service.getProfile(1);

      expect(usersRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(result).toEqual(user);
    });

    it('should throw UnauthorizedException when user is not found', async () => {
      usersRepository.findOne!.mockResolvedValue(undefined);

      await expect(service.getProfile(999)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('forgotPassword', () => {
    it('should send reset code when email exists', async () => {
      const user = { id: 1, email: 'john@example.com' };

      usersRepository.findOne!.mockResolvedValue(user);
      mockEmailService.sendPasswordResetCode.mockResolvedValue(true);

      const result = await service.forgotPassword('john@example.com');

      expect(usersRepository.update).toHaveBeenCalledWith(1, {
        resetCode: expect.any(String),
        resetCodeExpires: expect.any(Date),
      });
      expect(mockEmailService.sendPasswordResetCode).toHaveBeenCalledWith(
        'john@example.com',
        expect.any(String),
      );
      expect(result).toEqual({ message: 'If the email exists, a verification code has been sent' });
    });

    it('should return same message when email does not exist', async () => {
      usersRepository.findOne!.mockResolvedValue(undefined);

      const result = await service.forgotPassword('unknown@example.com');

      expect(usersRepository.update).not.toHaveBeenCalled();
      expect(mockEmailService.sendPasswordResetCode).not.toHaveBeenCalled();
      expect(result).toEqual({ message: 'If the email exists, a verification code has been sent' });
    });
  });

  describe('resetPassword', () => {
    it('should reset password when code is valid and not expired', async () => {
      const user = {
        id: 1,
        resetCode: '123456',
        resetCodeExpires: new Date(Date.now() + 3600000),
      };

      const queryBuilder = {
        addSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(user),
      };

      const updateQueryBuilder = {
        update: jest.fn().mockReturnThis(),
        set: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        execute: jest.fn().mockResolvedValue(undefined),
      };

      usersRepository.createQueryBuilder!
        .mockReturnValueOnce(queryBuilder)
        .mockReturnValueOnce(updateQueryBuilder);

      (bcrypt.genSalt as jest.Mock).mockResolvedValue('salt');
      (bcrypt.hash as jest.Mock).mockResolvedValue('newHashed');

      const dto = { code: '123456', password: 'NewPassword123!' };

      const result = await service.resetPassword(dto);

      expect(updateQueryBuilder.execute).toHaveBeenCalled();
      expect(result).toEqual({ message: 'Password has been reset successfully' });
    });

    it('should throw BadRequestException when code is invalid', async () => {
      const queryBuilder = {
        addSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(undefined),
      };

      usersRepository.createQueryBuilder!.mockReturnValue(queryBuilder);

      const dto = { code: '000000', password: 'NewPassword123!' };

      await expect(service.resetPassword(dto)).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException when code is expired', async () => {
      const user = {
        id: 1,
        resetCode: '123456',
        resetCodeExpires: new Date(Date.now() - 3600000),
      };

      const queryBuilder = {
        addSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(user),
      };

      usersRepository.createQueryBuilder!.mockReturnValue(queryBuilder);

      const dto = { code: '123456', password: 'NewPassword123!' };

      await expect(service.resetPassword(dto)).rejects.toThrow(BadRequestException);
    });
  });
});
