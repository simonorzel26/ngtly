import { db } from "@ngtly/db";
import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

// Disable caching for this route
export const fetchCache = "force-no-store";
export const revalidate = 0;
export const dynamic = "force-dynamic";
export const dynamicParams = true;

if (!process.env.STRIPE_SECRET_KEY) {
	throw new Error("STRIPE_SECRET_KEY is not defined");
}
if (!process.env.STRIPE_WEBHOOK_SECRET) {
	throw new Error("STRIPE_WEBHOOK_SECRET is not defined");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
	apiVersion: "2024-06-20",
});

const handleCheckoutSessionAsyncPaymentFailed = async (
	session: Stripe.Checkout.Session,
) => {
	console.log("Checkout session async payment failed:", session);
	// Add your logic here (e.g., updating your database, sending a notification, etc.)
	return new NextResponse("Success", { status: 200 });
};

const handleCheckoutSessionAsyncPaymentSucceeded = async (
	session: Stripe.Checkout.Session,
) => {
	console.log("Checkout session async payment succeeded:", session);
	// Add your logic here (e.g., updating your database, sending a notification, etc.)
	return new NextResponse("Success", { status: 200 });
};

const handlePaymentIntentCreated = async (
	paymentIntent: Stripe.PaymentIntent,
) => {
	console.log("PaymentIntent created:", paymentIntent);
	// Add your logic here (e.g., updating your database, sending a notification, etc.)
	return new NextResponse("Success", { status: 200 });
};

const handlePaymentIntentPaymentFailed = async (
	paymentIntent: Stripe.PaymentIntent,
) => {
	console.log("PaymentIntent payment failed:", paymentIntent);
	// Add your logic here (e.g., updating your database, sending a notification, etc.)
	return new NextResponse("Success", { status: 200 });
};

const handlePaymentIntentSucceeded = async (
	paymentIntent: Stripe.PaymentIntent,
) => {
	console.log("PaymentIntent succeeded:", paymentIntent);
	const { id } = paymentIntent;
	const setAllPromotionsToPaid = await db.promotedEvent.updateMany({
		where: {
			stripePaymentId: id,
		},
		data: {
			paid: true,
		},
	});

	if (!setAllPromotionsToPaid) {
		console.error(
			`Error setting all promotions to paid for paymentIntentId: ${id}`,
		);
		return new NextResponse("Error", { status: 500 });
	}

	return new NextResponse("Success", { status: 200 });
};

export async function POST(request: NextRequest) {
	if (!process.env.STRIPE_WEBHOOK_SECRET) {
		throw new Error("STRIPE_WEBHOOK_SECRET is not defined");
	}
	const headerPayload = headers();
	const signature = headerPayload.get("stripe-signature");

	const rawBody = await request.text();

	try {
		if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) return;
		const event = stripe.webhooks.constructEvent(
			rawBody,
			signature,
			process.env.STRIPE_WEBHOOK_SECRET,
		);

		// Handle the event
		switch (event.type) {
			case "checkout.session.async_payment_failed": {
				const asyncPaymentFailedSession = event.data
					.object as Stripe.Checkout.Session;
				await handleCheckoutSessionAsyncPaymentFailed(
					asyncPaymentFailedSession,
				);
				break;
			}
			case "checkout.session.async_payment_succeeded": {
				const asyncPaymentSucceededSession = event.data
					.object as Stripe.Checkout.Session;
				await handleCheckoutSessionAsyncPaymentSucceeded(
					asyncPaymentSucceededSession,
				);
				break;
			}
			case "payment_intent.created": {
				const createdPaymentIntent = event.data.object as Stripe.PaymentIntent;
				await handlePaymentIntentCreated(createdPaymentIntent);
				break;
			}
			case "payment_intent.payment_failed": {
				const paymentFailedPaymentIntent = event.data
					.object as Stripe.PaymentIntent;
				await handlePaymentIntentPaymentFailed(paymentFailedPaymentIntent);
				break;
			}
			case "payment_intent.succeeded": {
				const succeededPaymentIntent = event.data
					.object as Stripe.PaymentIntent;
				await handlePaymentIntentSucceeded(succeededPaymentIntent);
				break;
			}
			default:
				console.warn(`Unhandled event type ${event.type}`);
		}
	} catch (err) {
		console.log(`Error message: ${(err as Error).message}`);
		return new Response(`Webhook Error: ${(err as Error).message}`, {
			status: 400,
		});
	}

	return new NextResponse("Success", { status: 200 });
}
