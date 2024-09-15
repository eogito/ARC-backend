import { Module } from '@nestjs/common'
import { Parent } from 'src/entities/parent.entity'
import {TypeOrmModule} from "@nestjs/typeorm"
import { ParentRepository } from 'src/repositories/parent.repository'
import { ParentService } from './parent.service'
import { ParentController } from './parent.controller'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Parent
    ])
  ],
  providers: [ParentService, ParentRepository],
  controllers: [ParentController]
})
export class ParentModule {}
