import fs from "node:fs/promises";
import Handlebars from "handlebars";

const [,, templatePath, jsonData] = process.argv;
const tpl = await fs.readFile(templatePath, "utf8");
const data = JSON.parse(jsonData);
const compile = Handlebars.compile(tpl);
process.stdout.write(compile(data));
