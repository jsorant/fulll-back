import { FleetRepository } from "../../App/Fleet/Commands/Ports/FleetRepository";
import { ProjectionsBuilder } from "../../App/Fleet/Queries/Ports/ProjectionsBuilder";
import { VehiclesProjection } from "../../App/Fleet/Queries/Views/VehiclesProjection";
import { LocationProjection } from "../../App/Fleet/Queries/Views/LocationProjection";
import { Fleet } from "../../Domain/Fleet/Fleet";
import { Identifier } from "../../Domain/SharedKernel/Indentifier";
import { FleetProjection } from "../../App/Fleet/Queries/Views/FleetProjection";
import { Vehicle } from "../../Domain/Fleet/Entities/Vehicle";
import { Location } from "../../Domain/Fleet/ValueObjects/Location";
import { PlateNumber } from "../../Domain/Fleet/ValueObjects/PlateNumber";
import { InMemoryProjectionAdapter } from "./InMemoryProjectionAdapter";

export class InMemoryDataPersistence
  implements FleetRepository, ProjectionsBuilder
{
  private fleets: Array<Fleet> = [];
  private projectionAdapter: InMemoryProjectionAdapter =
    new InMemoryProjectionAdapter();

  // FleetRepository implementations

  async hasFleetForUserId(userId: Identifier): Promise<boolean> {
    return this.findFleetFromUserId(userId) !== undefined;
  }

  async getFleet(id: Identifier): Promise<Fleet> {
    return this.findFleetOrThrow(id);
  }

  async saveFleet(fleet: Fleet): Promise<void> {
    this.removeFleet(fleet.getId());
    this.addFleet(fleet);
  }

  // ProjectionsPersistence implementations

  async buildFleetProjectionForUser(userId: string): Promise<FleetProjection> {
    const foundFleet: Fleet = this.findFleetFromUserIdOrThrow(userId);
    return this.projectionAdapter.adaptToFleetProjection(foundFleet);
  }

  async buildVehiclesProjectionOfFleet(
    fleetId: string
  ): Promise<VehiclesProjection> {
    const foundFleet: Fleet = this.findFleetOrThrow(fleetId);
    return this.projectionAdapter.adaptToVehiclesProjection(foundFleet);
  }

  async buildVehicleLocationProjection(
    fleetId: string,
    plateNumber: string
  ): Promise<LocationProjection> {
    const location: Location = this.findLocationOrThrow(fleetId, plateNumber);
    return this.projectionAdapter.adaptToLocationProjection(location);
  }

  // Private methods

  private removeFleet(fleetId: Identifier): void {
    this.fleets = this.fleets.filter(
      (fleet: Fleet) => fleet.getId() !== fleetId
    );
  }

  private addFleet(fleet: Fleet) {
    this.fleets.push(fleet);
  }

  private findFleetOrThrow(id: Identifier): Fleet {
    const foundFleet: Fleet | undefined = this.findFleet(id);

    if (foundFleet === undefined) {
      throw new Error("Fleet not found for id: " + id);
    }

    return foundFleet;
  }

  private findFleet(id: Identifier): Fleet | undefined {
    return this.fleets.find((fleet) => fleet.getId() === id);
  }

  private findFleetFromUserIdOrThrow(userId: Identifier): Fleet {
    const foundFleet: Fleet | undefined = this.findFleetFromUserId(userId);

    if (foundFleet === undefined) {
      throw new Error("Fleet not found for user id: " + userId);
    }

    return foundFleet;
  }

  private findFleetFromUserId(userId: Identifier): Fleet | undefined {
    return this.fleets.find((fleet) => fleet.getUserId() === userId);
  }

  private findLocationOrThrow(fleetId: string, plateNumber: string): Location {
    const vehicle: Vehicle = this.findVehicleOrThrow(fleetId, plateNumber);
    return this.findLocationFromVehicleOrThrow(vehicle);
  }

  private findVehicleOrThrow(fleetId: string, plateNumber: string): Vehicle {
    const fleet: Fleet = this.findFleetOrThrow(fleetId);
    return this.findVehicleFromFleetOrThrow(fleet, plateNumber);
  }

  private findVehicleFromFleetOrThrow(
    fleet: Fleet,
    plateNumber: string
  ): Vehicle {
    const foundVehicle: Vehicle | undefined = this.findVehicleFromFleet(
      fleet,
      plateNumber
    );

    if (foundVehicle === undefined) {
      throw new Error("Vehicle not found. Plate number: " + plateNumber);
    }

    return foundVehicle;
  }

  private findVehicleFromFleet(
    fleet: Fleet,
    plateNumber: string
  ): Vehicle | undefined {
    const plateNumberToSeek: PlateNumber = new PlateNumber(plateNumber);
    return fleet
      .getVehicles()
      .find((vehicle) => vehicle.getPlateNumber().equals(plateNumberToSeek));
  }

  private findLocationFromVehicleOrThrow(vehicle: Vehicle): Location {
    const location: Location | undefined = vehicle.getLocation();

    if (location === undefined) {
      throw new Error(
        "No location found for given vehicle. Plate number: " +
          vehicle.getPlateNumber()
      );
    }

    return location;
  }
}
