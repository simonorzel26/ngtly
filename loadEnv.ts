import { spawn } from "node:child_process";
import { resolve } from "node:path";
import { config } from "dotenv";

// Load the root .env file
config({ path: resolve(__dirname, ".env") });

// Get the command and arguments from the command line
const [, , ...command] = process.argv;

// Ensure that the command[0] argument is always a string
const commandString = command[0] ?? "";

// Execute the command with the environment variables loaded
const child = spawn(commandString, command.slice(1), {
	stdio: "inherit",
	env: process.env,
});

child.on("close", (code) => {
	return process.exit(code);
});