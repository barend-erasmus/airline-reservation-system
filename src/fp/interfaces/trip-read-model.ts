import { IFlight } from './flight';
import { IRoute } from './route';

export interface ITripReadModel {
  id: string;

  departureDate: Date;

  flight: IFlight;

  route: IRoute;

  numberOfSeatRemaining: number;
}
