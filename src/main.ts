import * as R from 'ramda';
import { publishEvent, getCollectionBuilder, hydrateFromEventStore } from './persistence/event-store';
import { MOCKS } from './constants/mocks';
import { IAirline } from './interfaces/airline';
import { EventType } from './enums/event-type';
import { IEvent } from './interfaces/event';
import { handleAirlineRegisterEvent } from './handlers/airline';
import { hydrate } from './aggregates/base';
import { applyEventToAirline } from './aggregates/airline';

function getEventHandlers(
  handleAirlineRegisterEvent: (events: Array<IEvent<any>>, event: IEvent<any>) => Promise<void>,
): {} {
  const obj: {} = {};

  obj[EventType.AIRLINE_REGISTER] = handleAirlineRegisterEvent;

  return obj;
}

const airline: IAirline = MOCKS.airlines[0];

// publishEvent(getCollectionBuilder(), getEventHandlers(handleAirlineRegisterEvent), {
//   id: airline.iataCode,
//   type: EventType.AIRLINE_REGISTER,
//   payload: airline,
// });

hydrateFromEventStore(getCollectionBuilder(), R.curry(hydrate)(applyEventToAirline), airline.iataCode).then(
  (airline: IAirline) => {
    console.log(airline);
  },
);
