import { LocationProjections } from "../../../../App/Fleet/Queries/Ports/LocationProjections";
import { LocationProjection } from "../../../../App/Fleet/Queries/Views/LocationProjection";
import { Sqlite3Database } from "./Sqlite3Database";
import { VehicleLocationTable } from "./Tables/VehicleLocationTable";
import { VehicleTable } from "./Tables/VehicleTable";

export class Sqlite3LocationProjections implements LocationProjections {
  private database: Sqlite3Database;

  constructor(database: Sqlite3Database) {
    this.database = database;
  }

  // TODO clean code
  async getVehicleLocation(
    fleetId: string,
    plateNumber: string
  ): Promise<LocationProjection> {
    const vehicle: any = await this.database.getOne(
      `SELECT ${VehicleTable.COLUMN_ID}, ${VehicleTable.COLUMN_PLATE_NUMBER} FROM ${VehicleTable.TABLE_NAME} WHERE ${VehicleTable.COLUMN_PLATE_NUMBER}='${plateNumber}';`
    );
    if (vehicle === undefined) {
      throw new Error(`Vehicle not found with plate number ${plateNumber}`);
    }

    const vehicleLocation: any = await this.database.getOne(
      `SELECT ${VehicleLocationTable.COLUMN_LATITUDE}, ${VehicleLocationTable.COLUMN_LONGITUDE}, ${VehicleLocationTable.COLUMN_ALTITUDE} FROM ${VehicleLocationTable.TABLE_NAME} WHERE ${VehicleLocationTable.COLUMN_VEHICLE_ID}='${vehicle.id}';`
    );
    if (vehicleLocation === undefined) {
      throw new Error(
        `No location for vehicle with plate number ${plateNumber}`
      );
    }

    return {
      latitudeDegrees: vehicleLocation.latitude,
      longitudeDegrees: vehicleLocation.longitude,
      altitudeMeters:
        vehicleLocation.altitude !== "NULL"
          ? vehicleLocation.altitude
          : undefined,
    };
  }
}
