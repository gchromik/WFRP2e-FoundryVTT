import fs from "fs";
import path from "path";
import getSystemPath from "./foundry-path.mjs";
import copy from 'rollup-plugin-copy-watch';
import postcss from "rollup-plugin-postcss"
import jscc from 'rollup-plugin-jscc';
import typescript from '@rollup/plugin-typescript';

let manifest = JSON.parse(fs.readFileSync("./system.json"))

let systemPath = getSystemPath(manifest.id)

// Ensure systemPath is defined with a fallback
if (!systemPath) {
    console.warn("Warning: systemPath is undefined! Using './dist' as fallback.");
    systemPath = "./dist";
}

console.log("Bundling to " + systemPath)
export default {
    // Use the minimal TypeScript file for proof of concept
    input: [path.resolve(`./wfrp4e-minimal.ts`), path.resolve(`./style/${manifest.id}.scss`)],
    output: {
        dir: systemPath,
        entryFileNames: 'wfrp4e.js', // Ensure the output is named wfrp4e.js as expected by Foundry
        sourcemap: true
    },
    watch: {
        clearScreen: true
    },
    plugins: [
        typescript({
            tsconfig: './tsconfig.json',
            sourceMap: true,
            inlineSources: true,
            exclude: ["node_modules/**", "dist/**", "wfrp4e.ts"],
            noEmitOnError: false // Continue with the build even when there are TypeScript errors
        }),
        jscc({
            values: { _ENV: process.env.NODE_ENV }
        }),
        copy({
            targets: [
                { src: "./template.json", dest: systemPath },
                { src: "./system.json", dest: systemPath },
                { src: "./WFRP-Header.jpg", dest: systemPath },
                { src: "./static/**/*", dest: systemPath }
            ],
            watch: process.env.NODE_ENV == "production" ? false : ["./static/**/*", "system.json", "template.json"]
        }),
        postcss({
            extract: `${manifest.id}.css`,
            plugins: []
        })
    ],
    onwarn(warning, warn) {
        // suppress eval warnings
        if (warning.code === 'EVAL') return
        // suppress fvtt-types warnings
        if (warning.code === 'CIRCULAR_DEPENDENCY' && warning.message.includes('node_modules/fvtt-types')) return
        warn(warning)
    }
}