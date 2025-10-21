import postcssImport from "postcss-import";
import postcssPresetEnv from "postcss-preset-env";
import cssnano from "cssnano";

const isProd = process.env.NODE_ENV === "production";

const buildLogger = () => ({
  postcssPlugin: "postcss-build-logger",
  OnceExit() {
    console.log("\x1b[32m✔ css build successful\x1b[0m");
  },
});
buildLogger.postcss = true;

export default {
  map: isProd ? false : { inline: false, annotation: true, sourcesContent: true },
  plugins: [
    postcssImport(),
    postcssPresetEnv({
      stage: 1,
      features: {
        "nesting-rules": true,
        "custom-media-queries": true,
      },
    }),
    cssnano({
      preset: "default",
    }),
    buildLogger(),
  ],
};
