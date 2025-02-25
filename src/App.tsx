import AppLayout from "@/Layouts/AppLayout";
import ShowLayout from "@/Layouts/show-layout";
import { HomePage, ShowsPage, ViewShowPage } from "@/Pages";
import { Route, Routes } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/shows/" element={<ShowLayout />}>
          <Route index element={<ShowsPage />} />
          <Route path=":showId" element={<ViewShowPage />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
