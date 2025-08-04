import SidebarLayout from "../components/SidebarLayout";
import ListarUsuarios from "./ListarUsuario";
export default function Page () {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <SidebarLayout><ListarUsuarios /></SidebarLayout>
    </div>
  );
}