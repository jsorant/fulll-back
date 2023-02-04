import { FleetProjections } from "../../../../App/Fleet/Queries/Ports/FleetProjections";
import { FleetProjection } from "../../../../App/Fleet/Queries/Views/FleetProjection";
import { Sqlite3Database } from "./Sqlite3Database";
import { FleetTable } from "./Tables/FleetTable";
import { FleetVehiclesTable } from "./Tables/FleetVehiclesTable";
import { VehicleTable } from "./Tables/VehicleTable";

export class Sqlite3FleetProjections implements FleetProjections {
  private database: Sqlite3Database;

  constructor(database: Sqlite3Database) {
    this.database = database;
  }

  // TODO clean code
  async getFleetForUser(userId: string): Promise<FleetProjection> {
    const fleet: any = await this.database.getOne(
      `SELECT ${FleetTable.COLUMN_ID}, ${FleetTable.COLUMN_USER_ID} FROM ${FleetTable.TABLE_NAME} WHERE ${FleetTable.COLUMN_USER_ID}='${userId}';`
    );
    if (fleet === undefined) {
      throw new Error(`Fleet not found for user ${userId}`);
    }

    const fleetVehicles: any = await this.database.getAll(
      `SELECT ${FleetVehiclesTable.COLUMN_FLEET_ID}, ${FleetVehiclesTable.COLUMN_VEHICLE_ID} FROM ${FleetVehiclesTable.TABLE_NAME} WHERE ${FleetVehiclesTable.COLUMN_FLEET_ID}='${fleet.id}';`
    );
    const vehiclesIds: Array<string> = fleetVehicles.map(
      (item: any) => item.vehicle_id
    );

    const vehiclesPlateNumber: string[] = [];
    for (const vehicleId of vehiclesIds) {
      const vehicle: any = await this.database.getOne(
        `SELECT ${VehicleTable.COLUMN_PLATE_NUMBER} FROM ${VehicleTable.TABLE_NAME} WHERE ${VehicleTable.COLUMN_ID}='${vehicleId}';`
      );
      vehiclesPlateNumber.push(vehicle.plate_number);
    }

    return {
      id: fleet.id,
      userId: fleet.user_id,
      vehiclesPlateNumber,
    };
  }

  // TODO clean code
  async getFleet(fleetId: string): Promise<FleetProjection> {
    const fleet: any = await this.database.getOne(
      `SELECT ${FleetTable.COLUMN_ID}, ${FleetTable.COLUMN_USER_ID} FROM ${FleetTable.TABLE_NAME} WHERE ${FleetTable.COLUMN_ID}='${fleetId}';`
    );
    if (fleet === undefined) {
      throw new Error(`Fleet not found with id ${fleetId}`);
    }

    const fleetVehicles: any = await this.database.getAll(
      `SELECT ${FleetVehiclesTable.COLUMN_FLEET_ID}, ${FleetVehiclesTable.COLUMN_VEHICLE_ID} FROM ${FleetVehiclesTable.TABLE_NAME} WHERE ${FleetVehiclesTable.COLUMN_FLEET_ID}='${fleet.id}';`
    );
    const vehiclesIds: Array<string> = fleetVehicles.map(
      (item: any) => item.vehicle_id
    );

    const vehiclesPlateNumber: string[] = [];
    for (const vehicleId of vehiclesIds) {
      const vehicle: any = await this.database.getOne(
        `SELECT ${VehicleTable.COLUMN_PLATE_NUMBER} FROM ${VehicleTable.TABLE_NAME} WHERE ${VehicleTable.COLUMN_ID}='${vehicleId}';`
      );
      vehiclesPlateNumber.push(vehicle.plate_number);
    }

    return {
      id: fleet.id,
      userId: fleet.user_id,
      vehiclesPlateNumber,
    };
  }
}
