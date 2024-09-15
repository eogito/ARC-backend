import { DataSource, Repository } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { User } from 'src/entities/user.entity'

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(dataSource: DataSource) {
    super(User, dataSource.createEntityManager())
  }

  async getAll(): Promise<User[] | null> {
    const query = this.createQueryBuilder('user')
      .leftJoinAndSelect('user.Parent', 'parent')
      .leftJoinAndSelect('user.Avatar', 'avatar')
    const results = await query.getMany()
    return results
  }

  async getById(id: number): Promise<User | null> {
    const query = this.createQueryBuilder('user')
      .leftJoinAndSelect('user.Parent', 'parent')
      .leftJoinAndSelect('user.Avatar', 'avatar')
      .where('user.id = :id', {id: id})
    const user = await query.getOne()
    return user
  }

  async deteleById(id: number) {
    const query = this.createQueryBuilder()
      .delete()
      .where("id = :id", { id: id })
    return await query.execute()
  }
  async getByUsername(username: string): Promise<User | null> {
    return await this.findOneBy({ username: username })
  }

  async getByUsernamePassword(username: string, password: string): Promise<User | null> {
    return await this.findOneBy(
      {
        username: username,
        password: password
      }
    )
  }


  filterSearch(filter: any, query: any) {
    if (filter && filter['username']) {
      query.andWhere('user.username like :username', {username: filter['username']})
    }
    if (filter && filter['firstName']) {
      query.andWhere('user.firstName like :firstName', {firstName: filter['firstName']})
    }
    if (filter && filter['parentName']) {
        query.andWhere('user.parent.firstName like :parentName', {parentName: filter['parentName']})
      }
    return query
  }

  
  async search(filter: any, sorting, offset: number, limit: number):Promise<any[]> {
    console.log(filter)
    let query = this.createQueryBuilder('user')
      .leftJoinAndSelect('user.Parent', 'parent')
      .leftJoinAndSelect('user.Avatar', 'avatar')

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