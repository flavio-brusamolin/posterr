import { DomainEvent } from './contracts/domain-event'
import { EventHandler } from './contracts/event-handler'

interface Handlers {
  [eventName: string]: EventHandler[]
}

export class EventDispatcher {
  private static handlers: Handlers = {}

  static register (eventName: string, handler: EventHandler): void {
    if (!this.handlers[eventName]) {
      this.handlers[eventName] = []
    }

    this.handlers[eventName].push(handler)
  }

  static async fire (event: DomainEvent): Promise<void> {
    const eventName = event.constructor.name

    if (this.handlers[eventName]) {
      for (const handler of this.handlers[eventName]) {
        await handler.handle(event)
      }
    }
  }

  static getHandlers (): Handlers {
    return this.handlers
  }
}
