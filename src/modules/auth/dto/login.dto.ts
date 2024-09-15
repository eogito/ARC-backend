import { ApiProperty } from '@nestjs/swagger'
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength
} from 'class-validator'

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(32)
  @ApiProperty({ required: true, example: 'sean' })
    username: string

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @MaxLength(32)
  @ApiProperty({ required: true, example: 'a' })
    password: string
}
