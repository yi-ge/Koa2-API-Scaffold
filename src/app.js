import Koa2 from 'koa'
import KoaBody from 'koa-body'
import KoaSession from 'koa-session2'
import KoaStatic from 'koa-static2'
import {
  System as SystemConfig
} from './config'
import path from 'path'
import MainRoutes from './routes/main-routes'
import ErrorRoutes from './routes/error-routes'
import PluginLoader from './lib/PluginLoader'

const app = new Koa2()
const env = process.env.NODE_ENV || 'development' // Current mode

app
  .use(KoaBody({
    multipart: true,
    strict: false,
    jsonLimit: '20mb',
    formLimit: '10mb',
    textLimit: '20mb',
    formidable: {
      uploadDir: path.join(__dirname, '../assets/uploads')
    }
  })) // Processing request
  .use(KoaStatic('assets', path.resolve(__dirname, '../assets'))) // Static resource
  .use(KoaSession({
    key: SystemConfig.Session_Key
  })) // Set Session
  .use(PluginLoader(SystemConfig.System_plugin_path))
  .use((ctx, next) => {
    if (ctx.request.header.host.split(':')[0] === 'localhost' || ctx.request.header.host.split(':')[0] === '127.0.0.1') {
      ctx.set('Access-Control-Allow-Origin', '*')
    } else {
      ctx.set('Access-Control-Allow-Origin', SystemConfig.HTTP_server_host)
    }
    ctx.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
    ctx.set('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS')
    ctx.set('Access-Control-Allow-Credentials', true) // 允许带上 cookie
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

app.listen(SystemConfig.API_server_port)

console.log('Now start API server on port ' + SystemConfig.API_server_port + '...')

export default app
