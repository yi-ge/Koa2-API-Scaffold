import Sequelize from 'sequelize'
import { DB as DBConfig, System as SystemConfig } from '../config'

export default new Sequelize(DBConfig.database, DBConfig.username, DBConfig.password, {
  host: DBConfig.host,
  dialect: SystemConfig.db_type,
  pool: {
    max: 50,
    min: 0,
    idle: 10000
  }
})
