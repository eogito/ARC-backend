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
  import { BookService } from './book.service'
  import { CreateBookDto } from './dto/create-book.dto'
  import { UpdateBookDto } from './dto/update-book.dto'
  import { Book } from 'src/entities/book.entity';
  import { SearchDto } from './dto/search.dto'
  import {Response} from "express"
  import util from "../../common/util"
    
  @Controller('book')
  @ApiTags('book')
  export class BookController {
    constructor(private readonly orderService: BookService) {}
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('JWT')
    @Get('')
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({ type: Book, isArray: true })
    @UseInterceptors(ClassSerializerInterceptor)
    async findAll() {
      return await this.orderService.findAll()
    }
    
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('JWT')
    @Get(':id')
    @ApiOkResponse({ type: Book })
    @UseInterceptors(ClassSerializerInterceptor)
    async findOne(@Param('id', ParseIntPipe) id: number, @Request() req): Promise<Book> {
      const book = await this.orderService.findOne(id)
      return book
    }
    
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('JWT')
    @Post()
    @ApiOkResponse({ type: Book })
    @HttpCode(200)
    create(@Body() createBookDto: CreateBookDto, @Request() req): Promise<Book> {
      const sessionUser = req.user
      return this.orderService.create(createBookDto, sessionUser)
    }
    
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('JWT')
    @Put(':id')
    @ApiOkResponse({ type: Book })
    @UseInterceptors(ClassSerializerInterceptor)
    @HttpCode(200)
    async update(@Param('id', ParseIntPipe) id: number,  @Request() req, @Body() updateBookDto: UpdateBookDto): Promise<Book> {
      const sessionUser = req.user
      return await this.orderService.update(id, updateBookDto,sessionUser)
    }
  
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('JWT')
    @Delete(':id')
    @ApiOkResponse({ type: Book })
    @UseInterceptors(ClassSerializerInterceptor)
    @HttpCode(200)
    async delete(@Param('id', ParseIntPipe) id: number,  @Request() req): Promise<Book> {
      return await this.orderService.delete(id)
    }
  
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('JWT')
    @Post('search')
    @ApiOkResponse({ type: Book, isArray: true })
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
    