import SignInForm from "@/components/sign-in-form";

const SignIn = () => {
  return (
    <div className="mx-auto px-4 py-8 flex flex-col gap-6 justify-center items-center min-h-screen">
      <img src="/images/logo.svg" className="h-16" alt="Allsmart Allstar" />
      <SignInForm />
    </div>
  );
};

export default SignIn;
