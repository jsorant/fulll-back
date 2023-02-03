import { ValueObject } from "../../DddModel/ValueObject";
import { IdentifierGenerator } from "../../SharedKernel/Identifier";

export class VehicleId extends ValueObject {
  public readonly value: string;

  private constructor(value: string) {
    super();
    this.value = value;
    Object.freeze(this);
  }

  static createFrom(id: string) {
    return new VehicleId(id);
  }

  static createNew() {
    const id: string = IdentifierGenerator.generate();
    return new VehicleId(id);
  }
}
