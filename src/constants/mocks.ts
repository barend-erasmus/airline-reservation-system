import { IAirline } from '../interfaces/airline';
import { IRoute } from '../interfaces/route';
import { IFlight } from '../interfaces/flight';
import { IPassenger } from '../interfaces/passenger';

const airline: IAirline = {
  iataCode: 'EK',
  icaoCode: 'UAE',
  callsign: 'EMIRATES',
  company: 'Fly Emirates',
};

const route1: IRoute = {
  fromAirportCode: 'CPT',
  toAirportCode: 'DXB',
  durationInMinutes: 565,
};

const route2: IRoute = {
  fromAirportCode: 'DXB',
  toAirportCode: 'MAD',
  durationInMinutes: 470,
};

const flight1: IFlight = {
  airlineIATACode: 'EK',
  aircraft: 'B77W',
  flightNumber: 'EK771',
  numberOfSeats: 358,
};

const flight2: IFlight = {
  airlineIATACode: 'EK',
  aircraft: 'A388',
  flightNumber: 'EK141',
  numberOfSeats: 489,
};

const passenger: IPassenger = {
  firstName: 'Foo',
  lastName: 'Bar',
  passportNumber: 'ABC123456789',
};

export const MOCKS = {
  airlines: [airline],
  routes: [route1, route2],
  flights: [flight1, flight2],
  passengers: [passenger],
};
