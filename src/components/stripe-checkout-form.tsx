import type React from "react";

import { Button } from "@/components/ui/button";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface StripeCheckoutFormProps {
  amount: number;
  currency: string;
  paymentToken: string;
}

export default function StripeCheckoutForm({
  amount,
  currency,
  paymentToken,
}: StripeCheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);

    // Create payment intent on your server
    const response = await fetch("/api/create-payment-intent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount,
        currency,
        paymentToken,
      }),
    });

    const data = await response.json();

    if (!data.clientSecret) {
      setError("Payment failed. Please try again.");
      setProcessing(false);
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) return;

    const { error: stripeError, paymentIntent } =
      await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: cardElement,
        },
      });

    if (stripeError) {
      setError(stripeError.message || "Payment failed");
    } else if (paymentIntent.status === "succeeded") {
      navigate("/donate/success", {
        state: { paymentToken },
      });
    }

    setProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-yellow-50 p-4 rounded-lg">
        <p className="font-medium">
          Amount: {amount} {currency}
        </p>
        <p className="text-sm text-muted-foreground">
          Reference: {paymentToken}
        </p>
      </div>

      <div className="space-y-4">
        <div className="border rounded-md p-4">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: "16px",
                  color: "#424770",
                  "::placeholder": {
                    color: "#aab7c4",
                  },
                },
                invalid: {
                  color: "#9e2146",
                },
              },
            }}
          />
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg">{error}</div>
        )}
      </div>

      <div className="flex justify-between pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate("/donate")}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Return
        </Button>
        <Button type="submit" disabled={!stripe || processing}>
          {processing ? "Processing..." : "Pay Now"}
        </Button>
      </div>
    </form>
  );
}
