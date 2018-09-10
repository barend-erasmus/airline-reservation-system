import { IAirline } from '../interfaces/airline';
import { IFlight } from '../interfaces/flight';
import { IPassenger } from '../interfaces/passenger';
import { IRoute } from '../interfaces/route';
import { ITrip } from '../interfaces/trip';

const airline: IAirline = {
  id: 'AIRLINE_EK',
  iataCode: 'EK',
  icaoCode: 'UAE',
  callsign: 'EMIRATES',
  company: 'Fly Emirates',
  lastAppliedEventId: null,
};

const route1: IRoute = {
  id: 'ROUTE_CPT_DXB',
  fromAirportCode: 'CPT',
  toAirportCode: 'DXB',
  durationInMinutes: 565,
  lastAppliedEventId: null,
};

const route2: IRoute = {
  id: 'ROUTE_DBX_MAD',
  fromAirportCode: 'DXB',
  toAirportCode: 'MAD',
  durationInMinutes: 470,
  lastAppliedEventId: null,
};

const flight1: IFlight = {
  id: 'FLIGHT_EK771',
  airlineIATACode: 'EK',
  aircraft: 'B77W',
  flightNumber: 'EK771',
  numberOfSeats: 358,
  lastAppliedEventId: null,
};

const flight2: IFlight = {
  id: 'FLIGHT_EK141',
  airlineIATACode: 'EK',
  aircraft: 'A388',
  flightNumber: 'EK141',
  numberOfSeats: 489,
  lastAppliedEventId: null,
};

const passenger: IPassenger = {
  id: 'PASSENGER_ABC123456789',
  firstName: 'Foo',
  lastName: 'Bar',
  passportNumber: 'ABC123456789',
  lastAppliedEventId: null,
};

const trip1: ITrip = {
  id: 'TRIP_CPT_DXB_2018_09_20',
  departureDate: new Date(2018, 9 - 1, 20),
  route: route1,
  flight: flight1,
  numberOfSeatRemaining: flight1.numberOfSeats,
  lastAppliedEventId: null,
};

export const MOCKS = {
  airlines: [airline],
  routes: [route1, route2],
  flights: [flight1, flight2],
  passengers: [passenger],
  trips: [trip1],
};
