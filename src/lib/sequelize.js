import Sequelize from 'sequelize'
import { SystemConfig } from '../config'

export default new Sequelize(SystemConfig.mysql_database, SystemConfig.mysql_user, SystemConfig.mysql_password, {
  host: SystemConfig.mysql_host,
  dialect: 'mysql',
  pool: {
    max: 50,
    min: 0,
    idle: 10000
  }
})
