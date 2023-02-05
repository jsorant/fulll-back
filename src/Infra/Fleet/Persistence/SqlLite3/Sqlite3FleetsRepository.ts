import { off } from "process";
import { FleetsRepository } from "../../../../App/Commands/Ports/FleetsRepository";
import { Fleet } from "../../../../Domain/Fleet/Fleet";
import { Sqlite3Database } from "./Sqlite3Database";
import { FleetTable } from "./Tables/FleetTable";
import { FleetVehiclesTable } from "./Tables/FleetVehiclesTable";

export class Sqlite3FleetsRepository implements FleetsRepository {
  private database: Sqlite3Database;

  constructor(database: Sqlite3Database) {
    this.database = database;
  }

  async hasForUserId(userId: string): Promise<boolean> {
    const result: any = await this.database.getOne(
      `SELECT 1 FROM ${FleetTable.TABLE_NAME} WHERE ${FleetTable.COLUMN_USER_ID}='${userId}';`
    );
    return result !== undefined;
  }

  //TODO clean code
  async get(id: string): Promise<Fleet> {
    const fleet: any = await this.database.getOne(
      `SELECT ${FleetTable.COLUMN_ID}, ${FleetTable.COLUMN_USER_ID} FROM ${FleetTable.TABLE_NAME} WHERE ${FleetTable.COLUMN_ID}='${id}';`
    );
    if (fleet === undefined) {
      throw new Error(`Fleet not found with id ${id}`);
    }

    const fleetVehicles: any = await this.database.getAll(
      `SELECT ${FleetVehiclesTable.COLUMN_FLEET_ID}, ${FleetVehiclesTable.COLUMN_VEHICLE_ID} FROM ${FleetVehiclesTable.TABLE_NAME} WHERE ${FleetVehiclesTable.COLUMN_FLEET_ID}='${fleet.id}';`
    );
    const vehicles: Array<string> = fleetVehicles.map(
      (item: any) => item.vehicle_id
    );
    return Fleet.createFrom(fleet.id, fleet.user_id, vehicles);
  }

  async save(fleet: Fleet): Promise<void> {
    await this.saveFleet(fleet); // IF exist nothing to do
    await this.saveFleetVehicles(fleet); // Check all, add missing
  }

  private async saveFleet(fleet: Fleet): Promise<void> {
    await this.database.execute(
      `INSERT OR IGNORE INTO ${FleetTable.TABLE_NAME} (${FleetTable.COLUMN_ID}, ${FleetTable.COLUMN_USER_ID}) VALUES ('${fleet.id.value}', '${fleet.userId.value}')`
    );
  }

  private async saveFleetVehicles(fleet: Fleet): Promise<void> {
    await this.removeFleetVehicles(fleet);
    await this.insertFleetVehicles(fleet);
  }

  private async removeFleetVehicles(fleet: Fleet): Promise<void> {
    await this.database.execute(
      `DELETE FROM ${FleetVehiclesTable.TABLE_NAME} WHERE ${FleetVehiclesTable.COLUMN_FLEET_ID}='${fleet.id.value}'`
    );
  }

  private async insertFleetVehicles(fleet: Fleet): Promise<void> {
    for (const vehicleId of fleet.vehicles) {
      await this.insertFleetVehicle(fleet.id.value, vehicleId.value);
    }
  }

  private async insertFleetVehicle(
    fleetId: string,
    vehicleId: string
  ): Promise<void> {
    await this.database.execute(
      `INSERT INTO ${FleetVehiclesTable.TABLE_NAME} (${FleetVehiclesTable.COLUMN_FLEET_ID}, ${FleetVehiclesTable.COLUMN_VEHICLE_ID}) VALUES ('${fleetId}', '${vehicleId}')`
    );
  }
}
