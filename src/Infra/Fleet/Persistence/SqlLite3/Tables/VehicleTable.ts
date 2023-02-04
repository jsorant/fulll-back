import { Table } from "./Table";

export class VehicleTable implements Table {
  static TABLE_NAME: string = "vehicle";
  static COLUMN_ID: string = "id";
  static COLUMN_PLATE_NUMBER: string = "plate_number";

  getTableName(): string {
    return VehicleTable.TABLE_NAME;
  }

  getCreateTableScript(): string {
    return `CREATE TABLE ${VehicleTable.TABLE_NAME} (${VehicleTable.COLUMN_ID} TEXT NOT NULL PRIMARY KEY, ${VehicleTable.COLUMN_PLATE_NUMBER} TEXT NOT NULL)`;
  }
}
