import { JoiAdapter } from '../../../adapters/joi-adapter'
import joi from 'joi'

export const makeCreateRepostValidator = (): JoiAdapter => {
  const schema = joi.object({
    headers: joi.object({
      'user-id': joi.string().required().uuid()
    }),
    params: joi.object({
      postId: joi.string().required().uuid()
    }),
    body: joi.object({
      comment: joi.string()
    })
  })

  return new JoiAdapter(schema)
}
