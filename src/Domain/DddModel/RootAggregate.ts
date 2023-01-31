import { Entity } from "./entity";

export abstract class RootAggregate<TId> extends Entity<TId> {
  constructor(id: TId) {
    super(id);
  }
}
