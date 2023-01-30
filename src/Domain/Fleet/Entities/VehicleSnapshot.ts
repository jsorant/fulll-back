export class VehicleSnapshot {
  public readonly plate: string;

  constructor(plate: string) {
    this.plate = Object.freeze(plate);
  }
}
