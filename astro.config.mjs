// @ts-check
import { defineConfig, fontProviders } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	site: 'https://suky.org',
	output: 'static',

	// Para cambiar la tipografía basta con tocar `name` (y los pesos) aquí
	// y la variable --display en src/styles/global.css.
	fonts: [
		{
			provider: fontProviders.google(),
			name: 'Baloo 2',
			cssVariable: '--font-baloo',
			weights: ['400 800'],
			styles: ['normal'],
			subsets: ['latin', 'latin-ext'],
			fallbacks: ['system-ui', '-apple-system', 'sans-serif'],
		},
	],
});
