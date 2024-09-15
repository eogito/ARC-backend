import { Injectable } from '@nestjs/common'
import { ParentRepository } from 'src/repositories/parent.repository'
import { CreateParentDto } from './dto/create-parent.dto'
import { UpdateParentDto } from './dto/update-parent.dto'
import util from "../../common/util"
import { Parent } from 'src/entities/parent.entity'
import { SearchDto } from './dto/search.dto'

@Injectable()
export class ParentService {
  constructor(
    private parentRepository: ParentRepository
  ) {}

  async findAll(): Promise<Parent[]> {
    const credits = await this.parentRepository.getAll()
    return credits
  }

  async findOne(id: number): Promise<Parent> {
    return await this.parentRepository.getById(id)
  }

  async delete(id: number): Promise<any> {
    return await this.parentRepository.deteleById(id)
  }

  async create(orderDto: CreateParentDto, sessionUser: any): Promise<Parent> {
    // need to verify userId in the user table first
    console.log(orderDto)
    const data = {
      firstName: orderDto.firstName,
      lastName: orderDto.lastName,
      email: orderDto.email,
      parentType: orderDto.parentType
    }
    console.log(data)
    const newData = this.parentRepository.create(data)
    const parent = await this.parentRepository.save(newData)
    const result = Object.assign(parent, data)
    util.shortDateTimeObj(result)
    return result
  }

  async update(id: number, orderDto: UpdateParentDto, sessionUser: any): Promise<Parent> {
    console.log('id....' + id)
    const parent = await this.parentRepository.getById(id)
    console.log(parent)
    if (!parent) {
      util.throwError('E_0350')
    }

    const data = {
      firstName: orderDto.firstName,
      lastName: orderDto.lastName,
      email: orderDto.email,
      parentType: orderDto.parentType
    }
    console.log(data)
    await this.parentRepository.update(id, data)
    const result = Object.assign(parent, data)
    util.shortDateTimeObj(result)
    return result
  }
}
