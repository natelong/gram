var fs      = require("fs"),
    path    = require("path"),
    search  = "./src/Shaders",
    out     = "./src/Shaders.ts",
    output  = "// NOTE: This file is automatically generated from the contents\n" +
              "// of src/Shaders. Run bin/compileShaders.js to update it\n\n" +
              "export = Shaders;\n\nclass Shaders {\n",
    shaders = {};

fs.readdirSync(search).forEach(function(file) {
    var contents  = fs.readFileSync(search + path.sep + file,{encoding : "utf8"});
    var shortName = file.replace(".", "");

    output += "    public static " + shortName + " = " + JSON.stringify(contents) + ";\n";
});

output += "}";
fs.writeFileSync(out, output);