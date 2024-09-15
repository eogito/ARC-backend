import { Module } from '@nestjs/common'
import {ConfigModule, ConfigService } from "@nestjs/config"
import { TypeOrmModule} from "@nestjs/typeorm"
import { DataSource } from 'typeorm'

import { AppController } from './app.controller'
import { AppService } from './app.service'
import configure from './common/config/configure'
import { getTypeOrmModuleOptions } from './common/config/database.config'
import { AuthModule } from './modules/auth/auth.module'
import { AvatarModule } from './modules/avatar/avatar.module'
import { BookModule } from './modules/book/book.module'
import { BookProgressModule } from './modules/bookProgress/bookProgress.module'
import { ParentModule } from './modules/parent/parent.module'
import { UserModule } from './modules/user/user.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configure],
      isGlobal: true
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        ...getTypeOrmModuleOptions()
      }),
      dataSourceFactory: async (options) => {
        const dataSource = await new DataSource(options).initialize()
        return dataSource
      }
    }),
    AuthModule,
    AvatarModule,
    BookModule,
    BookProgressModule,
    ParentModule,
    UserModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
