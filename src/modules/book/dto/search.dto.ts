import { ApiProperty } from '@nestjs/swagger'
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength
} from 'class-validator'
import {Transform} from "class-transformer"
import util from '../../../common/util'

export class SearchDto {
  @IsOptional()
  @ApiProperty({ required: true, example: '{\"firstName\":\"sd\"}' })
  @Transform(({value}) => util.trimStr(value))
    filter: string

  @IsOptional()
  @ApiProperty({ required: true, example: '{\"sortId\":\"id\"}' })
  @Transform(({value}) => util.trimStr(value))
    sorting: string

  @Transform(({value}) => util.convertToNumber(value))
  @IsInt()
  @ApiProperty({ required: false })
    offset: number

  @Transform(({value}) => util.convertToNumber(value))
  @IsInt()
  @ApiProperty({ required: false })
    limit: number
}