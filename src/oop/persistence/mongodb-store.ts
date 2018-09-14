import * as mongodb from 'mongodb';
import { RetryHelper } from '../helpers/retry';

export class MongoStore {
  protected static client: mongodb.MongoClient = null;

  protected static database: mongodb.Db = null;

  public static close(): void {
    this.client.close();
  }

  public static async getCollection(collectionName: string): Promise<mongodb.Collection> {
    if (!MongoStore.client) {
      MongoStore.client = await RetryHelper.retry<mongodb.MongoClient>(() => {
        return mongodb.connect(
          'mongodb+srv://airline-reservation-system:9j8r7YMAQyn^ZmfH@m001-sandbox-5lrbk.mongodb.net/test',
          // 'mongodb://127.0.0.1:27017/test',
          { useNewUrlParser: true },
        );
      });
    }

    if (!MongoStore.database) {
      MongoStore.database = MongoStore.client.db('airline-reservation-system');
    }

    const collection: mongodb.Collection = MongoStore.database.collection(collectionName);

    return collection;
  }
}
