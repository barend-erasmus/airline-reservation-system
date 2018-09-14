import { IAggregate } from './aggregate';
import { IFlight } from './flight';
import { IRoute } from './route';

export interface ITrip extends IAggregate {
  departureDate: Date;

  flight: IFlight;

  route: IRoute;

  numberOfSeatRemaining: number;
}
