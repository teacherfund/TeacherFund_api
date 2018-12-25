import Koa from 'koa'
import helmet from 'koa-helmet'
import bodyparser from 'koa-bodyparser'
import enforceSsl from 'koa-sslify'
import router from './router'

const app = new Koa()

if (process.env.NODE_ENV === 'production') {
  app.use(enforceSsl({
    trustProtoHeader: true
  }))
}
app.use(helmet())
app.use(bodyparser())
app.use(router.routes())
app.use(router.allowedMethods())

app.listen(process.env.PORT || 3000)
