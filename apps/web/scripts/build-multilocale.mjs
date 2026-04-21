import { execSync } from "node:child_process";
import { copyFileSync, existsSync, statSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const TMP_EN = join(tmpdir(), "rnbp-index.en.html");

console.log("→ Building EN prerender…");
execSync("react-router build", {
  stdio: "inherit",
  env: { ...process.env, BUILD_LOCALE: "en" },
});

if (!existsSync("build/client/index.html")) {
  throw new Error("EN build did not produce build/client/index.html");
}
copyFileSync("build/client/index.html", TMP_EN);

console.log("→ Building FR prerender…");
execSync("react-router build", { stdio: "inherit" });

copyFileSync(TMP_EN, "build/client/index.en.html");

const fr = statSync("build/client/index.html");
const en = statSync("build/client/index.en.html");
if (fr.size === 0 || en.size === 0) {
  throw new Error("Multi-locale build produced an empty HTML output");
}

console.log(
  `✓ build/client/index.html (FR, ${fr.size} B) + index.en.html (EN, ${en.size} B) ready`,
);
