import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Request
} from '@nestjs/common'

import {ApiBearerAuth, ApiTags} from '@nestjs/swagger'

import { AuthService} from "./auth.service"
import { JwtAuthGuard } from './guards/jwt-auth.guard'
import { LocalAuthGuard } from './guards/local-auth.guard'
import { UserService } from '../user/user.service'
import { LoginDto} from "./dto/login.dto"

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService
  ) {}

  // @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Body() loginDto: LoginDto): Promise<any> {
    const user = await this.authService.validateUser(loginDto.username, loginDto.password)
    return await this.authService.login(user)
  }

  //Get / protected
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  @Get('/profile')
  async getProfile(@Request() req): Promise<any> {
    // req.user is jwt token data
    const member = await this.userService.findOne(req.user.memberId)
    delete member.password
    return member
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  @Get('/refresh')
  async refresh(@Request() req): Promise<any> {
    // req.user is jwt token data
    const member = await this.userService.findOne(req.user.memberId)
    delete member.password
    return member
  }

  //Get / logout
  @Get('/logout')
  async logout(@Request() req): Promise<any> {
    req.session.destroy()
    return { msg: 'The user session has ended' }
  }
}
