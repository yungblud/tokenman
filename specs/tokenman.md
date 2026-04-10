# tokenman — 파일 기반 토큰 카운터 CLI

## 목표

파일 경로(또는 glob 패턴)를 입력받아 OpenAI 토크나이저 기준 토큰 수를 계산하는 Node.js CLI 도구.

```bash
npx tkm ./some-file.txt
npx tkm "src/**/*.ts" --model gpt-4o
```

## 문제 정의

- LLM API 비용 예측 시 토큰 수를 사전에 파악해야 한다
- 기존 도구는 웹 기반이거나, 파일 단위 배치 처리를 지원하지 않는다
- 터미널에서 바로 확인할 수 있는 경량 CLI가 필요하다

## 핵심 기능

### 1. 단일 파일 토큰 카운트

```bash
$ tkm ./README.md
README.md    342 tokens (gpt-4o)
```

### 2. 여러 파일 / glob 패턴

```bash
$ tkm "src/**/*.ts"
 src/cli.ts        142 tokens
 src/index.ts       87 tokens
─────────────────────────────
 Total             229 tokens (gpt-4o)
```

### 3. 모델 지정

```bash
$ tkm ./file.txt --model gpt-4o-mini
```

지원 모델: `gpt-4o` (기본값), `gpt-4o-mini`, `gpt-4`, `gpt-3.5-turbo`

## 프로젝트 구조

```
tokenman/
├── src/
│   ├── cli.ts              # citty 엔트리포인트 (runMain)
│   ├── commands/
│   │   └── count.ts        # 기본 명령: 파일 토큰 수 계산
│   └── index.ts            # 라이브러리 export (countTokens)
├── specs/
│   └── tokenman.md         # 이 문서
├── package.json
├── tsconfig.json
├── tsup.config.ts
├── .nvmrc
└── CLAUDE.md
```

## 기술 스택

| 패키지 | 용도 | 선택 이유 |
|--------|------|----------|
| `tiktoken` | BPE 토큰 카운트 | OpenAI 공식 토크나이저, WASM 기반으로 Node.js에서 빠름 |
| `citty` | CLI 프레임워크 | 경량, rag-kit과 동일 패턴 |
| `consola` | 로깅 | 컬러 출력, rag-kit과 동일 패턴 |
| `fast-glob` | 파일 탐색 | glob 패턴 지원, 빠름 |
| `tsup` | 빌드 | ESM + CJS 이중 출력, shebang 배너 |

## API 설계

### 라이브러리 (src/index.ts)

```typescript
export interface TokenCount {
  file: string
  tokens: number
  model: string
}

export function countTokens(text: string, model?: string): number
export function countFileTokens(filePath: string, model?: string): Promise<TokenCount>
```

### CLI 인터페이스

```
tkm <files...> [options]

Arguments:
  files          파일 경로 또는 glob 패턴 (필수, 복수 가능)

Options:
  --model, -m    토크나이저 모델 (기본: gpt-4o)
  --json         JSON 형식 출력
  --help, -h     도움말
  --version, -v  버전
```

## 구현 체크리스트

- [x] package.json (name, type: module, bin, scripts)
- [x] tsconfig.json (ES2022, strict, bundler resolution)
- [x] tsup.config.ts (라이브러리 + CLI 이중 빌드)
- [x] .nvmrc (v22)
- [ ] src/index.ts (countTokens, countFileTokens export)
- [ ] src/commands/count.ts (citty defineCommand)
- [ ] src/cli.ts (citty runMain)
- [ ] pnpm install + pnpm build 검증
- [ ] 실제 파일로 동작 검증

## 출력 형식

### 기본 (단일 파일)

```
README.md    342 tokens (gpt-4o)
```

### 기본 (복수 파일)

```
 src/cli.ts        142 tokens
 src/index.ts       87 tokens
─────────────────────────────
 Total             229 tokens (gpt-4o)
```

### JSON (--json)

```json
{
  "model": "gpt-4o",
  "files": [
    { "file": "src/cli.ts", "tokens": 142 },
    { "file": "src/index.ts", "tokens": 87 }
  ],
  "total": 229
}
```

## 향후 확장 가능성

- stdin 파이프 입력 (`cat file.txt | tkm`)
- Claude 모델 토크나이저 지원
- 비용 계산 옵션 (`--cost --price-per-1m 0.15`)
- watch 모드 (`--watch`)
