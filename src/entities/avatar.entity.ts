import {Entity, Column, PrimaryGeneratedColumn, AfterLoad, BeforeInsert, ManyToOne, OneToMany, JoinColumn} from 'typeorm'
import { ApiProperty } from '@nestjs/swagger'

@Entity('avatar')
export class Avatar {
  @ApiProperty({ example: 1})
  @PrimaryGeneratedColumn()
    id: number

  @ApiProperty({ example: 'avatar123'})
  @Column({nullable: true })
    avatarName: string

  @ApiProperty({ example: 'url.com'})
  @Column({nullable: true })
    avatarUrl: string

  @ApiProperty({ example: 1})
  @Column('int', {name: 'levelReq'})
    levelReq: number

}