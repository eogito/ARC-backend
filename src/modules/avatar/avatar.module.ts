import { Module } from '@nestjs/common'
import { Avatar } from 'src/entities/avatar.entity'
import {TypeOrmModule} from "@nestjs/typeorm"
import { AvatarRepository } from 'src/repositories/avatar.repository'
import { AvatarService } from './avatar.service'
import { AvatarController } from './avatar.controller'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Avatar
    ])
  ],
  providers: [AvatarService, AvatarRepository],
  controllers: [AvatarController]
})
export class AvatarModule {}
