import { IAggregate } from './aggregate';

export interface IRoute extends IAggregate {
  fromAirportCode: string;
  toAirportCode: string;

  durationInMinutes: number;
}
