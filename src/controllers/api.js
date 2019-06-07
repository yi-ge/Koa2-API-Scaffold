export const Get = (ctx, next) => {
  ctx.body = {
    result: 'get',
    name: ctx.params.name,
    para: ctx.query
  }

  next()
}

export const Post = async (ctx, next) => {
  ctx.body = {
    result: 'post',
    name: ctx.params.name,
    para: ctx.request.body
  }

  next()
}

export const Put = (ctx, next) => {
  ctx.body = {
    result: 'put',
    name: ctx.params.name,
    para: ctx.request.body
  }

  next()
}

export const Delete = (ctx, next) => {
  ctx.body = {
    result: 'delete',
    name: ctx.params.name,
    para: ctx.request.body
  }

  next()
}
