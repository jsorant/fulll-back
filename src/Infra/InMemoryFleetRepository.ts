import { FleetRepository } from "../App/Fleet/Commands/Ports/FleetRepository";
import { ProjectionsPersistence } from "../App/Fleet/Queries/Ports/ProjectionsPersistence";
import { RegisteredVehiclesProjection } from "../App/Fleet/Queries/Views/RegisteredVehiculesProjection";
import { VehicleProjection } from "../App/Fleet/Queries/Views/VehicleProjection";
import { Fleet } from "../Domain/Fleet/Fleet";
import { FleetSnapshot } from "../Domain/Fleet/FleetSnapshot";
import { VehicleSnapshot } from "../Domain/Fleet/ValueObjects/VehicleSnapshot";

export class InMemoryDataPersistence
  implements FleetRepository, ProjectionsPersistence
{
  private fleets: Array<FleetSnapshot> = [];

  // FleetRepository implementations

  async getFleet(id: string): Promise<Fleet> {
    const snapshot: FleetSnapshot = this.findFleetSnapshot(id);
    return Fleet.makeFromSnapshot(snapshot);
  }

  async saveFleet(fleet: Fleet): Promise<void> {
    const snapshot: FleetSnapshot = fleet.makeSnapshot();
    this.removeFleet(snapshot.id);
    this.fleets.push(snapshot);
  }

  // ProjectionsPersistence implementations

  async getRegisteredVehiculesProjection(
    fleetId: string
  ): Promise<RegisteredVehiclesProjection> {
    const snapshot: FleetSnapshot = this.findFleetSnapshot(fleetId);
    return this.makeRegisteredVehiclesProjection(snapshot);
  }

  private removeFleet(fleetId: string): void {
    this.fleets = this.fleets.filter(
      (value: FleetSnapshot) => value.id !== fleetId
    );
  }

  private findFleetSnapshot(id: string): FleetSnapshot {
    const foundFleet = this.fleets.find((element) => element.id === id);

    if (foundFleet === undefined) {
      throw new Error("Fleet not found. Id: " + id);
    }

    return foundFleet;
  }

  private makeRegisteredVehiclesProjection(
    snapshot: FleetSnapshot
  ): RegisteredVehiclesProjection {
    return new RegisteredVehiclesProjection(
      this.makeVehiclesProjection(snapshot.registeredVehicules)
    );
  }

  private makeVehiclesProjection(
    vehiclesSnapshot: Array<VehicleSnapshot>
  ): Array<VehicleProjection> {
    return vehiclesSnapshot.map(this.makeVehicleProjection);
  }

  private makeVehicleProjection(
    vehicleSnapshot: VehicleSnapshot
  ): VehicleProjection {
    return new VehicleProjection(vehicleSnapshot.licensePlate);
  }
}
