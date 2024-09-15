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
  import { BookProgressService } from './bookProgress.service'
  import { CreateBookProgressDto } from './dto/create-bookProgress.dto'
  import { UpdateBookProgressDto } from './dto/update-bookProgress.dto'
  import { BookProgress } from 'src/entities/bookProgress.entity';
  import { SearchDto } from './dto/search.dto'
  import {Response} from "express"
  import util from "../../common/util"
    
  @Controller('bookProgress')
  @ApiTags('bookProgress')
  export class BookProgressController {
    constructor(private readonly orderService: BookProgressService) {}
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('JWT')
    @Get('')
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({ type: BookProgress, isArray: true })
    @UseInterceptors(ClassSerializerInterceptor)
    async findAll() {
      return await this.orderService.findAll()
    }
    
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('JWT')
    @Get(':id')
    @ApiOkResponse({ type: BookProgress })
    @UseInterceptors(ClassSerializerInterceptor)
    async findOne(@Param('id', ParseIntPipe) id: number, @Request() req): Promise<BookProgress> {
      const bookProgress = await this.orderService.findOne(id)
      return bookProgress
    }
    
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('JWT')
    @Post()
    @ApiOkResponse({ type: BookProgress })
    @HttpCode(200)
    create(@Body() createBookProgressDto: CreateBookProgressDto, @Request() req): Promise<BookProgress> {
      const sessionUser = req.user
      return this.orderService.create(createBookProgressDto, sessionUser)
    }
    
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('JWT')
    @Put(':id')
    @ApiOkResponse({ type: BookProgress })
    @UseInterceptors(ClassSerializerInterceptor)
    @HttpCode(200)
    async update(@Param('id', ParseIntPipe) id: number,  @Request() req, @Body() updateBookProgressDto: UpdateBookProgressDto): Promise<BookProgress> {
      const sessionUser = req.user
      return await this.orderService.update(id, updateBookProgressDto,sessionUser)
    }
  
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('JWT')
    @Delete(':id')
    @ApiOkResponse({ type: BookProgress })
    @UseInterceptors(ClassSerializerInterceptor)
    @HttpCode(200)
    async delete(@Param('id', ParseIntPipe) id: number,  @Request() req): Promise<BookProgress> {
      return await this.orderService.delete(id)
    }
  
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('JWT')
    @Post('search')
    @ApiOkResponse({ type: BookProgress, isArray: true })
    @HttpCode(200)
    // @UseInterceptors(ClassSerializerInterceptor)
    async search(@Body() searchDto: SearchDto,@Request() req, @Res() res: Response): Promise<any> {
      const sessionUser = req.user
      const total = await this.orderService.count(searchDto, sessionUser)
      const appointments = await this.orderService.search(searchDto, sessionUser)
      appointments.forEach(appointment => {
        appointment.startTime = util.getDateTimeStampValue(appointment.startTime)
        appointment.start = appointment.startTime
        const parsedTime = dayjs( appointment.startTime.toString())
        // Add minutes to the parsed time
        const endTime = parsedTime.add(appointment.duration, 'minute')
        appointment.end = endTime.format('YYYY-MM-DD HH:mm:ss')
      })
      res.set({'X-Total-Count': total }).json(appointments)
    }
  }
    