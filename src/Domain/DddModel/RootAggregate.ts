import { Identifier } from "../SharedKernel/Identifier";
import { Entity } from "./Entity";

export abstract class RootAggregate extends Entity {
  constructor(id?: Identifier) {
    super(id);
  }
}
