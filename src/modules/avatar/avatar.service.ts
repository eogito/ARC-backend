import { Injectable } from '@nestjs/common'
import { AvatarRepository } from 'src/repositories/avatar.repository'
import { CreateAvatarDto } from './dto/create-avatar.dto'
import { UpdateAvatarDto } from './dto/update-avatar.dto'
import util from "../../common/util"
import { Avatar } from 'src/entities/avatar.entity'
import { SearchDto } from './dto/search.dto'

@Injectable()
export class AvatarService {
  constructor(
    private avatarRepository: AvatarRepository
  ) {}

  async findAll(): Promise<Avatar[]> {
    const credits = await this.avatarRepository.getAll()
    return credits
  }

  async findOne(id: number): Promise<Avatar> {
    return await this.avatarRepository.getById(id)
  }

  async delete(id: number): Promise<any> {
    return await this.avatarRepository.deteleById(id)
  }

  async create(orderDto: CreateAvatarDto, sessionUser: any): Promise<Avatar> {
    // need to verify userId in the user table first
    console.log(orderDto)
    const data = {
      avatarName: orderDto.avatarName,
      avatarUrl: orderDto.avatarUrl,
      levelReq: orderDto.levelReq
    }
    console.log(data)
    const newData = this.avatarRepository.create(data)
    const avatar = await this.avatarRepository.save(newData)
    const result = Object.assign(avatar, data)
    util.shortDateTimeObj(result)
    return result
  }

  async update(id: number, orderDto: UpdateAvatarDto, sessionUser: any): Promise<Avatar> {
    console.log('id....' + id)
    const avatar = await this.avatarRepository.getById(id)
    console.log(avatar)
    if (!avatar) {
      util.throwError('E_0350')
    }

    const data = {
      avatarName: orderDto.avatarName,
      avatarUrl: orderDto.avatarUrl,
      levelReq: orderDto.levelReq
    }
    console.log(data)
    await this.avatarRepository.update(id, data)
    const result = Object.assign(avatar, data)
    util.shortDateTimeObj(result)
    return result
  }

  async count(searchDto: SearchDto, sessionUser: any) {
    let filter = {}
    if (searchDto.filter) {
      filter = JSON.parse(searchDto.filter)
    }
    return await this.avatarRepository.count(filter)
  }

  async search(searchDto: SearchDto, sessionUser: any): Promise<any[]> {
    console.log(sessionUser)
    console.log(searchDto)
    let filter = {}
    let sorting = {}
    if (searchDto.filter) {
      filter = JSON.parse(searchDto.filter)
    }
    if (searchDto.sorting) {
      sorting = JSON.parse(searchDto.sorting)
      console.log(sorting)
      // typeName, fullName override
      if (sorting && sorting['sortId']) {
        if (sorting['sortId'] === 'fullName') {
          sorting['sortId'] = 'firstName'
        }
      }
    }
    console.log(sorting)
    return await this.avatarRepository.search(filter, sorting, searchDto.offset, searchDto.limit)
  }
}
