import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  const mockAuthService = {
    register: jest.fn(),
    confirmEmail: jest.fn(),
    login: jest.fn(),
    getProfile: jest.fn(),
    forgotPassword: jest.fn(),
    resetPassword: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should call service.register with dto', async () => {
      const dto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        confirmEmail: 'john@example.com',
        password: 'Password123!',
        confirmPassword: 'Password123!',
      };
      const user = { id: 1, ...dto, emailConfirmed: false };

      mockAuthService.register.mockResolvedValue(user);

      const result = await controller.register(dto);

      expect(service.register).toHaveBeenCalledWith(dto);
      expect(result).toEqual(user);
    });
  });

  describe('confirmEmail', () => {
    it('should call service.confirmEmail with token', async () => {
      const token = 'valid-token';
      const response = { message: 'Email confirmed successfully' };

      mockAuthService.confirmEmail.mockResolvedValue(response);

      const result = await controller.confirmEmail(token);

      expect(service.confirmEmail).toHaveBeenCalledWith(token);
      expect(result).toEqual(response);
    });
  });

  describe('login', () => {
    it('should call service.login with user from request', async () => {
      const dto = { email: 'john@example.com', password: 'password' };
      const user = { id: 1, email: 'john@example.com' };
      const loginResponse = {
        access_token: 'jwt-token',
        user: { id: 1, firstName: 'John', lastName: 'Doe', email: 'john@example.com', companyId: null },
      };

      mockAuthService.login.mockResolvedValue(loginResponse);

      const result = await controller.login(dto, user);

      expect(service.login).toHaveBeenCalledWith(user);
      expect(result).toEqual(loginResponse);
    });
  });

  describe('getProfile', () => {
    it('should call service.getProfile with userId', async () => {
      const user = { id: 1, firstName: 'John', lastName: 'Doe', email: 'john@example.com' };

      mockAuthService.getProfile.mockResolvedValue(user);

      const result = await controller.getProfile(1);

      expect(service.getProfile).toHaveBeenCalledWith(1);
      expect(result).toEqual(user);
    });
  });

  describe('forgotPassword', () => {
    it('should call service.forgotPassword with email', async () => {
      const dto = { email: 'john@example.com' };
      const response = { message: 'If the email exists, a verification code has been sent' };

      mockAuthService.forgotPassword.mockResolvedValue(response);

      const result = await controller.forgotPassword(dto);

      expect(service.forgotPassword).toHaveBeenCalledWith(dto.email);
      expect(result).toEqual(response);
    });
  });

  describe('resetPassword', () => {
    it('should call service.resetPassword with dto', async () => {
      const dto = { code: '123456', password: 'NewPassword123!' };
      const response = { message: 'Password has been reset successfully' };

      mockAuthService.resetPassword.mockResolvedValue(response);

      const result = await controller.resetPassword(dto);

      expect(service.resetPassword).toHaveBeenCalledWith(dto);
      expect(result).toEqual(response);
    });
  });
});
