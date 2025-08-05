import OpenAI from "openai";

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY as string,
});

export const createEventImage = async (prompt: string) => {
	const response = await openai.images.generate({
		model: "dall-e-3",
		prompt: prompt,
		quality: "standard",
		n: 1,
		size: "1024x1024",
	});
	const imageUrl = response?.data[0]?.url;

	return imageUrl;
};
