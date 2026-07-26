import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsSecurePassword } from '../../common/validators/password.validator';
import { IsMatching } from '../../common/validators/matching.validator';

export class RegisterDto {
  @ApiProperty({ description: 'User first name', example: 'John' })
  @IsString()
  firstName!: string;

  @ApiProperty({ description: 'User last name', example: 'Doe' })
  @IsString()
  lastName!: string;

  @ApiProperty({ description: 'User email address', example: 'john@example.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ description: 'Confirm email address', example: 'john@example.com' })
  @IsEmail()
  @IsMatching('email', { message: 'Emails must match' })
  confirmEmail!: string;

  @ApiProperty({
    description: 'Password (min 8 chars, uppercase, lowercase, number, special char)',
    example: 'Password123!',
    minLength: 8,
  })
  @IsString()
  @MinLength(8)
  @IsSecurePassword()
  password!: string;

  @ApiProperty({ description: 'Confirm password', example: 'Password123!' })
  @IsString()
  @MinLength(8)
  @IsMatching('password', { message: 'Passwords must match' })
  confirmPassword!: string;
}
