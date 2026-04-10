# tkm

File-based token counter CLI powered by [tiktoken](https://github.com/openai/tiktoken).

Count tokens in any file before sending to an LLM API — know the cost before you pay.

## Install

```bash
npm i -g tkm
```

Or run directly:

```bash
npx tkm count ./file.txt
```

## Usage

### Single file

```bash
$ tkm count ./README.md
README.md    342 tokens (gpt-4o)
```

### Multiple files / glob patterns

```bash
$ tkm count "src/**/*.ts"
 src/cli.ts              83 tokens
 src/commands/count.ts  559 tokens
 src/index.ts           176 tokens
────────────────────────────────────
 Total                  818 tokens (gpt-4o)
```

### Specify model

```bash
$ tkm count ./file.txt --model gpt-4o-mini
```

Supported models: `gpt-4o` (default), `gpt-4o-mini`, `gpt-4`, `gpt-3.5-turbo`

### JSON output

```bash
$ tkm count "src/**/*.ts" --json
```

```json
{
  "model": "gpt-4o",
  "files": [
    { "file": "src/cli.ts", "tokens": 83 },
    { "file": "src/commands/count.ts", "tokens": 559 },
    { "file": "src/index.ts", "tokens": 176 }
  ],
  "total": 818
}
```

## Options

| Option | Alias | Description | Default |
|--------|-------|-------------|---------|
| `--model` | `-m` | Tokenizer model | `gpt-4o` |
| `--json` | | Output as JSON | `false` |
| `--help` | `-h` | Show help | |
| `--version` | `-v` | Show version | |

## Programmatic API

```typescript
import { countTokens, countFileTokens } from "tkm";

// Count tokens from text
const tokens = countTokens("Hello, world!", "gpt-4o");
console.log(tokens); // 4

// Count tokens from a file
const result = countFileTokens("./README.md");
console.log(result); // { file: "./README.md", tokens: 342, model: "gpt-4o" }
```

## License

MIT
