import { Injectable } from '@nestjs/common'
import { BookProgressRepository } from 'src/repositories/bookProgress.repository'
import { CreateBookProgressDto } from './dto/create-bookProgress.dto'
import { UpdateBookProgressDto } from './dto/update-bookProgress.dto'
import util from "../../common/util"
import { BookProgress } from 'src/entities/bookProgress.entity'
import { SearchDto } from './dto/search.dto'

@Injectable()
export class BookProgressService {
  constructor(
    private bookProgressRepository: BookProgressRepository
  ) {}

  async findAll(): Promise<BookProgress[]> {
    const credits = await this.bookProgressRepository.getAll()
    return credits
  }

  async findOne(id: number): Promise<BookProgress> {
    return await this.bookProgressRepository.getById(id)
  }

  async delete(id: number): Promise<any> {
    return await this.bookProgressRepository.deteleById(id)
  }

  async create(orderDto: CreateBookProgressDto, sessionUser: any): Promise<BookProgress> {
    // need to verify userId in the user table first
    console.log(orderDto)
    const data = {
      bookId: orderDto.bookId,
      title: orderDto.title,
      author: orderDto.author,
      userId: orderDto.userId,
      pagesRead: orderDto.pagesRead,
      lastRead: orderDto.lastRead,
      note: orderDto.note
    }
    console.log(data)
    const newData = this.bookProgressRepository.create(data)
    const bookProgress = await this.bookProgressRepository.save(newData)
    const result = Object.assign(bookProgress, data)
    util.shortDateTimeObj(result)
    return result
  }

  async update(id: number, orderDto: UpdateBookProgressDto, sessionUser: any): Promise<BookProgress> {
    console.log('id....' + id)
    const bookProgress = await this.bookProgressRepository.getById(id)
    console.log(bookProgress)
    if (!bookProgress) {
      util.throwError('E_0350')
    }

    const data = {
      bookId: orderDto.bookId,
      title: orderDto.title,
      author: orderDto.author,
      userId: orderDto.userId,
      pagesRead: orderDto.pagesRead,
      lastRead: orderDto.lastRead,
      note: orderDto.note
    }
    console.log(data)
    await this.bookProgressRepository.update(id, data)
    const result = Object.assign(bookProgress, data)
    util.shortDateTimeObj(result)
    return result
  }

  async count(searchDto: SearchDto, sessionUser: any) {
    let filter = {}
    if (searchDto.filter) {
      filter = JSON.parse(searchDto.filter)
    }
    return await this.bookProgressRepository.count(filter)
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
    return await this.bookProgressRepository.search(filter, sorting, searchDto.offset, searchDto.limit)
  }
}
