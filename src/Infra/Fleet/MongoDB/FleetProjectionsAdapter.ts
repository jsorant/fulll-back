import { Fleet } from "../../../Domain/Fleet/Fleet";
import { FleetInterface } from "./Documents/FleetDocument";

export class FleetProjectionsAdapter {
  fromMongo(fleet: Fleet): FleetInterface {
    return {
      id: fleet.getId(),
      userId: fleet.getUserId(),
      //avatar: 'https://i.imgur.com/dM7Thhn.png'
    };
  }
}
