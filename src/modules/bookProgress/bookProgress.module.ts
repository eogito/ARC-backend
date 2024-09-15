import { Module } from '@nestjs/common'
import { BookProgress } from 'src/entities/bookProgress.entity'
import {TypeOrmModule} from "@nestjs/typeorm"
import { BookProgressRepository } from 'src/repositories/bookProgress.repository'
import { BookProgressService } from './bookProgress.service'
import { BookProgressController } from './bookProgress.controller'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      BookProgress
    ])
  ],
  providers: [BookProgressService, BookProgressRepository],
  controllers: [BookProgressController]
})
export class BookProgressModule {}
