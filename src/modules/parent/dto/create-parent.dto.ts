import { ApiProperty } from '@nestjs/swagger'
import {
  IsNotEmpty, IsNumber,IsOptional,
  IsString
} from 'class-validator'
import {Transform} from "class-transformer"
import util from "../../../common/util"


export class CreateParentDto {
  @Transform(({value}) => util.convertToNumber(value))
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ required: false })
    firstName: string 
    
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ required: false })
    lastName: string 

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ required: false })
    email: string 

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ required: false })
    parentType: string 

}