import fs from "node:fs/promises";
import Handlebars from "handlebars";

Handlebars.registerHelper("removePrefix", function (value, prefix) {
    if (typeof value !== "string") return value;
    if (value.startsWith(prefix)) {
      return value.slice(prefix.length);
    }
    return value;
});

const [,, templatePath, jsonData] = process.argv;
const tpl = await fs.readFile(templatePath, "utf8");
const data = JSON.parse(jsonData);

const compile = Handlebars.compile(tpl);
process.stdout.write(compile(data));
