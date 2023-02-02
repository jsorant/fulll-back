import { model, Schema } from "mongoose";

export interface FleetInterface {
  id: string;
  userId: string;
  //vehicles: Array<string>;
}

const schema = new Schema<FleetInterface>({
  id: { type: String, required: true },
  userId: { type: String, required: true },
  //vehicles: { type: Array<String>, required: true },
});

const FleetModel = model<FleetInterface>("Fleet", schema);
export default FleetModel;
