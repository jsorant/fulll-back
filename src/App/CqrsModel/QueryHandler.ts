import { Query } from "./Query";

export interface QueryHandler<TQuery extends Query, R> {
  execute(query: TQuery): Promise<R>;
}
