import StripeCheckoutForm from "@/components/stripe-checkout-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useLocation, useNavigate } from "react-router-dom";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY!);

export default function StripePayment() {
  const location = useLocation();
  const navigate = useNavigate();
  const { formData, paymentToken } = location.state || {};
  const searchParams = new URLSearchParams(location.search);

  // Verify payment token and parameters
  if (
    !formData ||
    !paymentToken ||
    searchParams.get("token") !== paymentToken
  ) {
    navigate("/donate");
    return null;
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Complete Your Card Payment</CardTitle>
        </CardHeader>
        <CardContent>
          <Elements stripe={stripePromise}>
            <StripeCheckoutForm
              amount={Number.parseInt(formData.amount)}
              currency="XAF"
              paymentToken={paymentToken}
            />
          </Elements>
        </CardContent>
      </Card>
    </div>
  );
}
