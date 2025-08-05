// app/lib/getDirectories.ts
import fs from "node:fs";
import path from "node:path";

export function getDirectories(srcPath: string): string[] {
	return fs
		.readdirSync(srcPath)
		.filter((file) => fs.statSync(path.join(srcPath, file)).isDirectory());
}
