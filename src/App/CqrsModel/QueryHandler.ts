import { Query } from "./Query";

export interface QueryHandler<TQuery extends Query, TReturn> {
  handle(query: TQuery): Promise<TReturn>;
}
