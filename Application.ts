import { CommandLineParser } from "./src/Infra/CommandLine/CommandLineParser";
import { ApplicationBuilder } from "./ApplicationBuilder";

export class Application {
  private parser: CommandLineParser;

  constructor() {
    this.parser = new ApplicationBuilder().buildParser();
  }

  async start(): Promise<void> {
    await this.parser.parse();
  }
}
