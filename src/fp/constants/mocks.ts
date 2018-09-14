// tslint:disable-next-line:no-submodule-imports
import * as csvParse from 'csv-parse/lib/sync';
import * as fs from 'fs';
import * as path from 'path';
import { IAirline } from '../interfaces/airline';
import { IFlight } from '../interfaces/flight';
import { IPassenger } from '../interfaces/passenger';
import { IRoute } from '../interfaces/route';
import { ITrip } from '../interfaces/trip';

const airlinesCSV: Array<Array<string>> = csvParse(
  fs.readFileSync(path.join(__dirname, '..', '..', 'data', 'airlines.csv'), 'utf-8'),
);

const airlines: Array<IAirline> = airlinesCSV
  .map((line: Array<string>) => {
    return {
      callsign: line[5],
      company: line[1],
      iataCode: line[3],
      icaoCode: line[4],
      id: `AIRLINE_${line[3]}`,
      lastAppliedEventId: null,
    };
  })
  .filter((airline: IAirline) => airline.iataCode && airline.iataCode !== '-')
  .slice(0, 50);

const flights: Array<IFlight> = airlines.map((airline: IAirline) => {
  const flightNumber: string = `${airline.iataCode}${Math.floor(Math.random() * 9000) + 1000}`;

  return {
    aircraft: 'B77W',
    airlineIATACode: airline.iataCode,
    flightNumber,
    id: `FLIGHT_${flightNumber}`,
    lastAppliedEventId: null,
    numberOfSeats: 358,
  };
});

const routesCSV: Array<Array<string>> = csvParse(
  fs.readFileSync(path.join(__dirname, '..', '..', 'data', 'routes.csv'), 'utf-8'),
);

const routes: Array<IRoute> = routesCSV
  .map((line: Array<string>) => {
    return {
      durationInMinutes: 565,
      fromAirportCode: line[2],
      id: `ROUTE_${line[2]}_${line[4]}`,
      lastAppliedEventId: null,
      toAirportCode: line[4],
    };
  })
  .filter(
    (route: IRoute) =>
      route.fromAirportCode &&
      route.toAirportCode &&
      route.fromAirportCode.length === 3 &&
      route.toAirportCode.length === 3,
  )
  .slice(0, 50);

const passenger: IPassenger = {
  firstName: 'Foo',
  id: 'PASSENGER_ABC123456789',
  lastAppliedEventId: null,
  lastName: 'Bar',
  passportNumber: 'ABC123456789',
};

// const trip1: ITrip = {
// departureDate: new Date(2018, 9 - 1, 20),
// flight: flights[0],
// id: 'TRIP_CPT_DXB_2018_09_20',
// lastAppliedEventId: null,
// numberOfSeatRemaining: flights[0].numberOfSeats,
// route: routes[0],
// };

const trips: Array<ITrip> = routes
  .map((route: IRoute) => {
    return flights.map((flight: IFlight) => {
      const departureDate: Date = getRandomDate(new Date(), new Date(2019, 0, 1));

      return {
        departureDate,
        flight: flights[0],
        id: `TRIP_${route.fromAirportCode}_${
          route.toAirportCode
        }_${departureDate.getFullYear()}_${departureDate.getMonth() +
          1}_${departureDate.getDate()}_${departureDate.getHours()}_${flight.flightNumber}`,
        lastAppliedEventId: null,
        numberOfSeatRemaining: flights[0].numberOfSeats,
        route: routes[0],
      };
    });
  })
  .reduce((a: Array<ITrip>, b: Array<ITrip>) => {
    return a.concat(b);
  });

function getRandomDate(from: Date, to: Date): Date {
  return new Date(from.getTime() + Math.random() * (to.getTime() - from.getTime()));
}

export const MOCKS = {
  airlines,
  flights,
  passengers: [passenger],
  routes,
  trips,
};
