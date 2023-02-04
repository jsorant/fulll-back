import { Table } from "./Table";

export class VehicleFleetsTable implements Table {
  static TABLE_NAME: string = "vehicle_fleets";
  static COLUMN_FLEET_ID: string = "fleet_id";
  static COLUMN_VEHICLE_ID: string = "vehicle_id";

  getTableName(): string {
    return VehicleFleetsTable.TABLE_NAME;
  }

  getCreateTableScript(): string {
    return `CREATE TABLE ${VehicleFleetsTable.TABLE_NAME} (${VehicleFleetsTable.COLUMN_FLEET_ID} TEXT NOT NULL, ${VehicleFleetsTable.COLUMN_VEHICLE_ID} TEXT NOT NULL)`;
  }
}
