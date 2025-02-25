import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

export default function MtnPayment() {
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
          <CardTitle>Complete Your MTN Money Payment</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">
              Thank you for your valuable support of {formData.amount} CFA
              francs/month
            </h3>
            <p className="text-sm text-muted-foreground">
              Reference: {paymentToken}
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">To finalize your donation:</h4>
            <div className="space-y-4">
              <p>
                You just have to send your donation to AllSmartAllStarTV's MTN
                Money account:
              </p>

              <div className="flex justify-center py-4">
                <img
                  src="/images/mtn-momo.png"
                  alt="MTN Money"
                  className="h-24"
                />
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-medium">If you have an MTN Money account:</p>
                <ol className="list-decimal list-inside space-y-2 mt-2">
                  <li>Dial *237#</li>
                  <li>Select option 1 (money transfer)</li>
                  <li>Enter the amount: {formData.amount} CFA</li>
                  <li>Enter the reference: {paymentToken}</li>
                  <li>Confirm with your PIN</li>
                </ol>
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={() => navigate("/donate")}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Return to donation page
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
