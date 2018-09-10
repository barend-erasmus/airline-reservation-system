import { initialize } from './initialize';
import { subscribeToEventBus, publishToEventBus } from './event-bus';
import { EventType } from './enums/event-type';
import { handleAirlineRegisterRequestEvent } from './handlers/airline';
import { handleTripSeatReserveRequestEvent, handleTripRegisterRequestEvent } from './handlers/trip';
import { handlePassengerRegisterRequestEvent } from './handlers/passenger';
import './app';

(async () => {
  subscribeToEventBus(EventType.AIRLINE_REGISTER_REQUEST, handleAirlineRegisterRequestEvent);

  subscribeToEventBus(EventType.PASSENGER_REGISTER_REQUEST, handlePassengerRegisterRequestEvent);

  subscribeToEventBus(EventType.TRIP_REGISTER_REQUEST, handleTripRegisterRequestEvent);

  subscribeToEventBus(EventType.TRIP_SEAT_RESERVE_REQUEST, handleTripSeatReserveRequestEvent);

  await initialize();
})();
