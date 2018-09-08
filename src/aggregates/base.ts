import { IEvent } from '../interfaces/event';

export async function hydrate(
  applyEvent: (obj: any, event: IEvent<any>) => Promise<any>,
  obj: any,
  getEvent: () => Promise<IEvent<any>>,
): Promise<any> {
  const event: IEvent<any> = await getEvent();

  if (!event) {
    return obj
      ? {
          ...obj,
        }
      : null;
  }

  const appliedObj: any = await applyEvent(obj, event);

  return hydrate(applyEvent, appliedObj, getEvent);
}
