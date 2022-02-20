import { Model, NonFunctionPropertyNames } from "objection";

export type TypeFromModel<T extends Model> = Pick<T, Exclude<NonFunctionPropertyNames<T>, "QueryBuilderType">>;
