import { IEvent } from '../interfaces/event';
import { IAirline } from '../interfaces/airline';
import { EventType } from '../enums/event-type';
import { hydrateFromEventStore } from '../persistence/event-store';
import { IPassenger } from '../interfaces/passenger';

export async function applyEventToPassenger(passenger: IPassenger, event: IEvent<any>): Promise<IPassenger> {
  switch (event.type) {
    case EventType.PASSENGER_REGISTER_SUCCESS:
      return {
        ...event.payload,
      };
      break;
    default:
      return passenger;
  }
}

export async function hydratePassengerFromEventStore(id: string): Promise<IPassenger> {
  return hydrateFromEventStore(applyEventToPassenger, null, id);
}
