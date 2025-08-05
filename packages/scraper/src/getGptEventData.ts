import OpenAI from "openai";

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY as string,
});

export const getGptEventData = async (prompt: string, html: string) =>
	await openai.chat.completions.create({
		model: process.env.GPT_MODEL as string,
		response_format: { type: "json_object" },
		messages: [
			{
				role: "system",
				content:
					"You are a web scraper, an expert in extracting data from HTML. You are given a context prompt and some HTML code to extract data from. Your goal is to extract the raw data from the HTML code using the context prompt and return it in a JSON format with the schema provided.",
			},
			{
				role: "user",
				content: `${prompt}\n\n${html}`,
			},
		],
	});
