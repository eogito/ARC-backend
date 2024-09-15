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
  import { AvatarService } from './avatar.service'
  import { CreateAvatarDto } from './dto/create-avatar.dto'
  import { UpdateAvatarDto } from './dto/update-avatar.dto'
  import { Avatar } from 'src/entities/avatar.entity';
  import { SearchDto } from './dto/search.dto'
  import {Response} from "express"
  import util from "../../common/util"
    
  @Controller('avatar')
  @ApiTags('avatar')
  export class AvatarController {
    constructor(private readonly orderService: AvatarService) {}
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('JWT')
    @Get('')
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({ type: Avatar, isArray: true })
    @UseInterceptors(ClassSerializerInterceptor)
    async findAll() {
      return await this.orderService.findAll()
    }
    
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('JWT')
    @Get(':id')
    @ApiOkResponse({ type: Avatar })
    @UseInterceptors(ClassSerializerInterceptor)
    async findOne(@Param('id', ParseIntPipe) id: number, @Request() req): Promise<Avatar> {
      const avatar = await this.orderService.findOne(id)
      return avatar
    }
    
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('JWT')
    @Post()
    @ApiOkResponse({ type: Avatar })
    @HttpCode(200)
    create(@Body() createAvatarDto: CreateAvatarDto, @Request() req): Promise<Avatar> {
      const sessionUser = req.user
      return this.orderService.create(createAvatarDto, sessionUser)
    }
    
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('JWT')
    @Put(':id')
    @ApiOkResponse({ type: Avatar })
    @UseInterceptors(ClassSerializerInterceptor)
    @HttpCode(200)
    async update(@Param('id', ParseIntPipe) id: number,  @Request() req, @Body() updateAvatarDto: UpdateAvatarDto): Promise<Avatar> {
      const sessionUser = req.user
      return await this.orderService.update(id, updateAvatarDto,sessionUser)
    }
  
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('JWT')
    @Delete(':id')
    @ApiOkResponse({ type: Avatar })
    @UseInterceptors(ClassSerializerInterceptor)
    @HttpCode(200)
    async delete(@Param('id', ParseIntPipe) id: number,  @Request() req): Promise<Avatar> {
      return await this.orderService.delete(id)
    }
  
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('JWT')
    @Post('search')
    @ApiOkResponse({ type: Avatar, isArray: true })
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
    