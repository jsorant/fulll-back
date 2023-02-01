export type Identifier = string;

export class IdentifierGenerator {
  private static count: number = 0;

  static generate(): Identifier {
    this.count++;
    return this.count.toString();
  }
}
