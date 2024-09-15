import { Injectable } from '@nestjs/common'
import { BookRepository } from 'src/repositories/book.repository'
import { CreateBookDto } from './dto/create-book.dto'
import { UpdateBookDto } from './dto/update-book.dto'
import util from "../../common/util"
import { Book } from 'src/entities/book.entity'
import { SearchDto } from './dto/search.dto'

@Injectable()
export class BookService {
  constructor(
    private bookRepository: BookRepository
  ) {}

  async findAll(): Promise<Book[]> {
    const credits = await this.bookRepository.getAll()
    return credits
  }

  async findOne(id: number): Promise<Book> {
    return await this.bookRepository.getById(id)
  }

  async delete(id: number): Promise<any> {
    return await this.bookRepository.deteleById(id)
  }

  async create(orderDto: CreateBookDto, sessionUser: any): Promise<Book> {
    // need to verify userId in the user table first
    console.log(orderDto)
    const data = {
      userId: orderDto.userId,
      title: orderDto.title,
      author: orderDto.author,
      coverUrl: orderDto.coverUrl,
      publishYear: orderDto.publishYear,
      pages: orderDto.pages
    }
    console.log(data)
    const newData = this.bookRepository.create(data)
    const book = await this.bookRepository.save(newData)
    const result = Object.assign(book, data)
    util.shortDateTimeObj(result)
    return result
  }

  async update(id: number, orderDto: UpdateBookDto, sessionUser: any): Promise<Book> {
    console.log('id....' + id)
    const book = await this.bookRepository.getById(id)
    console.log(book)
    if (!book) {
      util.throwError('E_0350')
    }

    const data = {
      userId: orderDto.userId,
      title: orderDto.title,
      author: orderDto.author,
      coverUrl: orderDto.coverUrl,
      publishYear: orderDto.publishYear,
      pages: orderDto.pages
    }
    console.log(data)
    await this.bookRepository.update(id, data)
    const result = Object.assign(book, data)
    util.shortDateTimeObj(result)
    return result
  }

  async count(searchDto: SearchDto, sessionUser: any) {
    let filter = {}
    if (searchDto.filter) {
      filter = JSON.parse(searchDto.filter)
    }
    return await this.bookRepository.count(filter)
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
    return await this.bookRepository.search(filter, sorting, searchDto.offset, searchDto.limit)
  }
}
