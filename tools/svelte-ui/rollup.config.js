import svelte from 'rollup-plugin-svelte';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import json from '@rollup/plugin-json';
import preprocess from 'svelte-preprocess';
import css from 'rollup-plugin-css-only';
import alias from '@rollup/plugin-alias';
import pkg from "./package.json";
import path from "path";

const production = !process.env.ROLLUP_WATCH;

export default {
	input: 'src/index.js',
	output: [
		{
			file: pkg.module,
			format: "es",
			sourcemap: true,
			name: pkg.name,
			inlineDynamicImports: true,
			globals: {
				rjxs: "rxjs",
				loader: "@monaco-editor/loader",
			}
		},
		{
			file: pkg.main,
			format: "umd",
			name: pkg.name,
			sourcemap: true,
			inlineDynamicImports: true,
			globals: {
				rjxs: "rxjs",
				loader: "@monaco-editor/loader"
			}
		},
	],
	external: Object.keys(pkg.dependencies),
	watch: {
		include: [
			'./src/**/*.(svelte|js)'
		]
	},
	plugins: [
		alias({
			entries: {
				'@fortawesome': path.resolve(__dirname, 'node_modules/@fortawesome')
			}
		}),
		svelte({
			preprocess: preprocess(),
			emitCss: true
		}),
		css({ output: 'svelte-ui.css' }),
		json(),
		resolve({
      browser: true,
      dedupe: ["svelte"],
    }),
		commonjs(),
		production && terser()
	],
};
