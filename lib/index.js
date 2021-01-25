#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var commander_1 = require("commander");
var path_1 = require("path");
var fs_1 = require("fs");
var sharp_1 = __importDefault(require("sharp"));
commander_1.program
    .version('0.0.1')
    .description("Bulk crop images inside a folder")
    .arguments('<source> <width> <height>')
    .description('test command', {
    source: 'The source directory',
    width: 'The width of the new images',
    height: 'The height of the new images'
})
    .option('-w, --whitespace', 'Add whitespace around the cropped images')
    .parse(process.argv);
var options = commander_1.program.opts();
var args = commander_1.program.args;
var path = path_1.resolve(process.cwd(), args[0]);
var outputpath = process.cwd() + '/' + (args[1] == 'null' ? '' : args[1]) + 'x' + (args[2] == 'null' ? '' : args[2]);
if (!fs_1.existsSync(path)) {
    console.log("The directory " + args[0] + " doesn't exist");
    process.exit();
}
if (!fs_1.existsSync(outputpath)) {
    fs_1.mkdirSync(outputpath);
}
sharp_1.default.cache(false);
for (var _i = 0, _a = fs_1.readdirSync(path); _i < _a.length; _i++) {
    var file = _a[_i];
    sharp_1.default(path + "/" + file)
        .resize({
        width: +args[1],
        height: +args[2],
        fit: options.whitespace ? 'contain' : 'cover',
        background: { r: 255, g: 255, b: 255 }
    })
        .toFile(outputpath + "/" + file);
}
