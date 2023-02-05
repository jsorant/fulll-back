import { FleetController } from "./src/Infra/Fleet/FleetController";
import { CommandLineParser } from "./src/Infra/Fleet/CommandLine/CommandLineParser";
import { Persistence } from "./src/Infra/Fleet/Persistence/Persistence";
import { Sqlite3Persistence } from "./src/Infra/Fleet/Persistence/SqlLite3/Sqlite3Persistence";

export class ApplicationBuilder {
  buildParser(): CommandLineParser {
    const persistence: Persistence = this.buildPersistence();
    const controller: FleetController = this.buildController(persistence);
    return new CommandLineParser(controller);
  }

  private buildPersistence(): Persistence {
    // TODO: could be switch by an ENV variable in a dedicated class
    // TODO: Read database file path from ENV
    return new Sqlite3Persistence("fleets.db");
  }

  private buildController(persistence: Persistence): FleetController {
    return new FleetController(
      persistence.getFleetsRepository(),
      persistence.getVehiclesRepository(),
      persistence.getFleetProjections(),
      persistence.getLocationProjections()
    );
  }
}
