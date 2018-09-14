import { Airline } from '../aggregates/airline';

export class AirlineReadModel {
  public async list(): Promise<Array<Airline>> {
    return [];
  }
}
