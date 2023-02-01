import { deepEquals } from "../SharedKernel/DeepEqual";
import { deepCopy } from "../SharedKernel/DeepCopy";

export abstract class ValueObject {
  equals(other: ValueObject): boolean {
    return deepEquals(this, other);
  }

  clone(): any {
    return deepCopy(this);
  }
}
