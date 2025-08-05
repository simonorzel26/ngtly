export interface QueuedRequest {
	internalId: string;
	url: string;
	promptVersion: string;
	promptEndpoint: string;
	returnEndpoint: string;
}

// Type guard to check if an object is a QueuedRequest
export const isQueuedRequest = (
	object: QueuedRequest,
): object is QueuedRequest => {
	return (
		object.internalId !== undefined &&
		object.url !== undefined &&
		object.promptVersion !== undefined &&
		object.promptEndpoint !== undefined &&
		object.returnEndpoint !== undefined
	);
};

export interface QueuedRequestWithPrompt {
	dbId: string;
}

export const isQueuedRequestWithPrompt = (
	object: QueuedRequestWithPrompt,
): object is QueuedRequestWithPrompt => {
	return object.dbId !== undefined;
};

export interface QueuedHtml {
	dbId: string;
}

export const isQueuedHtml = (
	object: QueuedRequestWithPrompt,
): object is QueuedRequestWithPrompt => {
	return object.dbId !== undefined;
};

export interface QueuedGptResponse {
	dbId: string;
}

export const isQueuedGptResponse = (
	object: QueuedRequestWithPrompt,
): object is QueuedRequestWithPrompt => {
	return object.dbId !== undefined;
};
export interface QueuedImageResponse {
	internalId: string;
	url: string;
	promptVersion: string;
	promptEndpoint: string;
	returnEndpoint: string;
}

// Type guard to check if an object is a QueuedRequest
export const isQueuedImageResponse = (
	object: QueuedImageResponse,
): object is QueuedImageResponse => {
	return (
		object.internalId !== undefined &&
		object.url !== undefined &&
		object.promptVersion !== undefined &&
		object.promptEndpoint !== undefined &&
		object.returnEndpoint !== undefined
	);
};
