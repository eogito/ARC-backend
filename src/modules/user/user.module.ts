import { Module } from '@nestjs/common'
import { User } from 'src/entities/user.entity'
import {TypeOrmModule} from "@nestjs/typeorm"
import { UserRepository } from 'src/repositories/user.repository'
import { UserService } from './user.service'
import { UserController } from './user.controller'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User
    ])
  ],
  providers: [UserService, UserRepository],
  exports: [UserService],
  controllers: [UserController]
})
export class UserModule {}
