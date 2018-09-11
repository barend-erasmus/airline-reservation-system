import * as mongodb from 'mongodb';
import { COLLECTIONS } from '../constants/collections';
import { IAirlineReadModel } from '../interfaces/airline-read-model';
import { getCollection } from '../persistence/event-store';

export async function readModelListAirlines(): Promise<Array<IAirlineReadModel>> {
  const collection: mongodb.Collection = await getCollection(COLLECTIONS.AIRLINE);

  const documents: Array<any> = await collection.find({}).toArray();

  return documents.map((document: IAirlineReadModel) => {
    return {
      callsign: document.callsign,
      company: document.company,
      iataCode: document.iataCode,
      icaoCode: document.icaoCode,
    };
  });
}
