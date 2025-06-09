import type { InstantRules } from "@instantdb/react";

const rules = {
  // Allow all logged-in users to do everything
  $default: {
    allow: {
      view: "auth.id != null",
      create: "auth.id != null",
      update: "auth.id != null",
      delete: "auth.id != null",
    },
  },
} satisfies InstantRules;

export default rules;
