import svelte from 'rollup-plugin-svelte';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import json from '@rollup/plugin-json';
import preprocess from 'svelte-preprocess';
import css from 'rollup-plugin-css-only';
import copy from 'rollup-plugin-copy';
import pkg from "./package.json";

const production = !process.env.ROLLUP_WATCH;

export default {
	input: 'src/index.js',
	output: [
		{
			file: pkg.module,
			format: "es",
			sourcemap: true,
			name: pkg.name,
			inlineDynamicImports: true
		},
		{
			file: pkg.main,
			format: "umd",
			name: pkg.name,
			sourcemap: true,
			inlineDynamicImports: true
		},
	],
	watch: {
		include: [
			'./src/**/*.(svelte|js)'
		]
	},
	plugins: [
		svelte({
			preprocess: preprocess(),
			emitCss: true
		}),
		copy({
			targets: [
				{ src: './src/assets/**/*', dest: './dist/assets' }
			]
		}),
		css({ output: 'svelte-ui.css' }),
		json(),
		resolve(),
		commonjs(),
		production && terser()
	],
};
