"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const admin_1 = require("@instantdb/admin");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
// Middleware
app.use(express_1.default.json());
app.use((0, cors_1.default)());
// Health check endpoint
app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok" });
});
// API endpoint to get prompt content
app.post("/api/prompt", async (req, res) => {
    const { appId, promptKey, projectKey } = req.body;
    // Input validation
    if (!appId || typeof appId !== "string") {
        return res.status(400).json({ error: "Missing or invalid 'appId'" });
    }
    if (!promptKey || typeof promptKey !== "string") {
        return res.status(400).json({ error: "Missing or invalid 'promptKey'" });
    }
    try {
        const result = await getPromptFromInstant(promptKey, projectKey, appId);
        if (result.error) {
            return res.status(500).json({ error: result.error });
        }
        if (!result.prompts || result.prompts.length === 0) {
            return res.status(404).json({ error: "Prompt not found" });
        }
        return res.status(200).json({ value: result.prompts[0].content });
    }
    catch (error) {
        console.error("Server error:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
});
async function getPromptFromInstant(promptName, projectKey, appId) {
    try {
        const db = (0, admin_1.init)({
            appId: appId,
            adminToken: process.env.INSTANTDB_ADMIN_TOKEN || "",
        });
        // Using any type to bypass TypeScript's strict type checking for the query
        // since the @instantdb/admin types might not fully match the query structure
        return (await db.query({
            prompts: {
                $: {
                    where: {
                        name: promptName,
                        project: {
                            key: projectKey,
                        },
                    },
                },
            },
        }));
    }
    catch (error) {
        return { error: error.message };
    }
}
exports.default = app;
