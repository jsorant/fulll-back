import { ValueObject } from "../../DddModel/ValueObject";

export class PlateNumber extends ValueObject {
  public readonly value: string;

  constructor(plateNumber: string) {
    super();
    this.value = Object.freeze(plateNumber);
  }
}
