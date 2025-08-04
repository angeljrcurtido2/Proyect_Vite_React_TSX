import SidebarLayout from "../components/SidebarLayout";
import Login from "./Login";
export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <SidebarLayout><Login /></SidebarLayout>
    </div>
  );
}