import { FleetsRepository } from "../../../../App/Commands/Ports/FleetsRepository";
import { VehiclesRepository } from "../../../../App/Commands/Ports/VehiclesRepository";
import { FleetProjections } from "../../../../App/Queries/Ports/FleetProjections";
import { LocationProjections } from "../../../../App/Queries/Ports/LocationProjections";
import { Persistence } from "../Persistence";
import { Sqlite3Database } from "./Sqlite3Database";
import { Table } from "./Tables/Table";
import { FleetTable } from "./Tables/FleetTable";
import { FleetVehiclesTable } from "./Tables/FleetVehiclesTable";
import { VehicleLocationTable } from "./Tables/VehicleLocationTable";
import { VehicleTable } from "./Tables/VehicleTable";
import { Sqlite3FleetsRepository } from "./Sqlite3FleetsRepository";
import { Sqlite3LocationProjections } from "./Sqlite3LocationProjections";
import { Sqlite3FleetProjections } from "./Sqlite3FleetProjections";
import { Sqlite3VehiclesRepository } from "./Sqlite3VehiclesRepository";

export class Sqlite3Persistence implements Persistence {
  private database: Sqlite3Database;

  constructor(databaseFilePath: string) {
    const tables: Array<Table> = [
      new FleetTable(),
      new FleetVehiclesTable(),
      new VehicleTable(),
      new VehicleLocationTable(),
    ];
    this.database = new Sqlite3Database(databaseFilePath, tables);
  }

  async reset(): Promise<void> {
    await this.database.reset();
  }

  getFleetsRepository(): FleetsRepository {
    return new Sqlite3FleetsRepository(this.database);
  }

  getVehiclesRepository(): VehiclesRepository {
    return new Sqlite3VehiclesRepository(this.database);
  }

  getFleetProjections(): FleetProjections {
    return new Sqlite3FleetProjections(this.database);
  }

  getLocationProjections(): LocationProjections {
    return new Sqlite3LocationProjections(this.database);
  }
}
