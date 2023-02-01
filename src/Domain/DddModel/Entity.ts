import { Identifier, IdentifierGenerator } from "../SharedKernel/Identifier";

export abstract class Entity {
  private readonly id: Identifier;

  constructor() {
    this.id = IdentifierGenerator.generate();
  }

  getId(): Identifier {
    return this.id;
  }

  equals(other: Entity): boolean {
    return this.id === other.id;
  }
}
