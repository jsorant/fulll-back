import { Identifier, IdentifierGenerator } from "../SharedKernel/Identifier";

export abstract class Entity {
  private readonly id: Identifier;

  constructor(id?: Identifier) {
    if (id) {
      this.id = id;
    } else {
      this.id = IdentifierGenerator.generate();
    }
  }

  getId(): Identifier {
    return this.id;
  }

  equals(other: Entity): boolean {
    return this.id === other.id;
  }
}
