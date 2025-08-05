import puppeteer, { type Page, type Browser } from "puppeteer";

async function createPage(page: Page): Promise<void> {
	await page.setViewport({ width: 1280, height: 720 });
	await page.setRequestInterception(true);

	page.on("request", async (request) => {
		const type = request.resourceType();
		if (
			type === "image" ||
			type === "font" ||
			type === "stylesheet" ||
			type === "media" ||
			type === "other"
		) {
			await request.abort();
		} else {
			await request.continue();
		}
	});

	await page.setJavaScriptEnabled(true);
	await page.setExtraHTTPHeaders({
		"user-agent":
			"Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36",
		"upgrade-insecure-requests": "1",
		accept:
			"text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
		"accept-encoding": "gzip, deflate, br",
		"accept-language": "en-US,en;q=0.9,en;q=0.8",
	});
}

export const puppeteerInstance = async () => {
	const browser = await puppeteer.launch({ headless: true });
	const page = await browser.newPage();

	await createPage(page);

	return { page, browser };
};

export const closePuppeteer = async (browser: Browser) => {
	await browser.close();
};

export const navigateToPage = async (page: Page, url: string) => {
	let html: string | null = null;

	try {
		console.log(`Attempting to navigate to ${url}`);

		await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });
		html = await page.content(); // Fetch the HTML content
	} catch (error) {
		console.error(`Error navigating to ${url}: ${(error as Error).message}`);
	}

	if (!html) {
		throw new Error(`Failed to navigate to ${url}`);
	}

	return html;
};
