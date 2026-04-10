import { defineCommand, runMain } from "citty";
import { countCommand } from "./commands/count.js";

const main = defineCommand({
	meta: {
		name: "tkm",
		description: "File-based token counter powered by tiktoken",
		version: "0.0.1",
	},
	subCommands: {
		count: countCommand,
	},
});

runMain(main);
