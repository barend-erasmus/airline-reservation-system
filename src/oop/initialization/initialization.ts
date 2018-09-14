// tslint:disable-next-line:no-submodule-imports
import * as csvParse from 'csv-parse/lib/sync';
import * as fs from 'fs';
import * as path from 'path';
import { Airline } from '../aggregates/airline';
import { EventType } from '../enums/event-type';
import { EventBus } from '../persistence/event-bus';

export class Initialization {
  public static async executeAirlines(eventBus: EventBus): Promise<void> {
    const airlinesCSV: Array<Array<string>> = csvParse(
      fs.readFileSync(path.join(__dirname, '..', '..', '..', 'data', 'airlines.csv'), 'utf-8'),
    );

    const airlines: Array<Airline> = airlinesCSV
      .map((line: Array<string>) => {
        return new Airline(line[3], line[4], line[5], line[1]);
      })
      .filter((airline: Airline) => airline.iataCode && airline.iataCode !== '-').slice(0, 50);

    for (const airline of airlines) {
      await eventBus.publish({
        aggregateId: airline.getId(),
        eventId: null,
        payload: airline.toSnapshot(),
        type: EventType.AIRLINE_REGISTRATION_REQUEST,
      });
    }
  }
}
