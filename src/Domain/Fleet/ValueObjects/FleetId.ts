import { ValueObject } from "../../DddModel/ValueObject";

export class FleetId extends ValueObject {
  public readonly value: string;

  constructor(value: string) {
    super();
    this.value = Object.freeze(value);
  }
}
