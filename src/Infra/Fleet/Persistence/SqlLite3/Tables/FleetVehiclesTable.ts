import { Table } from "./Table";

export class FleetVehiclesTable implements Table {
  static TABLE_NAME: string = "fleet_vehicles";
  static COLUMN_FLEET_ID: string = "fleet_id";
  static COLUMN_VEHICLE_ID: string = "vehicle_id";

  getTableName(): string {
    return FleetVehiclesTable.TABLE_NAME;
  }

  getCreateTableScript(): string {
    return `CREATE TABLE ${FleetVehiclesTable.TABLE_NAME} (${FleetVehiclesTable.COLUMN_FLEET_ID} TEXT NOT NULL, ${FleetVehiclesTable.COLUMN_VEHICLE_ID} TEXT NOT NULL)`;
  }
}
