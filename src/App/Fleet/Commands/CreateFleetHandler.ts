import { CommandHandler } from "../../CqrsModel/CommandHandler";
import { Fleet } from "../../../Domain/Fleet/Fleet";
import { FleetRepository } from "./Ports/FleetRepository";
import { CreateFleet } from "./CreateFleet";

export class CreateFleetHandler implements CommandHandler<CreateFleet> {
  private fleetRepository: FleetRepository;

  constructor(fleetRepository: FleetRepository) {
    this.fleetRepository = fleetRepository;
  }

  async execute(command: CreateFleet): Promise<void> {
    const fleet: Fleet = Fleet.makeNewFleet(command.fleetId);
    this.fleetRepository.saveFleet(fleet);
  }
}
