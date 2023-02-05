import { ValueObject } from "../../DddModel/ValueObject";

export class Altitude extends ValueObject {
  public readonly meters: number;

  constructor(meters: number) {
    super();
    this.meters = meters;
    Object.freeze(this);
  }

  static makeFromMeters(meters: number) {
    return new Altitude(meters);
  }
}
