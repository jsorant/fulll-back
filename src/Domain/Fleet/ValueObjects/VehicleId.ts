import { ValueObject } from "../../DddModel/ValueObject";

export class VehicleId extends ValueObject {
  public readonly value: string;

  constructor(value: string) {
    super();
    this.value = value;
    Object.freeze(this);
  }

  static createFrom(value: string) {
    return new VehicleId(value);
  }
}
