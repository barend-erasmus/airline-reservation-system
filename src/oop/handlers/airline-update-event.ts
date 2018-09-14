import { Airline } from '../aggregates/airline';
import { EventType } from '../enums/event-type';
import { IAirlineUpdateRequestEvent } from '../events/airline-update-request';
import { IEventHandler } from '../interfaces/event-handler';
import { EventBus } from '../persistence/event-bus';
import { EventStore } from '../persistence/event-store';

export class AirlineRegistrationRequestEventHandler implements IEventHandler {
  constructor(protected eventStore: EventStore) {}

  public async handle(eventBus: EventBus, event: IAirlineUpdateRequestEvent): Promise<void> {
    const existingAirline: Airline = await this.eventStore.hydrate<Airline>(new Airline(null, null, null, null), event.aggregateId);

    if (!existingAirline) {
      await eventBus.publish({
        aggregateId: event.aggregateId,
        eventId: null,
        payload: event.payload,
        type: EventType.AIRLINE_UPDATE_REQUEST_FAILED,
      });

      return;
    }

    await eventBus.publish({
      aggregateId: event.aggregateId,
      eventId: null,
      payload: event.payload,
      type: EventType.AIRLINE_UPDATE_REQUEST_SUCCEEDED,
    });
  }
}
