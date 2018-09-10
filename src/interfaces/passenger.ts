import { IAggregate } from './aggregate';

export interface IPassenger extends IAggregate {
  firstName: string;
  lastName: string;
  passportNumber: string;
}
