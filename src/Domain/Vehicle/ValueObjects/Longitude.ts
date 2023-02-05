import { ValueObject } from "../../DddModel/ValueObject";

export class Longitude extends ValueObject {
  public readonly degrees: number;

  private constructor(degrees: number) {
    super();
    this.degrees = degrees;
    Object.freeze(this);
  }

  static makeFromDegrees(degrees: number) {
    return new Longitude(degrees);
  }
}
