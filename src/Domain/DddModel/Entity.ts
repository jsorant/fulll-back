export abstract class Entity<TId> {
  public readonly id: TId;

  constructor(id: TId) {
    this.id = Object.freeze(id);
  }

  equals(other: Entity<TId>): boolean {
    return this.id === other.id;
  }
}
