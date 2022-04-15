import { EventName } from '../../domain/enums/event-name'
import { EventDispatcher } from '../../domain/events/event-dispatcher'
import { makeUpdateUserWhenPostCreatedHandler } from '../factories/event-handlers/update-user-when-post-created-handler-factory'

export default (): void => {
  EventDispatcher.register(EventName.POST_CREATED_EVENT, makeUpdateUserWhenPostCreatedHandler())
}
