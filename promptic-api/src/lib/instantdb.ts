import { init } from "@instantdb/admin";

export const db = init({
  appId: process.env.INSTANTDB_APP_ID || "",
  adminToken: process.env.INSTANTDB_ADMIN_TOKEN || "",
});
