import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { X } from "lucide-react";

interface SignInFormProps {
  onClose?: () => void;
}

const SignInForm = ({ onClose }: SignInFormProps) => {
  return (
    <Card className="overflow-hidden min-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Sign In</CardTitle>
        <CardDescription>
          Login with your Apple or Google account
        </CardDescription>
      </CardHeader>
      <CardContent className="max-w-md">
        {onClose && (
          <Button
            onClick={onClose}
            className="float-right text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </Button>
        )}
        {/* <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </Label>
          <Input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            required
          />
        </div>
        <div>
          <Label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </Label>
          <Input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            required
          />
        </div>
        <Button
          type="submit"
          className="w-full bg-indigo-600 text-white rounded-md py-2 px-4 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
        >
          Sign In
        </Button>
      </form> */}
        <div className="mt-4">
          <Button
            size={"lg"}
            variant={"outline"}
            onClick={() => console.log("Sign in with Google")}
            className="w-full bg-white text-gray-700 flex items-center justify-center"
          >
            <img
              src="/images/google-logo.svg"
              alt="Google logo"
              className="w-6 h-6 mr-2"
            />
            Continue with Google
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SignInForm;
