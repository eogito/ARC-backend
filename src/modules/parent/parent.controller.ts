import {
    Controller,
    Get,
    Post,
    Param,
    ParseIntPipe,
    UseGuards,
    Body,
    ClassSerializerInterceptor,
    Put, Request, Req, HttpCode, Res, HttpStatus, Delete
  } from '@nestjs/common'
  import {UseInterceptors } from '@nestjs/common'
  import {ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger'
  import dayjs = require('dayjs');
    
  import { JwtAuthGuard} from '../auth/guards/jwt-auth.guard'
  import { ParentService } from './parent.service'
  import { CreateParentDto } from './dto/create-parent.dto'
  import { UpdateParentDto } from './dto/update-parent.dto'
  import { Parent } from 'src/entities/parent.entity';
  import { SearchDto } from './dto/search.dto'
  import {Response} from "express"
  import util from "../../common/util"
    
  @Controller('parent')
  @ApiTags('parent')
  export class ParentController {
    constructor(private readonly orderService: ParentService) {}
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('JWT')
    @Get('')
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({ type: Parent, isArray: true })
    @UseInterceptors(ClassSerializerInterceptor)
    async findAll() {
      return await this.orderService.findAll()
    }
    
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('JWT')
    @Get(':id')
    @ApiOkResponse({ type: Parent })
    @UseInterceptors(ClassSerializerInterceptor)
    async findOne(@Param('id', ParseIntPipe) id: number, @Request() req): Promise<Parent> {
      const parent = await this.orderService.findOne(id)
      return parent
    }
    
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('JWT')
    @Post()
    @ApiOkResponse({ type: Parent })
    @HttpCode(200)
    create(@Body() createParentDto: CreateParentDto, @Request() req): Promise<Parent> {
      const sessionUser = req.user
      return this.orderService.create(createParentDto, sessionUser)
    }
    
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('JWT')
    @Put(':id')
    @ApiOkResponse({ type: Parent })
    @UseInterceptors(ClassSerializerInterceptor)
    @HttpCode(200)
    async update(@Param('id', ParseIntPipe) id: number,  @Request() req, @Body() updateParentDto: UpdateParentDto): Promise<Parent> {
      const sessionUser = req.user
      return await this.orderService.update(id, updateParentDto,sessionUser)
    }
  
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('JWT')
    @Delete(':id')
    @ApiOkResponse({ type: Parent })
    @UseInterceptors(ClassSerializerInterceptor)
    @HttpCode(200)
    async delete(@Param('id', ParseIntPipe) id: number,  @Request() req): Promise<Parent> {
      return await this.orderService.delete(id)
    }
  }
    