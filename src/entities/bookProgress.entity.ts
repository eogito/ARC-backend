import {Entity, Column, PrimaryGeneratedColumn, AfterLoad, BeforeInsert, OneToOne, JoinColumn} from 'typeorm'
import { ApiProperty } from '@nestjs/swagger'
import { User } from './user.entity'
import { Book } from './book.entity'
import util from "../common/util"

@Entity('bookProgress')
export class BookProgress {
  @ApiProperty({ example: 1})
  @PrimaryGeneratedColumn()
    id: number

  @ApiProperty({ example: 1})
  @Column('int', {name: 'bookId'})
    bookId: number

  @ApiProperty({ example: 'title'})
  @Column({ length: 255, nullable: true })
    title: string

  @ApiProperty({ example: 'author'})
  @Column({ length: 255, nullable: true })
    author: string
    
  @ApiProperty({ example: 1})
  @Column('int', {name: 'userId'})
    userId: number

  @ApiProperty({ example: 1})
  @Column('int', {name: 'pagesRead'})
    pagesRead: number

  @ApiProperty({ example: '2023-12-14'})
  @Column('date', {name: 'lastRead', nullable: true})
    lastRead: Date | null

  @ApiProperty({ example: 'note'})
  @Column({ length: 255, nullable: true })
    note: string

  @OneToOne(() => User, {
    eager: true,
    nullable: true
  })
  @JoinColumn([{name:'userId', referencedColumnName: 'id'}])
    User: User

  @OneToOne(() => Book, {
    eager: true,
    nullable: true
  })
  @JoinColumn([{name:'bookId', referencedColumnName: 'id'}])
    Book: Book

  @AfterLoad()
  changeDateFormat() {
    this.lastRead = util.formatDateTimeStampField(this.lastRead, 'crate')
  }
  @BeforeInsert()
  changeInsertDate() {
    this.lastRead = new Date()
  }
}