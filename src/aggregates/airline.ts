import { IEvent } from '../interfaces/event';
import { IAirline } from '../interfaces/airline';
import { EventType } from '../enums/event-type';

export async function applyEventToAirline(airline: IAirline, event: IEvent<any>): Promise<IAirline> {
  switch (event.type) {
    case EventType.AIRLINE_REGISTER:
      return {
        ...event.payload,
      };
    default:
      return airline;
  }
}
