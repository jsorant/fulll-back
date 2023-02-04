import { Table } from "./Table";

export class VehicleLocationTable implements Table {
  static TABLE_NAME: string = "vehicle_location";
  static COLUMN_VEHICLE_ID: string = "id";
  static COLUMN_LATITUDE: string = "latitude";
  static COLUMN_LONGITUDE: string = "longitude";
  static COLUMN_ALTITUDE: string = "altitude";

  getTableName(): string {
    return VehicleLocationTable.TABLE_NAME;
  }

  getCreateTableScript(): string {
    return `CREATE TABLE ${VehicleLocationTable.TABLE_NAME} (${VehicleLocationTable.COLUMN_VEHICLE_ID} TEXT NOT NULL, ${VehicleLocationTable.COLUMN_LATITUDE} INT NOT NULL, ${VehicleLocationTable.COLUMN_LONGITUDE} INT NOT NULL, ${VehicleLocationTable.COLUMN_ALTITUDE} INT)`;
  }
}
