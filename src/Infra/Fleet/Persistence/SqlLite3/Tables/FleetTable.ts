import { Table } from "./Table";

export class FleetTable implements Table {
  static TABLE_NAME: string = "fleet";
  static COLUMN_ID: string = "id";
  static COLUMN_USER_ID: string = "user_id";

  getTableName(): string {
    return FleetTable.TABLE_NAME;
  }

  getCreateTableScript(): string {
    return `CREATE TABLE ${FleetTable.TABLE_NAME} (${FleetTable.COLUMN_ID} TEXT NOT NULL PRIMARY KEY, ${FleetTable.COLUMN_USER_ID} TEXT NOT NULL)`;
  }
}
