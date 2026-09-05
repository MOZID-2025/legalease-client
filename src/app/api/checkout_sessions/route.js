import { NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST() {
  try {
    const headersList = await headers();
    const origin = headersList.get("origin");

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID,
          quantity: 1,
        },
      ],
      mode: "subscription",

      success_url: `${origin}/hiring-history/success?session_id={CHECKOUT_SESSION_ID}`,

      cancel_url: `${origin}/hiring-history`,
    });

    return NextResponse.redirect(session.url, 303);
  } catch (err) {
    console.error("Stripe Checkout Error:", err);

    return NextResponse.json(
      {
        error: err.message,
      },
      {
        status: err.statusCode || 500,
      },
    );
  }
}
