import { IAggregate } from '../interfaces/aggregate';
import { IEvent } from '../interfaces/event';

export abstract class Aggregate implements IAggregate {
  protected lastAppliedEventId: string = null;

  public applyEvent(event: IEvent<any>): IAggregate {
    this.lastAppliedEventId = event.eventId;

    return this;
  }

  public abstract fromSnapshot(snapshot: any): IAggregate;

  public abstract getId(): string;

  public getLastAppliedEventId(): string {
    return this.lastAppliedEventId;
  }

  public abstract toSnapshot(): any;
}
