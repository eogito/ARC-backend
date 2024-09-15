import { ApiProperty } from '@nestjs/swagger'
import {
  IsNotEmpty, IsNumber,IsOptional,
  IsString
} from 'class-validator'
import {Transform} from "class-transformer"
import util from "../../../common/util"


export class CreateBookDto {
  @Transform(({value}) => util.convertToNumber(value))
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
    userId: number

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ required: false })
    title: string 

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ required: false })
    author: string       
  
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ required: false })
    coverUrl: string    

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
    publishYear: number

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
    pages: number
}