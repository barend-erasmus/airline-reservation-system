import { IAirline } from '../interfaces/airline';
import { IFlight } from '../interfaces/flight';
import { IPassenger } from '../interfaces/passenger';
import { IRoute } from '../interfaces/route';
import { ITrip } from '../interfaces/trip';

const airline: IAirline = {
  callsign: 'EMIRATES',
  company: 'Fly Emirates',
  iataCode: 'EK',
  icaoCode: 'UAE',
  id: 'AIRLINE_EK',
  lastAppliedEventId: null,
};

const route1: IRoute = {
  durationInMinutes: 565,
  fromAirportCode: 'CPT',
  id: 'ROUTE_CPT_DXB',
  lastAppliedEventId: null,
  toAirportCode: 'DXB',
};

const route2: IRoute = {
  durationInMinutes: 470,
  fromAirportCode: 'DXB',
  id: 'ROUTE_DBX_MAD',
  lastAppliedEventId: null,
  toAirportCode: 'MAD',
};

const flight1: IFlight = {
  aircraft: 'B77W',
  airlineIATACode: 'EK',
  flightNumber: 'EK771',
  id: 'FLIGHT_EK771',
  lastAppliedEventId: null,
  numberOfSeats: 358,
};

const flight2: IFlight = {
  aircraft: 'A388',
  airlineIATACode: 'EK',
  flightNumber: 'EK141',
  id: 'FLIGHT_EK141',
  lastAppliedEventId: null,
  numberOfSeats: 489,
};

const passenger: IPassenger = {
  firstName: 'Foo',
  id: 'PASSENGER_ABC123456789',
  lastAppliedEventId: null,
  lastName: 'Bar',
  passportNumber: 'ABC123456789',
};

const trip1: ITrip = {
  departureDate: new Date(2018, 9 - 1, 20),
  flight: flight1,
  id: 'TRIP_CPT_DXB_2018_09_20',
  lastAppliedEventId: null,
  numberOfSeatRemaining: flight1.numberOfSeats,
  route: route1,
};

export const MOCKS = {
  airlines: [airline],
  flights: [flight1, flight2],
  passengers: [passenger],
  routes: [route1, route2],
  trips: [trip1],
};
