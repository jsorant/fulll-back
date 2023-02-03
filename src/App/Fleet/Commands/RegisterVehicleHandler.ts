import { Fleet } from "../../../Domain/Fleet/Fleet";
import { Vehicle } from "../../../Domain/Vehicle/Vehicle";
import { CommandHandler } from "../../CqrsModel/CommandHandler";
import { FleetRepository } from "./Ports/FleetRepository";
import { VehicleRepository } from "./Ports/VehicleRepository";
import { RegisterVehicle } from "./RegisterVehicle";

export class RegisterVehicleHandler implements CommandHandler<RegisterVehicle> {
  private vehicleRepository: VehicleRepository;
  private fleetRepository: FleetRepository;

  constructor(
    vehicleRepository: VehicleRepository,
    fleetRepository: FleetRepository
  ) {
    this.fleetRepository = fleetRepository;
    this.vehicleRepository = vehicleRepository;
  }

  async handle(command: RegisterVehicle): Promise<void> {
    const vehicleId: string =
      await this.createVehicleIfNeededThenRegisterItToFleet(command);
    await this.updateRelatedFleet(command, vehicleId);

    // TODO:
    //
    // In this architectural proposition, the 'Application' layer is responsible for keeping differents aggregates consistents
    // If something throws or application stops after 'createVehicleIfNeededThenRegisterItToFleet()' (which calls 'VehicleRepository.save()')
    // then the persisted data would be in inconsistent state
    //
    // 3 ideas around this:
    //   1/ Keep this architectural proposition and implement 'unit of work', 'transactions' and 'cancellation'
    //   2/ Create a DomainService inside Domain to do this operation, inject the fleetRepository
    //      and use the DomainService inside Vehicle.registerToFleet().
    //      NB: In this proposal, 'Domain' layer would also have knowledge of repositories
    //        pro => consistency of the domain is inside the Domain
    //        con => what if Fleet.addVehicle is called instead ?
    //   3/ Implement DomainEvent, have a trigger on Vehicle.registerToFleet()
    //      success event that would update the matching Fleet
    //        pro => As domain event handling is domin logic, consitency is delegated back to the 'Domain'
    //        con => Eventual consistency & Fleet.addVehicle() stays public
  }

  private async createVehicleIfNeededThenRegisterItToFleet(
    command: RegisterVehicle
  ): Promise<string> {
    const vehicle: Vehicle = await this.getExistingVehicleOrMakeNewOne(
      command.plateNumber
    );
    return await this.registerVehicleToFleet(vehicle, command.fleetId);
  }

  private async registerVehicleToFleet(
    vehicle: Vehicle,
    fleetId: string
  ): Promise<string> {
    vehicle.registerToFleet(fleetId);
    await this.vehicleRepository.save(vehicle);
    return vehicle.id.value;
  }

  private async updateRelatedFleet(
    command: RegisterVehicle,
    vehicleId: string
  ): Promise<void> {
    const fleet: Fleet = await this.fleetRepository.get(command.fleetId);
    fleet.addVehicle(vehicleId);
    await this.fleetRepository.save(fleet);
  }

  private async getExistingVehicleOrMakeNewOne(
    plateNumber: string
  ): Promise<Vehicle> {
    let vehicle: Vehicle | undefined =
      await this.vehicleRepository.getFromPlateNumber(plateNumber);
    if (vehicle === undefined) {
      vehicle = Vehicle.createNew(plateNumber);
    }
    return vehicle;
  }
}
