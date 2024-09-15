import { Injectable } from '@nestjs/common'
import { UserRepository } from 'src/repositories/user.repository'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import util from "../../common/util"
import { User } from 'src/entities/user.entity'
import { SearchDto } from './dto/search.dto'

@Injectable()
export class UserService {
  constructor(
    private userRepository: UserRepository
  ) {}

  async findAll(): Promise<User[]> {
    const credits = await this.userRepository.getAll()
    return credits
  }

  async findOne(id: number): Promise<User> {
    return await this.userRepository.getById(id)
  }

  async delete(id: number): Promise<any> {
    return await this.userRepository.deteleById(id)
  }

  async getByUsernamePassword(username: string, password: string): Promise<User | undefined> {
    return await this.userRepository.getByUsernamePassword(username, password)
  }

  async create(orderDto: CreateUserDto, sessionUser: any): Promise<User> {
    // need to verify userId in the user table first
    console.log(orderDto)
    const data = {
      username: orderDto.username,
      password: orderDto.password,
      firstName: orderDto.firstName,
      lastName: orderDto.lastName,
      xp: orderDto.xp,
      streak: orderDto.streak,
      booksRead: orderDto.booksRead,
      lastRead: orderDto.lastRead,
      avatarId: orderDto.avatarId,
      parentId: orderDto.parentId
    }
    console.log(data)
    const newData = this.userRepository.create(data)
    const user = await this.userRepository.save(newData)
    const result = Object.assign(user, data)
    util.shortDateTimeObj(result)
    return result
  }

  async update(id: number, orderDto: UpdateUserDto, sessionUser: any): Promise<User> {
    console.log('id....' + id)
    const user = await this.userRepository.getById(id)
    console.log(user)
    if (!user) {
      util.throwError('E_0350')
    }

    const data = {
      username: orderDto.username,
      firstName: orderDto.firstName,
      lastName: orderDto.lastName,
      xp: orderDto.xp,
      streak: orderDto.streak,
      booksRead: orderDto.booksRead,
      lastRead: orderDto.lastRead,
      avatarId: orderDto.avatarId,
      parentId: orderDto.parentId
    }
    console.log(data)
    await this.userRepository.update(id, data)
    const result = Object.assign(user, data)
    util.shortDateTimeObj(result)
    return result
  }
}
