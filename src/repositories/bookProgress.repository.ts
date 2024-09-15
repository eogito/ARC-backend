import { DataSource, Repository } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { BookProgress } from 'src/entities/bookProgress.entity'

@Injectable()
export class BookProgressRepository extends Repository<BookProgress> {
  constructor(dataSource: DataSource) {
    super(BookProgress, dataSource.createEntityManager())
  }

  async getAll(): Promise<BookProgress[] | null> {
    const query = this.createQueryBuilder('bookProgress')
      .leftJoinAndSelect('bookProgress.User', 'user')
      .leftJoinAndSelect('bookProgress.Book', 'book')
    const results = await query.getMany()
    return results
  }

  async getById(id: number): Promise<BookProgress | null> {
    const query = this.createQueryBuilder('bookProgress')
      .leftJoinAndSelect('bookProgress.User', 'user')
      .leftJoinAndSelect('bookProgress.Book', 'book')
      .where('bookProgress.id = :id', {id: id})
    const bookProgress = await query.getOne()
    return bookProgress
  }

  async deteleById(id: number) {
    const query = this.createQueryBuilder()
      .delete()
      .where("id = :id", { id: id })
    return await query.execute()
  }

  filterSearch(filter: any, query: any) {
    if (filter && filter['title']) {
      query.andWhere('bookProgress.book.title like :title', {title: filter['title']})
    }
    if (filter && filter['author']) {
      query.andWhere('bookProgress.book.author like :author', {author: filter['author']})
    }
    if (filter && filter['publishYear']) {
        query.andWhere('bookProgress.book.publishYear like :publishYear', {publishYear: filter['publishYear']})
      }
    return query
  }

  async search(filter: any, sorting, offset: number, limit: number):Promise<any[]> {
    console.log(filter)
    let query = this.createQueryBuilder('bookProgress')
      .leftJoinAndSelect('bookProgress.User', 'user')
      .leftJoinAndSelect('bookProgress.Book', 'book')

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