import Header from "@/layouts/Header/Header";
import DashboardLayout from "@/layouts/DashboardLayout/DashboardLayout";
import MaintenancePage from "./MaintenancePage";
import CenteredLayout from "@/layouts/CenteredLayout";

const HomePage = () => {
  return (
    <CenteredLayout>
      <MaintenancePage />
    </CenteredLayout>
    // <div className="h-full flex flex-col">
    //   <Header />
    //   <DashboardLayout />
    // </div>
  );
};

export default HomePage;
