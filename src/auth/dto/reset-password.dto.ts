import { IsString, MinLength, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
  @ApiProperty({ description: '6-digit verification code', example: '123456' })
  @IsString()
  @Length(6, 6)
  code!: string;

  @ApiProperty({ description: 'New password', example: 'newPassword123', minLength: 6 })
  @IsString()
  @MinLength(6)
  password!: string;
}
