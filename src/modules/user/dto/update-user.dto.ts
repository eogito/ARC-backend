import { ApiProperty } from '@nestjs/swagger'
import {
  IsNotEmpty, IsNumber,IsOptional,
  IsString
} from 'class-validator'
import {Transform} from "class-transformer"
import util from "../../../common/util"


export class UpdateUserDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ required: false })
    username: string 

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ required: false })
    firstName: string 
    
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ required: false })
    lastName: string 

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ required: false })
    xp: number 

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ required: false })
    streak: number

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ required: false })
    booksRead: number

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ required: false })
    lastRead: Date 
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ required: false })
    avatarId: number

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ required: false })
    parentId: number
}   