const PISTON_BASE = "/piston/api/v2";

export type RunResult = {
  output: string;
  kind: "ok" | "error";
  timeMs: number;
  exitCode: number | null;
};

let cachedJavaVersion: string | null = null;

export async function getJavaVersion(): Promise<string> {
  if (cachedJavaVersion) return cachedJavaVersion;
  const res = await fetch(`${PISTON_BASE}/runtimes`);
  if (!res.ok) throw new Error(`Cannot reach Piston (HTTP ${res.status})`);
  const list: Array<{ language: string; version: string }> = await res.json();
  const java = list.find((r) => r.language === "java");
  if (!java) throw new Error("No Java runtime installed in Piston.");
  cachedJavaVersion = java.version;
  return java.version;
}

function detectMainClass(code: string): string {
  const m = code.match(/public\s+class\s+([A-Za-z_$][A-Za-z0-9_$]*)/);
  return m ? m[1] : "Main";
}

export async function runJava(code: string): Promise<RunResult> {
  const startedAt = performance.now();
  const version = await getJavaVersion();
  const className = detectMainClass(code);
  const res = await fetch(`${PISTON_BASE}/execute`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      language: "java",
      version,
      files: [{ name: `${className}.java`, content: code }],
    }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  const timeMs = Math.round(performance.now() - startedAt);
  const compileErr: string = data.compile?.stderr || "";
  const runOut: string = data.run?.stdout || "";
  const runErr: string = data.run?.stderr || "";
  const exitCode: number | null = data.run?.code ?? null;

  if (compileErr.trim()) {
    return { output: `Compile error:\n${compileErr}`, kind: "error", timeMs, exitCode };
  }
  if (runErr.trim()) {
    return {
      output: `${runOut ? runOut + "\n" : ""}Runtime error:\n${runErr}`,
      kind: "error",
      timeMs,
      exitCode,
    };
  }
  return { output: runOut || "(no output)", kind: "ok", timeMs, exitCode };
}

export function boilerplate(question: string): string {
  const commented = question.replace(/\n/g, "\n// ");
  return `// ${commented}

public class Main {
    public static void main(String[] args) {
        // your solution here
        System.out.println("Hello, Java!");
    }
}
`;
}
