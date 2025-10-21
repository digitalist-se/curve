import fs from "fs";
import path from "path";
import { minify } from "minify";

const SRC_DIR = "src/js";
const DIST_DIR = "dist/js";

fs.mkdirSync(DIST_DIR, { recursive: true });

function getJsFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...getJsFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith(".js")) {
      files.push(fullPath);
    }
  }
  return files;
}

async function build() {
  const files = getJsFiles(SRC_DIR);
  
  for (const file of files) {
    const relPath = path.relative(SRC_DIR, file);
    const outPath = path.join(DIST_DIR, relPath);

    fs.mkdirSync(path.dirname(outPath), { recursive: true });

    try {
      const output = await minify(file, {
        js: {
          terser: {
            mangle: true,   // shorten variable names
            compress: true, // optimize code
          },
        },
      });
      fs.writeFileSync(outPath, output);
      console.log("\x1b[32m✔ js build successful\x1b[0m");
    } catch (err) {
      console.error(`Error minifying ${file}:`, err);
    }
  }
}

build();
