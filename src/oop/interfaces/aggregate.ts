import { IEvent } from './event';

export interface IAggregate {
  applyEvent(event: IEvent<any>): IAggregate;

  fromSnapshot(snapShot: any): IAggregate;

  getId(): string;

  getLastAppliedEventId(): string;

  toSnapshot(): any;
}
