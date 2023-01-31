export class VehicleSnapshot {
  public readonly licensePlate: string;

  constructor(licensePlate: string) {
    this.licensePlate = Object.freeze(licensePlate);
  }
}
