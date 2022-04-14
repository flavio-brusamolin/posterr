import express from 'express'
import env from './config/env'
import setupMiddlewares from './config/middlewares'
import setupRoutes from './config/routes'
import MongoHelper from '../infrastructure/database/mongo/helpers/mongo-helper'

class Server {
  private async initDatabase (): Promise<void> {
    await MongoHelper.connect(env.mongoUrl)
  }

  private initApplication (): void {
    const app = express()

    setupMiddlewares(app)
    setupRoutes(app)

    app.listen(env.port, () => console.log(`Server running at http://localhost:${env.port}`))
  }

  async start (): Promise<void> {
    try {
      await this.initDatabase()
      this.initApplication()
    } catch (error) {
      console.error(error)
    }
  }
}

new Server().start()
