import { i } from "@instantdb/react";

const _schema = i.schema({
  entities: {
    $users: i.entity({
      id: i.string().unique(),
      email: i.string().unique(),
    }),
    profiles: i.entity({
      id: i.string(),
      firstName: i.string(),
      lastName: i.string(),
      profilePicture: i.string().optional(),
      email: i.string(),
    }),
    projects: i.entity({
      id: i.string(),
      name: i.string(),
      llm_provider: i.string().optional(),
      provider_key: i.string().optional(),
      createdAt: i.number(),
      updatedAt: i.number(),
    }),
    prompts: i.entity({
      id: i.string(),
      name: i.string(),
      content: i.string(),
      createdAt: i.number(),
      updatedAt: i.number(),
    }),
    prompt_metadata: i.entity({
      id: i.string(),
      promptId: i.string(),
      key: i.string(),
      value: i.string(),
    }),
  },
  links: {
    profileUser: {
      forward: { on: "profiles", has: "one", label: "$user" },
      reverse: { on: "$users", has: "one", label: "profile" },
    },
    projectPrompts: {
      forward: { on: "prompts", has: "one", label: "project" },
      reverse: { on: "projects", has: "many", label: "prompts" },
    },
    promptMetadata: {
      forward: { on: "prompt_metadata", has: "one", label: "prompt" },
      reverse: { on: "prompts", has: "one", label: "metadata" },
    },
    userProjects: {
      forward: { on: "projects", has: "many", label: "$users" },
      reverse: { on: "$users", has: "many", label: "projects" },
    },
  },
});

// This helps Typescript display better intellisense
type _AppSchema = typeof _schema;
interface AppSchema extends _AppSchema {}
const schema: AppSchema = _schema;

export type { AppSchema };
export default schema;
