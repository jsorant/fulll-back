export interface Table {
  getTableName(): string;
  getCreateTableScript(): string;
}
