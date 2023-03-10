import { VehiclesRepository } from "../../../../App/Commands/Ports/VehiclesRepository";
import { Location } from "../../../../Domain/Vehicle/ValueObjects/Location";
import { Vehicle } from "../../../../Domain/Vehicle/Vehicle";
import { Sqlite3Database } from "./Sqlite3Database";
import { VehicleLocationTable } from "./Tables/VehicleLocationTable";
import { VehicleTable } from "./Tables/VehicleTable";

export class Sqlite3VehiclesRepository implements VehiclesRepository {
  private database: Sqlite3Database;

  constructor(database: Sqlite3Database) {
    this.database = database;
  }

  //TODO clean code
  async getFromPlateNumber(plateNumber: string): Promise<Vehicle | undefined> {
    const vehicle: any = await this.database.getOne(
      `SELECT ${VehicleTable.COLUMN_ID}, ${VehicleTable.COLUMN_PLATE_NUMBER} FROM ${VehicleTable.TABLE_NAME} WHERE ${VehicleTable.COLUMN_PLATE_NUMBER}='${plateNumber}';`
    );
    if (vehicle === undefined) {
      return undefined;
    }

    const vehicleLocation: any = await this.database.getOne(
      `SELECT ${VehicleLocationTable.COLUMN_LATITUDE}, ${VehicleLocationTable.COLUMN_LONGITUDE}, ${VehicleLocationTable.COLUMN_ALTITUDE} FROM ${VehicleLocationTable.TABLE_NAME} WHERE ${VehicleLocationTable.COLUMN_VEHICLE_ID}='${vehicle.id}';`
    );

    return Vehicle.createFrom(
      vehicle.id,
      vehicle.plate_number,
      vehicleLocation !== undefined ? vehicleLocation.latitude : undefined,
      vehicleLocation !== undefined ? vehicleLocation.longitude : undefined,
      vehicleLocation !== undefined && vehicleLocation.altitude !== "NULL"
        ? vehicleLocation.altitude
        : undefined
    );
  }

  //TODO clean code
  async get(id: string): Promise<Vehicle> {
    const vehicle: any = await this.database.getOne(
      `SELECT ${VehicleTable.COLUMN_ID}, ${VehicleTable.COLUMN_PLATE_NUMBER} FROM ${VehicleTable.TABLE_NAME} WHERE ${VehicleTable.COLUMN_ID}='${id}';`
    );
    if (vehicle === undefined) {
      throw new Error(`Vehicle not found with id ${id}`);
    }

    const vehicleLocation: any = await this.database.getOne(
      `SELECT ${VehicleLocationTable.COLUMN_LATITUDE}, ${VehicleLocationTable.COLUMN_LONGITUDE}, ${VehicleLocationTable.COLUMN_ALTITUDE} FROM ${VehicleLocationTable.TABLE_NAME} WHERE ${VehicleLocationTable.COLUMN_VEHICLE_ID}='${vehicle.id}';`
    );

    return Vehicle.createFrom(
      vehicle.id,
      vehicle.plate_number,
      vehicleLocation !== undefined ? vehicleLocation.latitude : undefined,
      vehicleLocation !== undefined ? vehicleLocation.longitude : undefined,
      vehicleLocation !== undefined && vehicleLocation.altitude !== "NULL"
        ? vehicleLocation.altitude
        : undefined
    );
  }

  async save(vehicle: Vehicle): Promise<void> {
    await this.saveVehicle(vehicle);
    await this.saveVehicleLocation(vehicle);
  }

  private async saveVehicle(vehicle: Vehicle): Promise<void> {
    await this.database.execute(
      `INSERT OR IGNORE INTO ${VehicleTable.TABLE_NAME} (${VehicleTable.COLUMN_ID}, ${VehicleTable.COLUMN_PLATE_NUMBER}) VALUES ('${vehicle.id.value}', '${vehicle.plateNumber.value}')`
    );
  }

  private async saveVehicleLocation(vehicle: Vehicle): Promise<void> {
    await this.deleteVehicleLocation(vehicle);
    if (vehicle.location !== undefined) {
      await this.insertVehicleLocation(vehicle.id.value, vehicle.location);
    }
  }

  private async deleteVehicleLocation(vehicle: Vehicle): Promise<void> {
    await this.database.execute(
      `DELETE FROM ${VehicleLocationTable.TABLE_NAME} WHERE ${VehicleLocationTable.COLUMN_VEHICLE_ID}='${vehicle.id.value}'`
    );
  }

  private async insertVehicleLocation(
    vehicleId: string,
    location: Location
  ): Promise<void> {
    await this.database.execute(
      `INSERT INTO ${VehicleLocationTable.TABLE_NAME} (${
        VehicleLocationTable.COLUMN_VEHICLE_ID
      }, ${VehicleLocationTable.COLUMN_LATITUDE}, ${
        VehicleLocationTable.COLUMN_LONGITUDE
      }, ${VehicleLocationTable.COLUMN_ALTITUDE}) VALUES ('${vehicleId}', '${
        location.latitude.degrees
      }', '${location.longitude.degrees}', '${
        location.altitude ? location.altitude.meters : "NULL"
      }')`
    );
  }
}
