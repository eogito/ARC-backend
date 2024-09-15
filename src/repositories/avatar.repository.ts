import { DataSource, Repository } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { Avatar } from 'src/entities/avatar.entity'

@Injectable()
export class AvatarRepository extends Repository<Avatar> {
  constructor(dataSource: DataSource) {
    super(Avatar, dataSource.createEntityManager())
  }

  async getAll(): Promise<Avatar[] | null> {
    return await this.find()
  }

  async getById(id: number): Promise<Avatar | null> {
    const query = this.createQueryBuilder('avatar')
      .where('avatar.id = :id', {id: id})
    const avatar = await query.getOne()
    return avatar
  }

  async deteleById(id: number) {
    const query = this.createQueryBuilder()
      .delete()
      .where("id = :id", { id: id })
    return await query.execute()
  }

  filterSearch(filter: any, query: any) {
    if (filter && filter['avatarName']) {
      query.andWhere('avatar.avatarName like :avatarName', {avatarName: filter['avatarName']})
    }
    return query
  }

  async search(filter: any, sorting, offset: number, limit: number):Promise<any[]> {
    console.log(filter)
    let query = this.createQueryBuilder('avatar')

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