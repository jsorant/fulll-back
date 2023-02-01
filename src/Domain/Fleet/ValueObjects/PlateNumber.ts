import { ValueObject } from "../../DddModel/ValueObject";

export class PlateNumber extends ValueObject {
  public readonly value: string;

  constructor(value: string) {
    super();
    this.value = value;
    Object.freeze(this);
  }

  toString(): string {
    return this.value;
  }
}
