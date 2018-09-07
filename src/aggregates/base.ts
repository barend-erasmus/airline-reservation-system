import { IEvent } from "../interfaces/event";

export async function hydrate(
    applyEvent: (obj: any, event: IEvent<any>) => Promise<any>,
    getEvent: () => Promise<IEvent<any>>,
    obj: any,
  ): Promise<any> {
    const event: IEvent<any> = await getEvent();
  
    if (!event) {
      return {
        ...obj,
      };
    }
  
    const appliedObj: any = await applyEvent(obj, event);
  
    return hydrate(applyEvent, getEvent, appliedObj);
  }