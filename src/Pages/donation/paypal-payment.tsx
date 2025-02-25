import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PayPalButtons,
  PayPalCardFieldsProvider,
  PayPalCVVField,
  PayPalExpiryField,
  PayPalNameField,
  PayPalNumberField,
  PayPalScriptProvider,
  usePayPalCardFields,
} from "@paypal/react-paypal-js";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function PaypalPayment() {
  const location = useLocation();
  const navigate = useNavigate();
  const { formData, paymentToken } = location.state || {};
  const searchParams = new URLSearchParams(location.search);
  const [isPaying, setIsPaying] = useState(false);
  const initialOptions = {
    clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID,
    disableFunding: "venmo",
    enableFunding: "",
    buyerCountry: "US",
    currency: "USD",
    dataPageType: "product-details",
    components: "buttons,card-fields",
    dataSdkIntegrationSource: "developer-studio",
    merchantId: "7ZCQPMDX93T4L",
  };

  const [billingAddress, setBillingAddress] = useState({
    addressLine1: "",
    addressLine2: "",
    adminArea1: "",
    adminArea2: "",
    countryCode: "",
    postalCode: "",
  });

  function handleBillingAddressChange(field: any, value: any) {
    setBillingAddress((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  async function createOrder() {
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cart: [
            {
              sku: "1blwyeo8",
              quantity: 1,
            },
          ],
        }),
      });

      const orderData = await response.json();

      if (orderData.id) {
        return orderData.id;
      } else {
        const errorDetail = orderData?.details?.[0];
        const errorMessage = errorDetail
          ? `${errorDetail.issue} ${errorDetail.description} (${orderData.debug_id})`
          : JSON.stringify(orderData);

        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error(error);
      return `Could not initiate PayPal Checkout...${error}`;
    }
  }

  async function onApprove(data: any, actions: any) {
    try {
      console.log(data, actions);
      const response = await fetch(`/api/orders/${data.orderID}/capture`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const orderData = await response.json();
      // Three cases to handle:
      //   (1) Recoverable INSTRUMENT_DECLINED -> call actions.restart()
      //   (2) Other non-recoverable errors -> Show a failure message
      //   (3) Successful transaction -> Show confirmation or thank you message

      const transaction =
        orderData?.purchase_units?.[0]?.payments?.captures?.[0] ||
        orderData?.purchase_units?.[0]?.payments?.authorizations?.[0];
      const errorDetail = orderData?.details?.[0];

      if (errorDetail || !transaction || transaction.status === "DECLINED") {
        // (2) Other non-recoverable errors -> Show a failure message
        let errorMessage;
        if (transaction) {
          errorMessage = `Transaction ${transaction.status}: ${transaction.id}`;
        } else if (errorDetail) {
          errorMessage = `${errorDetail.description} (${orderData.debug_id})`;
        } else {
          errorMessage = JSON.stringify(orderData);
        }

        throw new Error(errorMessage);
      } else {
        // (3) Successful transaction -> Show confirmation or thank you message
        // Or go to another URL:  actions.redirect('thank_you.html');
        console.log(
          "Capture result",
          orderData,
          JSON.stringify(orderData, null, 2)
        );
        return `Transaction ${transaction.status}: ${transaction.id}. See console for all available details`;
      }
    } catch (error) {
      return `Sorry, your transaction could not be processed...${error}`;
    }
  }

  function onError(error: any) {
    // Do something with the error from the SDK
    console.log(error);
  }

  // Verify payment token and parameters
  if (
    !formData ||
    !paymentToken ||
    searchParams.get("token") !== paymentToken
  ) {
    navigate("/donate");
    return null;
  }

  // Convert CFA to EUR (example rate)
  const eurAmount = (Number.parseInt(formData.amount) / 655.957).toFixed(2);

  return (
    <PayPalScriptProvider options={initialOptions}>
      <div className="container mx-auto py-10 px-4">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Complete Your PayPal Payment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="font-medium">
                Amount: {formData.amount} CFA ({eurAmount} EUR)
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                PayPal does not accept amounts in CFA Francs. Your donation will
                automatically be converted into euros.
              </p>
            </div>
            <PayPalButtons
              createOrder={createOrder}
              // @ts-expect-error
              onApprove={onApprove}
              onError={onError}
              style={{
                shape: "rect",
                layout: "vertical",
                color: "gold",
                label: "paypal",
              }}
            />

            <PayPalCardFieldsProvider
              createOrder={createOrder}
              // @ts-expect-error
              onApprove={onApprove}
              style={{
                input: {
                  "font-size": "16px",
                  "font-family": "courier, monospace",
                  "font-weight": "lighter",
                  color: "#ccc",
                },
                ".invalid": { color: "purple" },
              }}
            >
              <PayPalNameField
                style={{
                  input: { color: "blue" },
                  ".invalid": { color: "purple" },
                }}
              />
              <PayPalNumberField />
              <PayPalExpiryField />
              <PayPalCVVField />

              <input
                type="text"
                id="card-billing-address-line-2"
                name="card-billing-address-line-2"
                placeholder="Address line 1"
                onChange={(e) =>
                  handleBillingAddressChange("addressLine1", e.target.value)
                }
              />
              <input
                type="text"
                id="card-billing-address-line-2"
                name="card-billing-address-line-2"
                placeholder="Address line 2"
                onChange={(e) =>
                  handleBillingAddressChange("addressLine2", e.target.value)
                }
              />
              <input
                type="text"
                id="card-billing-address-admin-area-line-1"
                name="card-billing-address-admin-area-line-1"
                placeholder="Admin area line 1"
                onChange={(e) =>
                  handleBillingAddressChange("adminArea1", e.target.value)
                }
              />
              <input
                type="text"
                id="card-billing-address-admin-area-line-2"
                name="card-billing-address-admin-area-line-2"
                placeholder="Admin area line 2"
                onChange={(e) =>
                  handleBillingAddressChange("adminArea2", e.target.value)
                }
              />
              <input
                type="text"
                id="card-billing-address-country-code"
                name="card-billing-address-country-code"
                placeholder="Country code"
                onChange={(e) =>
                  handleBillingAddressChange("countryCode", e.target.value)
                }
              />
              <input
                type="text"
                id="card-billing-address-postal-code"
                name="card-billing-address-postal-code"
                placeholder="Postal/zip code"
                onChange={(e) =>
                  handleBillingAddressChange("postalCode", e.target.value)
                }
              />

              {/* Custom client component to handle card fields submission */}
              <SubmitPayment
                isPaying={isPaying}
                setIsPaying={setIsPaying}
                billingAddress={billingAddress}
              />
            </PayPalCardFieldsProvider>

            <div className="flex justify-start pt-4">
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
    </PayPalScriptProvider>
  );
}

const SubmitPayment = ({
  isPaying,
  setIsPaying,
  billingAddress,
}: {
  isPaying: boolean;
  setIsPaying: React.Dispatch<React.SetStateAction<boolean>>;
  billingAddress: {
    addressLine1: string;
    addressLine2: string;
    adminArea1: string;
    adminArea2: string;
    countryCode: string;
    postalCode: string;
  };
}) => {
  const { cardFieldsForm } = usePayPalCardFields();

  const handleClick = async () => {
    if (!cardFieldsForm) {
      const childErrorMessage =
        "Unable to find any child components in the <PayPalCardFieldsProvider />";

      throw new Error(childErrorMessage);
    }
    const formState = await cardFieldsForm.getState();

    if (!formState.isFormValid) {
      return alert("The payment form is invalid");
    }
    setIsPaying(true);

    // @ts-ignore
    cardFieldsForm.submit({ billingAddress }).catch(() => {
      setIsPaying(false);
    });
  };

  return (
    <Button
      className={isPaying ? "btn" : "btn btn-primary"}
      style={{ float: "right" }}
      onClick={handleClick}
    >
      {isPaying ? <div className="spinner tiny" /> : "Pay"}
    </Button>
  );
};
