import { JoiAdapter } from '../../../adapters/joi-adapter'
import joi from 'joi'

export const makeCreateRegularPostValidator = (): JoiAdapter => {
  const schema = joi.object({
    headers: joi.object({
      'user-id': joi.string().required().uuid()
    }),
    body: joi.object({
      content: joi.string().required().max(777)
    })
  })

  return new JoiAdapter(schema)
}
