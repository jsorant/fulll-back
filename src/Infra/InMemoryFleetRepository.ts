import { FleetRepository } from "../App/Fleet/Commands/Ports/FleetRepository";
import { ProjectionsPersistence } from "../App/Fleet/Queries/Ports/ProjectionsPersistence";
import { RegisteredVehiclesProjection } from "../App/Fleet/Queries/Views/RegisteredVehiclesProjection";
import { VehicleProjection } from "../App/Fleet/Queries/Views/VehicleProjection";
import { VehicleLocationProjection } from "../App/Fleet/Queries/Views/VehiculeLocationProjection";
import { Fleet } from "../Domain/Fleet/Fleet";
import { FleetSnapshot } from "../Domain/Fleet/FleetSnapshot";
import { VehicleSnapshot } from "../Domain/Fleet/Entities/VehicleSnapshot";

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

  async getRegisteredVehiclesProjection(
    fleetId: string
  ): Promise<RegisteredVehiclesProjection> {
    const snapshot: FleetSnapshot = this.findFleetSnapshot(fleetId);
    return this.makeRegisteredVehiclesProjection(snapshot);
  }

  async getVehicleLocationProjection(
    fleetId: string,
    plateNumber: string
  ): Promise<VehicleLocationProjection> {
    const snapshot: VehicleSnapshot = this.findVehiculeSnapshot(
      fleetId,
      plateNumber
    );
    return this.makeVehicleLocationProjection(snapshot);
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

  private findVehiculeSnapshot(
    fleetId: string,
    plateNumber: string
  ): VehicleSnapshot {
    const fleetSnapshot: FleetSnapshot = this.findFleetSnapshot(fleetId);
    return this.findVehiculeSnapshotFromFleetSnapshot(
      fleetSnapshot,
      plateNumber
    );
  }

  private findVehiculeSnapshotFromFleetSnapshot(
    fleet: FleetSnapshot,
    plateNumber: string
  ): VehicleSnapshot {
    const foundVehicle = fleet.registeredVehicles.find(
      (vehicle) => vehicle.plateNumber === plateNumber
    );

    if (foundVehicle === undefined) {
      throw new Error("Vehicle not found. Plate number: " + plateNumber);
    }

    return foundVehicle;
  }

  private makeRegisteredVehiclesProjection(
    snapshot: FleetSnapshot
  ): RegisteredVehiclesProjection {
    return new RegisteredVehiclesProjection(
      this.makeVehiclesProjection(snapshot.registeredVehicles)
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
    return new VehicleProjection(vehicleSnapshot.plateNumber);
  }

  private makeVehicleLocationProjection(
    vehicleSnapshot: VehicleSnapshot
  ): VehicleLocationProjection {
    if (vehicleSnapshot.location === undefined) {
      throw new Error(
        "No location found for given vehicle. Plate number: " +
          vehicleSnapshot.plateNumber
      );
    }
    //TODO demeter law
    return new VehicleLocationProjection(
      vehicleSnapshot.location.latitudeDegrees,
      vehicleSnapshot.location.longitudeDegrees,
      vehicleSnapshot.location.altitudeMeters
    );
  }
}
