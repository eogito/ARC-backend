import { DataSource, Repository } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { Parent } from 'src/entities/parent.entity'

@Injectable()
export class ParentRepository extends Repository<Parent> {
  constructor(dataSource: DataSource) {
    super(Parent, dataSource.createEntityManager())
  }

  async getAll(): Promise<Parent[] | null> {
    return await this.find()
  }

  async getById(id: number): Promise<Parent | null> {
    const query = this.createQueryBuilder('parent')
      .where('parent.id = :id', {id: id})
    const parent = await query.getOne()
    return parent
  }

  async deteleById(id: number) {
    const query = this.createQueryBuilder()
      .delete()
      .where("id = :id", { id: id })
    return await query.execute()
  }
}