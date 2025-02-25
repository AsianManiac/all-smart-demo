import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { Outlet } from "react-router-dom";

const ShowLayout = () => {
  return (
    <MaxWidthWrapper>
      <Outlet />
    </MaxWidthWrapper>
  );
};

export default ShowLayout;
