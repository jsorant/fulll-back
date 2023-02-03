import { ValueObject } from "../../DddModel/ValueObject";
import { UniqueIdentifierGenerator } from "../../SharedKernel/UniqueIdentifier";

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
    const id: string = UniqueIdentifierGenerator.generate();
    return new VehicleId(id);
  }
}
