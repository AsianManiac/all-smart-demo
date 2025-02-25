import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

export default function BankTransfer() {
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
          <CardTitle>Complete Your Bank Transfer</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">
              Bank Transfer Details for {formData.amount} CFA francs
              {formData.frequency === "monthly" ? "/month" : ""}
            </h3>
            <p className="text-sm text-muted-foreground">
              Reference: {paymentToken}
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <Label>Bank Name</Label>
              <Input value="ECOBANK" readOnly />
            </div>
            <div>
              <Label>Account Name</Label>
              <Input value="AllSmartAllStarTV" readOnly />
            </div>
            <div>
              <Label>Account Number</Label>
              <Input value="1234567890" readOnly />
            </div>
            <div>
              <Label>SWIFT/BIC</Label>
              <Input value="ECOCMCX" readOnly />
            </div>
            <div>
              <Label>Reference (Important)</Label>
              <Input value={paymentToken} readOnly />
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm">
              Please include the reference number in your transfer description
              to help us track your donation.
            </p>
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
