import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
  @ApiProperty({ description: 'Password reset token', example: 'abc123def456...' })
  @IsString()
  token!: string;

  @ApiProperty({ description: 'New password', example: 'newPassword123', minLength: 6 })
  @IsString()
  @MinLength(6)
  password!: string;
}
