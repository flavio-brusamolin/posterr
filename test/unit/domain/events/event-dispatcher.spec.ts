import { DomainEvent } from '../../../../src/domain/events/contracts/domain-event'
import { EventHandler } from '../../../../src/domain/events/contracts/event-handler'
import { EventDispatcher } from '../../../../src/domain/events/event-dispatcher'

const makeDomainEvent = () => {
  class AnyEvent implements DomainEvent {
    dateTimeOccurred: Date
    data: any
  }

  return new AnyEvent()
}

const makeEventHandler = () => {
  class EventHandlerStub implements EventHandler {
    async handle (_event: any): Promise<void> {
      // do nothing
    }
  }

  return new EventHandlerStub()
}

describe('EventDispatcher', () => {
  const eventName = 'AnyEvent'
  const domainEvent = makeDomainEvent()
  const eventHandler = makeEventHandler()

  describe('#register', () => {
    it('should push the received handler to handlers array', () => {
      EventDispatcher.register(eventName, eventHandler)

      expect(EventDispatcher.getHandlers()).toEqual({
        [eventName]: [eventHandler]
      })
    })
  })

  describe('#fire', () => {
    it('should fire the event and execute all handlers', () => {
      const handleSpy = jest.spyOn(eventHandler, 'handle')

      EventDispatcher.fire(domainEvent)

      expect(handleSpy).toHaveBeenCalledWith(domainEvent)
    })
  })
})
