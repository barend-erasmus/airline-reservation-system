import './app';
import { EventType } from './enums/event-type';
import { subscribeToEventBus } from './event-bus';
import { handleAirlineRegistrationRequestEvent, handleAirlineRegistrationRequestSucceededEvent } from './handlers/airline';
import { handlePassengerRegistrationRequestEvent } from './handlers/passenger';
import { handleTripRegistrationRequestEvent, handleTripSeatReservationRequestEvent } from './handlers/trip';
import { initialize } from './initialize';

(async () => {
  subscribeToEventBus(EventType.AIRLINE_REGISTRATION_REQUEST, handleAirlineRegistrationRequestEvent);

  subscribeToEventBus(EventType.AIRLINE_REGISTRATION_REQUEST_SUCCEEDED, handleAirlineRegistrationRequestSucceededEvent);

  subscribeToEventBus(EventType.PASSENGER_REGISTRATION_REQUEST, handlePassengerRegistrationRequestEvent);

  subscribeToEventBus(EventType.TRIP_REGISTRATION_REQUEST, handleTripRegistrationRequestEvent);

  subscribeToEventBus(EventType.TRIP_SEAT_RESERVATION_REQUEST, handleTripSeatReservationRequestEvent);

  await initialize();
})();
