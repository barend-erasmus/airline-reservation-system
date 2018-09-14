import * as mongodb from 'mongodb';
import { COLLECTIONS } from '../constants/collections';
import { ITripReadModel } from '../interfaces/trip-read-model';
import { getCollection } from '../persistence/event-store';

export async function readModelListTrips(): Promise<Array<ITripReadModel>> {
  const collection: mongodb.Collection = await getCollection(COLLECTIONS.TRIP);

  const documents: Array<any> = await collection.find({}).toArray();

  return documents.map((document: ITripReadModel) => {
    return {
      departureDate: document.departureDate,
      flight: document.flight,
      id: document.id,
      numberOfSeatRemaining: document.numberOfSeatRemaining,
      route: document.route,
    };
  });
}
