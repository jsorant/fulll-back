import { Entity } from "./Entity";

export abstract class RootAggregate<TId> extends Entity<TId> {
  constructor(id: TId) {
    super(id);
  }
}
