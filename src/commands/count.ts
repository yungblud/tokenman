import { defineCommand } from "citty";
import consola from "consola";
import fg from "fast-glob";
import { countFileTokens } from "../index.js";

export const countCommand = defineCommand({
	meta: {
		name: "count",
		description: "Count tokens in files",
	},
	args: {
		files: {
			type: "positional",
			description: "File paths or glob patterns",
			required: true,
		},
		model: {
			type: "string",
			description: "Tokenizer model",
			default: "gpt-4o",
			alias: "m",
		},
		json: {
			type: "boolean",
			description: "Output as JSON",
			default: false,
		},
	},
	async run({ args }) {
		const patterns = (args._ ?? [args.files]).flat().filter(Boolean);

		if (patterns.length === 0) {
			consola.error("No file paths provided");
			process.exit(1);
		}

		const files = await fg(patterns, { dot: false, onlyFiles: true });

		if (files.length === 0) {
			consola.error("No files matched the given patterns");
			process.exit(1);
		}

		const results = files.sort().map((f) => countFileTokens(f, args.model));
		const total = results.reduce((sum, r) => sum + r.tokens, 0);

		if (args.json) {
			console.log(
				JSON.stringify({ model: args.model, files: results, total }, null, 2),
			);
			return;
		}

		if (results.length === 1) {
			const r = results[0];
			consola.log(`${r.file}    ${r.tokens} tokens (${r.model})`);
			return;
		}

		const maxPathLen = Math.max(...results.map((r) => r.file.length));
		const maxTokenLen = Math.max(
			...results.map((r) => String(r.tokens).length),
		);

		for (const r of results) {
			const path = r.file.padEnd(maxPathLen);
			const tokens = String(r.tokens).padStart(maxTokenLen);
			consola.log(` ${path}  ${tokens} tokens`);
		}

		const divider = "─".repeat(maxPathLen + maxTokenLen + 12);
		consola.log(divider);
		consola.log(
			` ${"Total".padEnd(maxPathLen)}  ${String(total).padStart(maxTokenLen)} tokens (${args.model})`,
		);
	},
});
