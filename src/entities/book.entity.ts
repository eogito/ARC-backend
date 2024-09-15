import {Entity, Column, PrimaryGeneratedColumn, AfterLoad, BeforeInsert, ManyToOne, OneToMany, JoinColumn} from 'typeorm'
import { ApiProperty } from '@nestjs/swagger'
import {Exclude} from "class-transformer"
import util from "../common/util"

@Entity('book')
export class Book {
  @ApiProperty({ example: 1})
  @PrimaryGeneratedColumn()
    id: number

  @ApiProperty({ example: 1})
  @Column('int', {name: 'userId'})
    userId: number

  @ApiProperty({ example: 'title123'})
  @Column({ length: 255, nullable: true })
    title: string

  @ApiProperty({ example: 'author'})
  @Column({ length: 255, nullable: true })
    author: string

  @ApiProperty({ example: 'coverUrl'})
  @Column({ length: 255, nullable: true })
    coverUrl: string

  @ApiProperty({ example: 1})
  @Column('int', {name: 'publishYear'})
    publishYear: number

  @ApiProperty({ example: 1})
  @Column('int', {name: 'pages'})
    pages: number

}