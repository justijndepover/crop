#!/usr/bin/env node
import { program } from 'commander';
import { resolve } from 'path';
import { existsSync, mkdirSync, readdirSync } from 'fs';
import sharp from 'sharp';

program
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

const options = program.opts();
const args: string[] = program.args;
const path = resolve(process.cwd(), args[0]);
const outputpath = process.cwd() + '/' + (args[1] == 'null' ? '' : args[1]) + 'x' + (args[2] == 'null' ? '' : args[2]);

if (! existsSync(path)) {
    console.log(`The directory ${args[0]} doesn't exist`);
    process.exit();
}

if (! existsSync(outputpath)) {
    mkdirSync(outputpath);
}

sharp.cache(false);

for (const file of readdirSync(path)) {
    sharp(`${path}/${file}`)
        .resize({
            width: +args[1],
            height: +args[2],
            fit: options.whitespace ? 'contain' : 'cover',
            background: { r: 255, g: 255, b: 255 }
        })
        .toFile(`${outputpath}/${file}`);
}