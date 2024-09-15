import {Injectable, NotAcceptableException, Request} from '@nestjs/common'
import * as crypto from 'crypto'

import { UserService } from 'src/modules/user/user.service'
import { JwtService } from '@nestjs/jwt'
import util from '../../common/util'
import {UserHelp} from "../../common/user-help"

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService
  ) {}

  //validate a user
  async validateUser(username: string, password: string): Promise<any> {
    const hash = util.generateHashPassword(password)
    console.log(hash)
    const user = await this.userService.getByUsernamePassword(username, password)

    if (!user) {
      util.throwError('E_0002')
    }
    if (user) {
      return user
    } else {
      util.throwError('E_0002')
    }
  }

  async login(user: any) {
    const payload = {  memberId: user.id, username: user.username, typeId: user.typeId }
    // minute
    let expireTime = '8h'
    if (process.env.COOKIE_EXPIRE_TIME) {
      expireTime = process.env.JWT_EXPIRE_TIME
    }
    expireTime.replace('h', '')
    //return as minute
    const expireMinute = parseInt(expireTime) * 60
    const data = {
      access_token: this.jwtService.sign(payload),
      username: user.username,
      memberId: user.id,
      typeId: user.typeId,
      expireTime: expireMinute
    }
    return data
  }

}
