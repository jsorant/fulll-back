import { Fleet } from "../../../Domain/Fleet/Fleet";
import { CommandHandler } from "../../CqrsModel/CommandHandler";
import { FleetRepository } from "./Ports/FleetRepository";
import { RegisterVehicle } from "./RegisterVehicle";

export class RegisterVehicleHandler implements CommandHandler<RegisterVehicle> {
  private fleetRepository: FleetRepository;

  constructor(fleetRepository: FleetRepository) {
    this.fleetRepository = fleetRepository;
  }

  async handle(command: RegisterVehicle): Promise<void> {
    const fleet: Fleet = await this.fleetRepository.getFleet(command.fleetId);
    fleet.register(command.plateNumber);
    await this.fleetRepository.saveFleet(fleet);
  }
}
