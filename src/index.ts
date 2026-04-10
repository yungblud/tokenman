import { readFileSync } from "node:fs";
import { encoding_for_model, type TiktokenModel } from "tiktoken";

export interface TokenCount {
	file: string;
	tokens: number;
	model: string;
}

const DEFAULT_MODEL: TiktokenModel = "gpt-4o";

export function countTokens(text: string, model?: string): number {
	const enc = encoding_for_model((model ?? DEFAULT_MODEL) as TiktokenModel);
	try {
		return enc.encode(text).length;
	} finally {
		enc.free();
	}
}

export function countFileTokens(filePath: string, model?: string): TokenCount {
	const text = readFileSync(filePath, "utf-8");
	const tokens = countTokens(text, model);
	return { file: filePath, tokens, model: model ?? DEFAULT_MODEL };
}
