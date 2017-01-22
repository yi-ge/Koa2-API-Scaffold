import path from 'path'

export let SystemConfig = {
    HTTP_server_type: 'http://', // HTTP服务器地址,包含"http://"或"https://"
    HTTP_server_host: 'localhost',// HTTP服务器地址,请勿添加"http://"
    HTTP_server_port: '3000',// HTTP服务器端口号
    System_country: 'zh-cn', // 所在国家的国家代码
    System_plugin_path: path.join(__dirname, "plugins/"), // 插件路径
    mysql_host: 'localhost', // MySQL服务器地址
    mysql_user: 'root', // 数据库用户名
    mysql_password: 'root', // 数据库密码
    mysql_database: 'test', // 数据库名称
    mysql_port: 3306, // 数据库端口号
    mysql_prefix: 'api_' // 默认"api_"
}
