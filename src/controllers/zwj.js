export let Post = async function (ctx) {
  console.log(ctx.request.body)
}

export let Get = async function (ctx) {
  ctx.body = '<html>詹文杰' + ctx.query.sex + '</html>'
}
