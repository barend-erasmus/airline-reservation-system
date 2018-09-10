import * as bodyParser from 'body-parser';
import * as express from 'express';
import { hydrateTrip } from './aggregates/trip';
import { EventType } from './enums/event-type';
import { publishToEventBus } from './event-bus';
import { ITrip } from './interfaces/trip';

const expressApplication: express.Application = express();

expressApplication.use(bodyParser.json());

expressApplication.route('/trip/seat/reserve').post(async (request: express.Request, response: express.Response) => {
  await publishToEventBus({
    eventId: null,
    aggregateId: request.body.id,
    type: EventType.TRIP_SEAT_RESERVATION_REQUEST,
    payload: {
      passengerId: request.body.passengerId,
    },
  });

  response.json('OK');
});

expressApplication.route('/trip').get(async (request: express.Request, response: express.Response) => {
  const trip: ITrip = await hydrateTrip(request.query.id);

  response.json(trip);
});

expressApplication.listen(3000, () => {
  console.log('listening...');
});
