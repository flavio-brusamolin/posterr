import { FromOption } from '../../../../domain/enums/from-option'
import { JoiAdapter } from '../../../adapters/joi-adapter'
import joi from 'joi'

export const makeLoadPostsValidator = (): JoiAdapter => {
  const schema = joi.object({
    headers: joi.object({
      'user-id': joi.string().required().uuid()
    }),
    query: joi.object({
      from: joi.string().valid(...Object.values(FromOption))
    })
  })

  return new JoiAdapter(schema)
}
