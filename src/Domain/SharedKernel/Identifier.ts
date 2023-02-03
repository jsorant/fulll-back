export class IdentifierGenerator {
  private static count: number = 0;

  static generate(): string {
    this.count++;
    return this.count.toString();
  }
}
