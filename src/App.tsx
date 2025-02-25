import AppLayout from "@/Layouts/AppLayout";
import ShowLayout from "@/Layouts/show-layout";
import {
  AboutPage,
  ContactPage,
  DonationPage,
  HomePage,
  SchedulePage,
  ShowsPage,
  SignInPage,
  ViewShowPage,
} from "@/Pages";
import { Route, Routes } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route path="/sign-in" element={<SignInPage />} />
      <Route element={<AppLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/donate" element={<DonationPage />} />
        <Route path="/schedule" element={<SchedulePage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/shows/" element={<ShowLayout />}>
          <Route index element={<ShowsPage />} />
          <Route path=":showId" element={<ViewShowPage />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
