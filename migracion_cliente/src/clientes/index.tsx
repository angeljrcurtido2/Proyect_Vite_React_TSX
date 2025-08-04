import SidebarLayout from "../components/SidebarLayout"
import ListarCliente from "./components/ListarCliente"

export default function Page () {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-100">
            <SidebarLayout><ListarCliente /></SidebarLayout>
        </div>
    )
}