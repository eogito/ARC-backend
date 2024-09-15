import { ApiProperty } from '@nestjs/swagger'
import {
  IsNotEmpty, IsNumber,IsOptional,
  IsString
} from 'class-validator'
import {Transform} from "class-transformer"
import util from "../../../common/util"


export class UpdateBookProgressDto {
  @Transform(({value}) => util.convertToNumber(value))
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
    bookId: number

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ required: false })
    title: string 

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ required: false })
    author: string 
    
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
    userId: number

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
    pagesRead: number

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ required: false })
    lastRead: Date 

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ required: false })
    note: string 
    
}