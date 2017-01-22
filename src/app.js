import Koa2 from 'koa'
import KoaBodyParser from 'koa-bodyparser'
import KoaSession from 'koa-session2'
import KoaStatic from 'koa-static2'
import { SystemConfig } from '../config/main.js'
import path from 'path'

import MainRoutes from './routes/main-routes'
import ErrorRoutes from './routes/error-routes'
import PluginLoader from './tool/PluginLoader'

const app = new Koa2()
const BodyParser = new KoaBodyParser()
const env = process.env.NODE_ENV || 'development' // Current mode

app.use(BodyParser({
  detectJSON: function (ctx) {
    return /\.json$/i.test(ctx.path)
  },
  extendTypes: {
    json: ['application/x-javascript'] // will parse application/x-javascript type body as a JSON string
  },
  onerror: function (err, ctx) {
    ctx.throw('body parse error:' + err, 422)
  }
}))  // Processing request
.use(KoaStatic('assets', path.resolve(__dirname, '../assets'))) // Static resource
.use(KoaSession({key: 'RESTfulAPI'})) // Set Session 生产环境务必随机设置一个值
.use(PluginLoader(SystemConfig.System_plugin_path))
.use((ctx, next) => {
  if (ctx.request.header.host.split(':')[0] === 'api.XXX.com' || ctx.request.header.host.split(':')[0] === '127.0.0.1') {
    ctx.set('Access-Control-Allow-Origin', '*')
    ctx.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
    ctx.set('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS')
    ctx.set('Access-Control-Allow-Credentials', true) // 允许带上 cookie
  }
  return next()
})
.use(MainRoutes.routes())
.use(MainRoutes.allowedMethods())
.use(ErrorRoutes())

if (env === 'development') { // logger
  app.use((ctx, next) => {
    const start = new Date()
    return next().then(() => {
      const ms = new Date() - start
      console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
    })
  })
}

app.listen(SystemConfig.HTTP_server_port)

console.log('Now start HTTP server on port ' + SystemConfig.HTTP_server_port + '...')

export default app
