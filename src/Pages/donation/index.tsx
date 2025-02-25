"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Building2,
  CreditCard,
  ShoppingCartIcon as PaypalIcon,
  Phone,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface DonationFormData {
  amount: string;
  frequency: "monthly" | "once";
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  paymentMethod: "card" | "paypal" | "bank" | "mtn";
  emailConsent: boolean;
}

export default function Donation() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<DonationFormData>({
    amount: "10000",
    frequency: "monthly",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    paymentMethod: "card",
    emailConsent: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Generate secure payment token and validation params
      const paymentToken = Math.random().toString(36).substring(7);
      const validationParams = new URLSearchParams({
        amount: formData.amount,
        token: paymentToken,
        ts: Date.now().toString(),
        method: formData.paymentMethod,
      });

      // Navigate to appropriate payment page with secure params
      switch (formData.paymentMethod) {
        case "mtn":
          navigate(`/donate/mtn?${validationParams.toString()}`, {
            state: { formData, paymentToken },
          });
          break;
        case "card":
          navigate(`/donate/stripe?${validationParams.toString()}`, {
            state: { formData, paymentToken },
          });
          break;
        case "paypal":
          navigate(`/donate/paypal?${validationParams.toString()}`, {
            state: { formData, paymentToken },
          });
          break;
        case "bank":
          navigate(`/donate/bank?${validationParams.toString()}`, {
            state: { formData, paymentToken },
          });
          break;
      }
    }
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Make a Donation</CardTitle>
          <CardDescription>
            Support our mission with your contribution
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <Label>Donation Amount (CFA)</Label>
                  <RadioGroup
                    defaultValue={formData.amount}
                    onValueChange={(value) =>
                      setFormData({ ...formData, amount: value })
                    }
                    className="grid grid-cols-3 gap-4 mt-2"
                  >
                    <div>
                      <RadioGroupItem
                        value="10000"
                        id="amount-10000"
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor="amount-10000"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        <span className="text-xl font-bold">10,000</span>
                        <span className="text-sm text-muted-foreground">
                          CFA
                        </span>
                      </Label>
                    </div>
                    <div>
                      <RadioGroupItem
                        value="35000"
                        id="amount-35000"
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor="amount-35000"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        <span className="text-xl font-bold">35,000</span>
                        <span className="text-sm text-muted-foreground">
                          CFA
                        </span>
                      </Label>
                    </div>
                    <div>
                      <RadioGroupItem
                        value="50000"
                        id="amount-50000"
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor="amount-50000"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        <span className="text-xl font-bold">50,000</span>
                        <span className="text-sm text-muted-foreground">
                          CFA
                        </span>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label>Frequency</Label>
                  <RadioGroup
                    defaultValue={formData.frequency}
                    onValueChange={(value: "monthly" | "once") =>
                      setFormData({ ...formData, frequency: value })
                    }
                    className="grid grid-cols-2 gap-4 mt-2"
                  >
                    <div>
                      <RadioGroupItem
                        value="monthly"
                        id="monthly"
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor="monthly"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        Monthly
                      </Label>
                    </div>
                    <div>
                      <RadioGroupItem
                        value="once"
                        id="once"
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor="once"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        One Time
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) =>
                        setFormData({ ...formData, firstName: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) =>
                        setFormData({ ...formData, lastName: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="flex">
                    <Select
                      defaultValue="237"
                      onValueChange={(value) => console.log(value)}
                    >
                      <SelectTrigger className="w-[100px]">
                        <SelectValue placeholder="Country" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="237">+237</SelectItem>
                        <SelectItem value="234">+234</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      id="phone"
                      type="tel"
                      className="flex-1 ml-2"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="emailConsent"
                    checked={formData.emailConsent}
                    onCheckedChange={(checked) =>
                      setFormData({
                        ...formData,
                        emailConsent: checked as boolean,
                      })
                    }
                  />
                  <Label htmlFor="emailConsent">
                    I allow "AllSmartAllStar" to email me information about my
                    donation
                  </Label>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <Label>Payment Method</Label>
                <RadioGroup
                  defaultValue={formData.paymentMethod}
                  onValueChange={(value: "card" | "paypal" | "bank" | "mtn") =>
                    setFormData({ ...formData, paymentMethod: value })
                  }
                  className="grid gap-4"
                >
                  <div>
                    <RadioGroupItem
                      value="card"
                      id="card"
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor="card"
                      className="flex items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      <div className="flex items-center gap-3">
                        <CreditCard className="h-5 w-5" />
                        <span>Credit/Debit Card</span>
                      </div>
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem
                      value="paypal"
                      id="paypal"
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor="paypal"
                      className="flex items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      <div className="flex items-center gap-3">
                        <PaypalIcon className="h-5 w-5" />
                        <span>PayPal</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        Converts to EUR
                      </span>
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem
                      value="bank"
                      id="bank"
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor="bank"
                      className="flex items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      <div className="flex items-center gap-3">
                        <Building2 className="h-5 w-5" />
                        <span>Bank Transfer</span>
                      </div>
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem
                      value="mtn"
                      id="mtn"
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor="mtn"
                      className="flex items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      <div className="flex items-center gap-3">
                        <Phone className="h-5 w-5" />
                        <span>MTN Money</span>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            )}

            <div className="flex justify-between pt-4">
              {step > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(step - 1)}
                >
                  Previous
                </Button>
              )}
              <Button type="submit" className="ml-auto">
                {step === 3 ? "Proceed to Payment" : "Continue"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
