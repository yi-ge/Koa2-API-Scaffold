import mysql from 'promise-mysql'
import { SystemConfig } from '../config.js'
import { SqlFormat } from '../tool/common_tool.js'

let pool = mysql.createPool({
  // connectionLimit: 4,     // 连接池最多可以创建的连接数
  host: SystemConfig.mysql_host,
  user: SystemConfig.mysql_user,
  password: SystemConfig.mysql_password,
  database: SystemConfig.mysql_database,
  port: SystemConfig.mysql_port,
  insecureAuth: true
})

// 执行一行SQL语句并返回结果
export let query = (sql) => {
  return pool.query(SqlFormat(sql))
}

// 执行多行SQL语句并返回结果
export let querys = (sqls) => {
  let keys = Object.keys(sqls)
  let list = Object.values(sqls)
  let promises = list.map(function (sql) {
    return query(sql)
  })

  return Promise.all(promises).then(data => {
    let result = {}
    for (let index in data) {
      result[keys[index]] = data[index]
    }
    return result
  })
}

// 返回连接
export let getSqlConnection = () => {
  return pool.getConnection().disposer(function (connection) {
    pool.releaseConnection(connection)
  })
}

// 连接使用方法
// var Promise = require("bluebird")
// Promise.using(getSqlConnection(), function(connection) {
//     return connection.query('select `name` from hobbits').then(function(row) {
//         return process(rows)
//     }).catch(function(error) {
//         console.log(error)
//     })
// })
