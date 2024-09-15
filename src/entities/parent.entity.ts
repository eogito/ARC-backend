import {Entity, Column, PrimaryGeneratedColumn, AfterLoad, BeforeInsert, ManyToOne, OneToMany, JoinColumn} from 'typeorm'
import { ApiProperty } from '@nestjs/swagger'
import {Exclude} from "class-transformer"
import util from "../common/util"

@Entity('parent')
export class Parent {
  @ApiProperty({ example: 1})
  @PrimaryGeneratedColumn()
    id: number

  @ApiProperty({ example: 'firstName'})
  @Column({ length: 255, nullable: true })
    firstName: string

  @ApiProperty({ example: 'lastName'})
  @Column({ length: 255, nullable: true })
    lastName: string

  @ApiProperty({ example: 'email'})
  @Column({ length: 255, nullable: true })
    email: string

  @ApiProperty({ example: 'mother'})
  @Column({ length: 255, nullable: true })
    parentType: string

}