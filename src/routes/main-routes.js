import KoaRouter from 'koa-router'
import controllers from '../controllers/index.js'

const router = new KoaRouter()

router
  .get('/', function (ctx, next) {
    ctx.body = '禁止访问！'
  }) // HOME 路由
  .all('/upload', controllers.upload.upload.array('file'), function (ctx, next) {   // 上传到本地示例
    return new Promise(function (resolve, reject) {
      // 允许跨域，正式环境要改为对应域名
      ctx.set('Access-Control-Allow-Origin', '*')
      // ctx.req.files.filename = ctx.req.files.path
      resolve(ctx.body = ctx.req.files)
    })
  })
  .get('/api/:name', controllers.api.Get)
  .post('/api/:name', controllers.api.Post)
  .put('/api/:name', controllers.api.Put)
  .del('/api/:name', controllers.api.Delect)

module.exports = router
