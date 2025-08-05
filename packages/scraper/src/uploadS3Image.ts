import { type PutObjectCommandInput, S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import fetch from "node-fetch"; // Ensure you have node-fetch installed

// Configure AWS SDK
const s3Client = new S3Client({
	region: process.env.AWS_REGION || "eu-central-1",
	credentials: {
		accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
	},
});

const bucketName = process.env.AWS_IMAGE_BUCKET || "";

/**
 * Uploads an image from a URL to an S3 bucket.
 *
 * @param imageUrl - The URL of the image to upload.
 * @param bucketName - The name of the S3 bucket.
 * @param key - The key (path/filename) under which to store the image.
 * @returns The URL of the uploaded image.
 */
export async function uploadImageToS3(
	imageUrl: string,
	key: string,
): Promise<string> {
	try {
		// Fetch the image from the given URL
		const response = await fetch(imageUrl);
		if (!response.ok) {
			throw new Error("Failed to fetch image from URL");
		}

		const contentType = response.headers.get("content-type");
		const imageBuffer = await response.arrayBuffer();

		// Upload the image to S3
		const uploadParams: PutObjectCommandInput = {
			Bucket: bucketName,
			Key: key,
			Body: Buffer.from(imageBuffer),
			ContentType: contentType || "application/octet-stream",
		};

		const parallelUploads3 = new Upload({
			client: s3Client,
			params: uploadParams,
			leavePartsOnError: false,
		});

		parallelUploads3.on("httpUploadProgress", (progress) => {
			console.log(progress);
		});

		await parallelUploads3.done();

		// Return the URL of the uploaded image
		return `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
	} catch (error) {
		console.error("Error uploading image to S3:", error);
		throw new Error("Failed to upload image to S3");
	}
}
