import { MikroORM } from '@mikro-orm/core'
import { PostgreSqlDriver } from '@mikro-orm/postgresql'
import { RequestHistory } from '@/entities/RequestHistory'

const orm = await MikroORM.init<PostgreSqlDriver>({
  entities: [RequestHistory],
  dbName: process.env.DB_NAME || 'rest_client',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  migrations: {
    path: './migrations',
    glob: '!(*.d).{js,ts}'
  }
})

export const initializeORM = () => orm
export { orm }