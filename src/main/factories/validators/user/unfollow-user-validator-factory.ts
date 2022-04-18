import { JoiAdapter } from '../../../adapters/joi-adapter'
import joi from 'joi'

export const makeUnfollowUserValidator = (): JoiAdapter => {
  const schema = joi.object({
    headers: joi.object({
      'user-id': joi.string().required().uuid()
    }),
    params: joi.object({
      userId: joi.string().required().uuid()
    })
  })

  return new JoiAdapter(schema)
}
