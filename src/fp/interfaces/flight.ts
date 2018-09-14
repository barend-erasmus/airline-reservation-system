import { IAggregate } from './aggregate';

export interface IFlight extends IAggregate {
  airlineIATACode: string;

  flightNumber: string;
  aircraft: string;

  numberOfSeats: number;
}
