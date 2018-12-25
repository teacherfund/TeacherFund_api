const Sequelize = require('sequelize')
const path = require('path')
const fs = require('fs')

const host = (typeof process.env.MYSQL_HOST === 'undefined') ? 'localhost' : process.env.MYSQL_HOST
const username = (typeof process.env.MYSQL_USERNAME === 'undefined') ? 'root' : process.env.MYSQL_USERNAME
const password = (typeof process.env.MYSQL_PASSWORD === 'undefined') ? '' : process.env.MYSQL_PASSWORD
const database = (typeof process.env.MYSQL_DB === 'undefined') ? 'teacherfund' : process.env.MYSQL_DB

class Database {
  private models:{[index: string]: any} = {}
  connection: any = {}
  sequelize: any = {}
  constructor (
    sequelize: any,
    connection: any
  ) {
    this.sequelize = sequelize
    this.connection = connection
  }

  addModel (model: any) {
    this.models[model.name] = model
  }

  getModel (modelName: string) {
    return this.models[modelName]
  }
}

const connection = new Sequelize(database, username, password, {
  host,
  dialect: 'mysql',
  dialectOptions: {
    ssl: false
  },
  operatorsAliases: false,
  logging: process.env.NODE_ENV === 'production' ? false : console.log,
  pool: { max: 5, min: 0, idle: 10000 }
})

const db = new Database(Sequelize, connection)

fs.readdirSync(__dirname).filter((file: any) => {
  return (file.indexOf('.') !== 0) && (file !== 'index.js')
}).forEach((file: any) => {
  let model = connection.import(path.join(__dirname, file))
  db.addModel(model)
})

Object.keys(db).forEach((modelName) => {
  if ('associate' in db.getModel(modelName)) {
    db.getModel(modelName).associate(db)
  }
})

module.exports = db
