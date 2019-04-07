import Koa from 'koa'
import helmet from 'koa-helmet'
import bodyparser from 'koa-bodyparser'
import enforceSsl from 'koa-sslify'
const logger = require('koa-logger')
const cors = require('@koa/cors');
import router from './router'
const mysqlModels = require('./models')

const setup = async () => {
  try {
    await mysqlModels.sequelize.sync()
    // await mysqlModels.sequelize.sync({ force: true })
    const app = new Koa()

    app.use(cors())
    app.use(logger())
    app.use(helmet())

    if (process.env.NODE_ENV === 'production') {
      app.use(enforceSsl({
        trustProtoHeader: true
      }))
    }

    const port = process.env.NODE_ENV === 'production' ? 80 : 3000
    console.log('PORT', port)
    app.use(bodyparser())
    app.use(router.routes())
    app.use(router.allowedMethods())
    app.listen(port)
  } catch (e) {
    console.log(e)
  }
}

setup()
