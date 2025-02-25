import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import Footer from "@/components/navigation/footer";
import Header from "@/components/navigation/header";
import { AnimatePresence } from "framer-motion";
import { Outlet, useLocation } from "react-router-dom";

const AppLayout = () => {
  const location = useLocation();
  const isDonationPage = location.pathname === "/donate";
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col justify-between">
      <Header showDonateButton={!isDonationPage} />
      <main className="flex-1">
        <MaxWidthWrapper>
          <AnimatePresence mode="wait">
            <Outlet />
          </AnimatePresence>
        </MaxWidthWrapper>
      </main>
      <Footer />
    </div>
  );
};

export default AppLayout;
