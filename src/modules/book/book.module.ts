import { Module } from '@nestjs/common'
import { Book } from 'src/entities/book.entity'
import {TypeOrmModule} from "@nestjs/typeorm"
import { BookRepository } from 'src/repositories/book.repository'
import { BookService } from './book.service'
import { BookController } from './book.controller'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Book
    ])
  ],
  providers: [BookService, BookRepository],
  controllers: [BookController]
})
export class BookModule {}
