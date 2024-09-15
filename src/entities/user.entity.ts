import {Entity, Column, PrimaryGeneratedColumn, AfterLoad, BeforeInsert, ManyToOne, OneToMany, JoinColumn, OneToOne} from 'typeorm'
import { ApiProperty } from '@nestjs/swagger'
import {Exclude} from "class-transformer"
import { Parent } from './parent.entity'
import { Avatar } from './avatar.entity'
import util from "../common/util"

@Entity('user')
export class User {
  @ApiProperty({ example: 1})
  @PrimaryGeneratedColumn()
    id: number

  @ApiProperty({ example: 'username123'})
  @Column({ length: 255, nullable: true })
    username: string

  @Exclude()
  @Column({ length: 255, nullable: true, select: false})
    password: string

  @ApiProperty({ example: 'firstName'})
  @Column({ length: 255, nullable: true })
    firstName: string

  @ApiProperty({ example: 'lastName'})
  @Column({ length: 255, nullable: true })
    lastName: string

  @ApiProperty({ example: 1})
  @Column('decimal', {name: 'xp', nullable: true})
    xp: number

  @ApiProperty({ example: 1})
  @Column('decimal', {name: 'streak', nullable: true})
    streak: number

  @ApiProperty({ example: 1})
  @Column('decimal', {name: 'booksRead', nullable: true})
    booksRead: number

  @ApiProperty({ example: '2023-12-14'})
  @Column('date', {name: 'lastRead', nullable: true})
    lastRead: Date | null

  @ApiProperty({ example: 1})
  @Column('decimal', {name: 'avatarId', nullable: true})
    avatarId: number

  @ApiProperty({ example: 1})
  @Column('decimal', {name: 'parentId', nullable: true})
    parentId: number

  @ApiProperty({ example: '2023-12-14 02:43:20'})
  @Column('datetime', {name: 'createdAt', nullable: true})
    createdAt: Date | null

  @OneToOne(() => Parent, {
    eager: true,
    nullable: true
  })
  @JoinColumn([{name:'parentId', referencedColumnName: 'id'}])
    Parent: Parent

  @OneToOne(() => Avatar, {
    eager: true,
    nullable: true
  })
  @JoinColumn([{name:'avatarId', referencedColumnName: 'id'}])
    Avatar: Avatar
  
  @AfterLoad()
  changeDateFormat() {
    this.createdAt = util.formatDateTimeStampField(this.createdAt, 'crate')
  }
  @BeforeInsert()
  changeInsertDate() {  
    this.createdAt = new Date()
  }

}