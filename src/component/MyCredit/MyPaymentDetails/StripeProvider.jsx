import React from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

// Use environment variable
const stripePublicKey = import.meta.env.VITE_STRIPE_KEY;

if (!stripePublicKey) {
  throw new Error("Stripe public key is missing in environment variables");
}
const stripePromise = loadStripe(stripePublicKey);

const StripeProvider = ({ children }) => (
  <Elements stripe={stripePromise}>{children}</Elements>
);

export default StripeProvider;
