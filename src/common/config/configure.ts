import * as dotenv from 'dotenv'
import * as process from "process"
dotenv.config()

const config = {
  LOCAL: '',
  DATABASE_URL: '',
  DATABASE_TYPE: 'mysql',
  DATABASE_HOST: '',
  DATABASE_NAME: '',
  DATABASE_USER: '',
  DATABASE_PASSWORD: '',
  JWT_SECRET: '',
  REACT_APP_MAPBOX_API_KEYT: '',
  JWT_EXPIRE_TIMET: '',
  TIMEZONE: 'America/Toronto'
}
for (const[k, v] of Object.entries(process.env)) {
  switch (k) {
    case 'LOCAL':
    case 'DATABASE_URL':
    case 'DATABASE_TYPE':
    case 'DATABASE_HOST':
    case 'DATABASE_USER':
    case 'DATABASE_PASSWORD':
    case 'JWT_SECRET':
    case 'REACT_APP_MAPBOX_API_KEYT':
    case 'JWT_EXPIRE_TIMET':
    case 'TIMEZONE':
      config[k] = v
      break
  }
}
export default () => config
export const ServerConfig = config