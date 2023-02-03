import { RootAggregate } from "../DddModel/RootAggregate";
import { FleetId } from "./ValueObjects/FleetId";
import { UserId } from "./ValueObjects/UserId";
import { VehicleId } from "./ValueObjects/VehicleId";

export class Fleet extends RootAggregate<FleetId> {
  public readonly userId: UserId;
  public readonly vehicles: Array<VehicleId>;

  private constructor(id: FleetId, userId: UserId, vehicles: Array<VehicleId>) {
    super(id);
    this.userId = userId;
    this.vehicles = vehicles;
  }

  static createNew(userId: string) {
    return new Fleet(FleetId.createNew(), new UserId(userId), []);
  }

  static createFrom(fleetId: string, userId: string, vehicles: Array<string>) {
    return new Fleet(
      FleetId.createFrom(fleetId),
      new UserId(userId),
      vehicles.map(VehicleId.createFrom)
    );
  }

  addVehicle(vehicleId: string): void {
    const valueToAdd: VehicleId = VehicleId.createFrom(vehicleId);
    this.vehicles.push(valueToAdd);
    //TODO Should we validate the business rule 'cannot add the same vehicle twice' here too ?
  }
}
