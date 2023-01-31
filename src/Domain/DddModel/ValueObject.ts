import { deepEquals } from "../SharedKernel/DeepEqual";

export abstract class ValueObject {
  equals(other: ValueObject): boolean {
    return deepEquals(this, other);
  }
}
