import path from 'path'

export let SystemConfig = {
  HTTP_server_type: 'http://', // HTTP服务器地址,包含"http://"或"https://"
  HTTP_server_host: 'localhost', // HTTP服务器地址,请勿添加"http://"
  HTTP_server_port: '3000', // HTTP服务器端口号
  System_country: 'zh-cn', // 所在国家的国家代码
  System_plugin_path: path.join(__dirname, '../src/plugins'), // 插件路径
  Session_Key: 'RESTfulAPI', // 生产环境务必随机设置一个值
  mysql_host: 'localhost', // MySQL服务器地址
  mysql_user: 'root', // 数据库用户名
  mysql_password: 'root', // 数据库密码
  mysql_database: 'test', // 数据库名称
  mysql_port: 3306, // 数据库端口号
  mysql_prefix: 'api_' // 默认"api_"
}

export let SendEmail = {
  service: 'smtp.abcd.com', // SMTP服务提供商域名
  username: 'postmaster%40abcd.com', // 用户名/用户邮箱
  password: 'password', // 邮箱密码
  sender_address: '"XX平台 👥" <postmaster@abcd.com>'
}
