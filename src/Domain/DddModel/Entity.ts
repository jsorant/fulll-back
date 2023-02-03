export abstract class Entity<TId> {
  public readonly id: TId;

  constructor(id: TId) {
    this.id = id;
  }

  equals(other: Entity<TId>): boolean {
    return this.id === other.id;
  }
}
