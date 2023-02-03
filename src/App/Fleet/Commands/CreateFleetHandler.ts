import { CommandHandler } from "../../CqrsModel/CommandHandler";
import { Fleet } from "../../../Domain/Fleet/Fleet";
import { FleetsRepository } from "./Ports/FleetsRepository";
import { CreateFleet } from "./CreateFleet";

export class CreateFleetHandler implements CommandHandler<CreateFleet> {
  private fleetsRepository: FleetsRepository;

  constructor(fleetsRepository: FleetsRepository) {
    this.fleetsRepository = fleetsRepository;
  }

  async handle(command: CreateFleet): Promise<void> {
    // Business rule
    // Can be moved into a Domain Service and wrapped into a Domain service
    // Cf RegisterVehicleHandler.handle() comment
    await this.ensureFleetDoesNotAlreadyExist(command.userId);

    const fleet: Fleet = Fleet.createNew(command.userId);

    await this.fleetsRepository.save(fleet);
  }

  private async ensureFleetDoesNotAlreadyExist(userId: string) {
    if (await this.fleetsRepository.hasForUserId(userId)) {
      throw new Error(`Fleet already created for this user.`);
    }
  }
}
