import { FleetRepository } from "../App/Commands/Ports/FleetRepository";
import { ProjectionsPersistence } from "../App/Queries/Ports/ProjectionsPersistence";
import { VehicleProjection } from "../App/Queries/Views/VehicleProjection";
import { Fleet } from "../Domain/Fleet/Fleet";
import { FleetSnapshot } from "../Domain/Fleet/FleetSnapshot";

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
    this.removeFleet(fleet.getId());
    this.fleets.push(snapshot);
  }

  // ProjectionsPersistence implementations

  async getVehiculeListProjection(
    fleetId: string
  ): Promise<Array<VehicleProjection>> {
    const snapshot: FleetSnapshot = this.findFleetSnapshot(fleetId);
    return this.makeVehicleProjectionArray(snapshot);
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

  private makeVehicleProjectionArray(
    snapshot: FleetSnapshot
  ): Array<VehicleProjection> {
    return snapshot.vehicles.map(
      (element) => new VehicleProjection(element.plate)
    );
  }
}
