import { Outlet } from "react-router-dom";

export const PageLayout = () => {
  return (
    <>
      <nav aria-label="hovedmeny" />
      <Outlet />
    </>
  );
};
