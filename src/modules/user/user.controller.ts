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
  import { UserService } from './user.service'
  import { CreateUserDto } from './dto/create-user.dto'
  import { UpdateUserDto } from './dto/update-user.dto'
  import { User } from 'src/entities/user.entity';
  import { SearchDto } from './dto/search.dto'
  import {Response} from "express"
  import util from "../../common/util"
    
  @Controller('user')
  @ApiTags('user')
  export class UserController {
    constructor(private readonly orderService: UserService) {}
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('JWT')
    @Get('')
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({ type: User, isArray: true })
    @UseInterceptors(ClassSerializerInterceptor)
    async findAll() {
      return await this.orderService.findAll()
    }
    
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('JWT')
    @Get(':id')
    @ApiOkResponse({ type: User })
    @UseInterceptors(ClassSerializerInterceptor)
    async findOne(@Param('id', ParseIntPipe) id: number, @Request() req): Promise<User> {
      const user = await this.orderService.findOne(id)
      return user
    }
    
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('JWT')
    @Post()
    @ApiOkResponse({ type: User })
    @HttpCode(200)
    create(@Body() createUserDto: CreateUserDto, @Request() req): Promise<User> {
      const sessionUser = req.user
      return this.orderService.create(createUserDto, sessionUser)
    }
    
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('JWT')
    @Put(':id')
    @ApiOkResponse({ type: User })
    @UseInterceptors(ClassSerializerInterceptor)
    @HttpCode(200)
    async update(@Param('id', ParseIntPipe) id: number,  @Request() req, @Body() updateUserDto: UpdateUserDto): Promise<User> {
      const sessionUser = req.user
      return await this.orderService.update(id, updateUserDto,sessionUser)
    }
  
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('JWT')
    @Delete(':id')
    @ApiOkResponse({ type: User })
    @UseInterceptors(ClassSerializerInterceptor)
    @HttpCode(200)
    async delete(@Param('id', ParseIntPipe) id: number,  @Request() req): Promise<User> {
      return await this.orderService.delete(id)
    }
  }
    