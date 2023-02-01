import { Query } from "../../CqrsModel/Query";

export class GetFleet implements Query {
  readonly userId: string;

  constructor(userId: string) {
    this.userId = userId;
  }
}
