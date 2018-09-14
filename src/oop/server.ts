import * as bodyParser from 'body-parser';
import * as express from 'express';
import { AirlineRoute } from './routes/airlines';

export class Server {
  protected expressApplication: express.Application = null;

  public start(): void {
    this.expressApplication = express();

    this.expressApplication.use(bodyParser.json());

    this.expressApplication.route('/airlines').get(AirlineRoute.get);

    this.expressApplication.listen(3000, () => {
      console.log('listening...');
    });
  }
}
