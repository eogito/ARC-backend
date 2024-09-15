import { ApiProperty } from '@nestjs/swagger'
import {
  IsNotEmpty, IsNumber,IsOptional,
  IsString
} from 'class-validator'
import {Transform} from "class-transformer"
import util from "../../../common/util"


export class UpdateAvatarDto {
  @Transform(({value}) => util.convertToNumber(value))
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
    id: number

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ required: false })
    avatarName: string 

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ required: false })
    avatarUrl: string      
    
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
    levelReq: number
  
}