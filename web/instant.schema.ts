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
      userId: i.string().unique(),
    }),
    projects: i.entity({
      id: i.string(),
      name: i.string(),
      llm_provider: i.string().optional(),
      provider_key: i.string().optional(),
      key: i.string().unique(),
      createdAt: i.number(),
      updatedAt: i.number().indexed(),
    }),
    prompts: i.entity({
      id: i.string(),
      name: i.string(),
      content: i.string(),
      liveContent: i.string(),
      variables: i.string().optional(),
      createdAt: i.number(),
      updatedAt: i.number().indexed(),
    }),
    prompt_metadata: i.entity({
      id: i.string(),
      promptId: i.string(),
      key: i.string(),
      value: i.string(),
    }),
    prompt_information: i.entity({
      id: i.string(),
      promptId: i.string(),
      positionX: i.number(),
      positionY: i.number(),
      width: i.number().optional(),
      height: i.number().optional(),
      nodeType: i.string(),
      isExpanded: i.boolean().optional(),
      version: i.number().optional(),
      flowData: i.string().optional(), // JSON string for additional flow data
      createdAt: i.number(),
      updatedAt: i.number().indexed(),
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
    promptInformation: {
      forward: { on: "prompt_information", has: "one", label: "prompt" },
      reverse: { on: "prompts", has: "one", label: "information" },
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
