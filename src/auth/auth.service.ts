import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../users/user.entity';
import { EmailService } from '../email/email.service';
import { RegisterDto } from './dto/register.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email })
      .getOne();

    if (!user) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return null;
    }

    const { password: _, ...result } = user;
    return result;
  }

  async login(user: any) {
    const payload = {
      sub: user.id,
      email: user.email,
      companyId: user.companyId,
    };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        companyId: user.companyId,
      },
    };
  }

  async register(dto: RegisterDto) {
    const existingUser = await this.usersRepository.findOne({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(dto.password, salt);

    const user = this.usersRepository.create({
      ...dto,
      password: hashedPassword,
    });

    const savedUser = await this.usersRepository.save(user);
    const { password: _, ...result } = savedUser;
    return result;
  }

  async getProfile(userId: number) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }

  async forgotPassword(email: string): Promise<{ message: string }> {
    const user = await this.usersRepository.findOne({
      where: { email },
    });

    if (!user) {
      return { message: 'If the email exists, a verification code has been sent' };
    }

    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const resetCodeExpires = new Date(Date.now() + 3600000); // 1 hour

    await this.usersRepository.update(user.id, {
      resetCode,
      resetCodeExpires,
    });

    await this.emailService.sendPasswordResetCode(email, resetCode);

    return { message: 'If the email exists, a verification code has been sent' };
  }

  async resetPassword(dto: ResetPasswordDto): Promise<{ message: string }> {
    const user = await this.usersRepository
      .createQueryBuilder('user')
      .addSelect('user.resetCode')
      .addSelect('user.resetCodeExpires')
      .where('user.resetCode = :code', { code: dto.code })
      .getOne();

    if (!user) {
      throw new BadRequestException('Invalid verification code');
    }

    if (user.resetCodeExpires && user.resetCodeExpires < new Date()) {
      throw new BadRequestException('Verification code has expired');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(dto.password, salt);

    await this.usersRepository
      .createQueryBuilder()
      .update(User)
      .set({
        password: hashedPassword,
        resetCode: undefined,
        resetCodeExpires: undefined,
      })
      .where('id = :id', { id: user.id })
      .execute();

    return { message: 'Password has been reset successfully' };
  }
}
