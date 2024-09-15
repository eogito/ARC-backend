import { DataSource, Repository } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { Book } from 'src/entities/book.entity'

@Injectable()
export class BookRepository extends Repository<Book> {
  constructor(dataSource: DataSource) {
    super(Book, dataSource.createEntityManager())
  }

  async getAll(): Promise<Book[] | null> {
    return await this.find()
  }

  async getById(id: number): Promise<Book | null> {
    const query = this.createQueryBuilder('book')
      .where('book.id = :id', {id: id})
    const book = await query.getOne()
    return book
  }

  async deteleById(id: number) {
    const query = this.createQueryBuilder()
      .delete()
      .where("id = :id", { id: id })
    return await query.execute()
  }

  filterSearch(filter: any, query: any) {
    if (filter && filter['title']) {
      query.andWhere('book.title like :title', {title: filter['title']})
    }
    if (filter && filter['author']) {
      query.andWhere('book.author like :author', {author: filter['author']})
    }
    if (filter && filter['publishYear']) {
        query.andWhere('book.publishYear like :publishYear', {publishYear: filter['publishYear']})
      }
    return query
  }

  async search(filter: any, sorting, offset: number, limit: number):Promise<any[]> {
    console.log(filter)
    let query = this.createQueryBuilder('book')

    if (filter.scheduleDate) {
      query.andWhere('date(startTime) = :scheduleDate', {scheduleDate: filter.scheduleDate})
    }
    query = this.filterSearch(filter, query)
    if (sorting.sortId) {
      let direction= 'ASC'
      if(sorting.sortDesc) {
        direction = 'DESC'
      }
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      //query.orderBy(`apt.${sorting.sortId}`, direction)
    }
    console.log(query.getQueryAndParameters())
    query.offset(offset).limit(limit)
    const results = await query.getMany()
    return results
  }
}