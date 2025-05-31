import { i } from "@instantdb/react";

const _schema = i.schema({
  entities: {
    todos: i.entity({
      id: i.string(),
      text: i.string(),
      done: i.boolean(),
      createdAt: i.number(),
    }),
  },
});

// This helps Typescript display better intellisense
type _AppSchema = typeof _schema;
interface AppSchema extends _AppSchema {}
const schema: AppSchema = _schema;

export type { AppSchema };
export default schema;
