import { EventType } from '../enums/event-type';
import { IAirlineRegistrationRequestEvent } from '../events/airline-registration-request';
import { IAirlineUpdateRequestEvent } from '../events/airline-update-request';
import { IAggregate } from '../interfaces/aggregate';
import { IEvent } from '../interfaces/event';
import { Aggregate } from './base';

export class Airline extends Aggregate {
  constructor(public iataCode: string, public icaoCode: string, public callsign: string, public company: string) {
    super();
  }

  public applyEvent(event: IEvent<any>): IAggregate {
    switch (event.type) {
      case EventType.AIRLINE_REGISTRATION_REQUEST_SUCCEEDED:
        this.iataCode = (event as IAirlineRegistrationRequestEvent).payload.iataCode;
        this.icaoCode = (event as IAirlineRegistrationRequestEvent).payload.icaoCode;
        this.callsign = (event as IAirlineRegistrationRequestEvent).payload.callsign;
        this.company = (event as IAirlineRegistrationRequestEvent).payload.company;
        break;
      case EventType.AIRLINE_UPDATE_REQUEST_SUCCEEDED:
        this.iataCode = (event as IAirlineUpdateRequestEvent).payload.iataCode;
        this.icaoCode = (event as IAirlineUpdateRequestEvent).payload.icaoCode;
        this.callsign = (event as IAirlineUpdateRequestEvent).payload.callsign;
        this.company = (event as IAirlineUpdateRequestEvent).payload.company;
        break;
    }

    return super.applyEvent(event);
  }

  public fromSnapshot(snapshot: any): IAggregate {
    this.iataCode = snapshot.iataCode;
    this.icaoCode = snapshot.icaoCode;
    this.callsign = snapshot.callsign;
    this.company = snapshot.company;

    return this;
  }

  public getId(): string {
    if (!this.iataCode) {
      return null;
    }

    return `AIRLINE_${this.iataCode}`;
  }

  public toSnapshot(): any {
    return this;
  }
}
