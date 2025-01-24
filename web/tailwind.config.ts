import type { Config } from "tailwindcss";
import daisyui from "daisyui";

export default {
	content: ["./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}"],
	theme: {},
	plugins: [daisyui],
} satisfies Config;
