import KoaRouter from 'koa-router'
// import controllers from '../controllers/index.js'

const router = new KoaRouter()

router
  .get('/', function (ctx, next) {
    ctx.body = '禁止访问！'
  }) // HOME 路由
  // .get('/api/:api_type/:name', controllers.api.api_get)
  // .put('/api/:api_type/:name', controllers.api_put.api_put
  // .post('/api/:api_type/:name', controllers.api.default)
  // .delect('/api/:api_type/:name', controllers.api.default)

module.exports = router
