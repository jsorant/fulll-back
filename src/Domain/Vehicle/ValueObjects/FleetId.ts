import { ValueObject } from "../../DddModel/ValueObject";

export class FleetId extends ValueObject {
  public readonly value: string;

  private constructor(value: string) {
    super();
    this.value = value;
    Object.freeze(this);
  }

  static createFrom(id: string) {
    return new FleetId(id);
  }
}
