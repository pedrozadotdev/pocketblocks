import fs from "node:fs";
import path from "node:path";
import https from "node:https";
import shell from "shelljs";
import chalk from "chalk";
import { buildVars } from "openblocks-dev-utils/buildVars.js";
import { currentDirName, readJson } from "openblocks-dev-utils/util.js";

const builtinPlugins = ["openblocks-comps"];
const curDirName = currentDirName(import.meta.url);

async function downloadFile(url, dest) {
  const file = fs.createWriteStream(dest);
  return new Promise((resolve, reject) => {
    https
      .get(url, function (response) {
        response.pipe(file);
        file.on("finish", function () {
          file.close(() => {
            resolve();
          });
        });
      })
      .on("error", function (err) {
        fs.unlink(dest);
        reject(err);
      });
  });
}

async function buildBuiltinPlugin(name) {
  console.log();
  console.log(chalk.cyan`plugin ${name} building...`);

  const targetDir = `../proxy/public/${name}/latest`;
  shell.mkdir("-p", targetDir);

  shell.exec(`yarn workspace ${name} build_only`, { fatal: true });

  const packageJsonFile = path.join(curDirName, `../packages/${name}/package.json`);
  const packageJSON = readJson(packageJsonFile);
  const tarballFileName = `./packages/${name}/${name}-${packageJSON.version}.tgz`;

  shell.exec(`tar -zxf ${tarballFileName} -C ${targetDir} --strip-components 1`, { fatal: true });
  shell.rm(tarballFileName);
}

async function buildSDK() {
  console.log();
  console.log(chalk.cyan`SDK building...`);

  const targetDir = `../proxy/public/sdk`;
  shell.mkdir("-p", targetDir);

  shell.exec(`yarn workspace openblocks-sdk build`, { fatal: true });

  const distFolder = "./packages/openblocks-sdk/dist";

  shell.exec(`cp ${distFolder}/* ${targetDir}`, { fatal: true });
}

shell.set("-e");

const start = Date.now();

//prettier-ignore
shell.env["REACT_APP_COMMIT_ID"] = shell.env["REACT_APP_COMMIT_ID"] || shell.exec("git rev-parse --short HEAD", {silent: true}).trim();

// Treating warnings as errors when process.env.CI = true.
shell.env["CI"] = false;
shell.env["NODE_OPTIONS"] = "--max_old_space_size=4096";
shell.env["NODE_ENV"] = "production";
shell.env["REACT_APP_LOG_LEVEL"] = "error";
shell.env["REACT_APP_BUNDLE_BUILTIN_PLUGIN"] = "true";

buildVars.forEach(({ name, defaultValue }) => {
  shell.env[name] = shell.env[name] ?? defaultValue;
});

shell.exec(`BUILD_TARGET=browserCheck yarn workspace openblocks build`, { fatal: true });
shell.exec(`yarn workspace openblocks build`, { fatal: true });
shell.exec(`mv -f ../proxy/public/index.html ../proxy/index.html`, { fatal: true });

if (process.env.REACT_APP_BUNDLE_BUILTIN_PLUGIN) {
  for (const pluginName of builtinPlugins) {
    await buildBuiltinPlugin(pluginName);
  }
}

await buildSDK()

console.log();
console.log(chalk.green`Done! time: ${((Date.now() - start) / 1000).toFixed(2)}s`);
