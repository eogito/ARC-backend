import { TypeOrmModuleOptions } from "@nestjs/typeorm"
import { DataSource, DataSourceOptions } from "typeorm"

export const getTypeOrmModuleOptions = (): TypeOrmModuleOptions => {
  const dbOptions = {
    synchronize: false,
    autoLoadEntities: true,
    entities: [
      __dirname + '/../../entities/*.entity.ts}'
    ]
  }

  Object.assign(dbOptions, {
    type: process.env.DATABASE_TYPE,
    url: process.env.DATABASE_URL
  })
  return dbOptions
}

export const getDataSourceOptions = (): DataSourceOptions => {
  const options: DataSourceOptions = { ...getTypeOrmModuleOptions() } as DataSourceOptions
  return options
}

export default new DataSource(getDataSourceOptions())
