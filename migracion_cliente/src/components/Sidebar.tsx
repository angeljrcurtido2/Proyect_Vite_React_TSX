import {
  useEffect,
  useRef,
  useState,
  useCallback,
  type ComponentType,
  type SVGProps,
} from "react";
import { getDataUser } from "../services/usuarios";
import { TiThMenu } from "react-icons/ti";
import { AiOutlineSmallDash } from "react-icons/ai";
import {
  ChevronDownIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useUserStore } from "../../store/useUserStore";
import clsx from "clsx";
import api from "../lib/axiosConfig";

interface SubItem {
  name: string;
  path: string;
  pro?: boolean;
  new?: boolean;
}

interface NavItem {
  name: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  path?: string;
  subItems?: SubItem[];
}

interface UserData {
  acceso: string;
  nombreUsuario: string
}

const InitialUserData = {
  acceso: "",
  nombreUsuario: ""
}

export interface AppSidebarProps {
  navItems: NavItem[];
  isExpanded: boolean;
  setIsExpanded: (val: boolean) => void;
}


const AppSidebar = ({
  navItems,
  isExpanded,
  setIsExpanded,
}: AppSidebarProps) => {

  const { pathname } = useLocation();
  const navigate = useNavigate();
  const resetStore = useUserStore((s) => s.resetStore);

  const [openSubmenu, setOpenSubmenu] = useState<number | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<number, number>>({});
  const [userData, setUserData] = useState<UserData>(InitialUserData)
  const subMenuRefs = useRef<Record<number, HTMLUListElement | null>>({});
  const sidebarRef = useRef<HTMLDivElement>(null);


  const isActive = useCallback((path: string) => pathname === path, [pathname]);

  const collapseAll = () => {
    setIsExpanded(false);
    setOpenSubmenu(null);
  };

  useEffect(() => {
    navItems.forEach((nav, idx) => {
      if (!nav.subItems) return;
      if (nav.subItems.some((s) => isActive(s.path))) {
        setOpenSubmenu(idx);
      }
    });
  }, [pathname, navItems, isActive]);

  useEffect(() => {
    if (openSubmenu === null) return;
    const el = subMenuRefs.current[openSubmenu];
    if (el) {
      setSubMenuHeight((prev) => ({ ...prev, [openSubmenu]: el.scrollHeight }));
    }
  }, [openSubmenu]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target as Node)) {
        collapseAll();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const handleSubmenuToggle = (idx: number) => {
    setOpenSubmenu((prev) => (prev === idx ? null : idx));
  };

  const handleUserData = async () => {
    if (!localStorage.getItem('usuario')) return;
    const res = await getDataUser();
    setUserData(res.data);
  };

  useEffect(() => {
    handleUserData()
  }, [])

  const getInitials = (fullName = '') =>
    fullName
      .trim()
      .split(' ')
      .map(w => w[0] || '')
      .join('')
      .toUpperCase()
      .slice(0, 2);

  const initials = getInitials(userData.nombreUsuario);
  const handleLogout = async () => {
    try {
      await api.post("/auth/logout"); 
      localStorage.removeItem("usuario");
      resetStore();
      setUserData(InitialUserData);
      navigate("/login");
    } catch (err) {
      console.error("Error al cerrar sesión:", err);
    }
  };

  return (
    <aside
      ref={sidebarRef}
      onClick={() => setIsExpanded(true)}
      className={clsx(
        "fixed top-0 left-0 z-50 h-screen overflow-y-auto border-r border-gray-200 bg-white p-4 shadow-lg transition-all duration-300 ease-in-out",
        isExpanded ? "w-72" : "w-24"
      )}
    >
      <div
        className={clsx(
          "mb-6 flex items-center gap-2 transition-all duration-300",
          isExpanded ? "justify-start" : "justify-center"
        )}
      >
        <TiThMenu className="h-6 w-6 rounded-sm bg-[#465fff] text-white" />
        {isExpanded && <span className="text-2xl font-bold text-black">Panel</span>}
      </div>
      {isExpanded && (
        <div className="mb-6 flex items-center gap-3 rounded-lg bg-indigo-50 p-2 pr-3 shadow-sm">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#465fff] font-semibold text-white">
            {initials}
          </div>
          <div className="leading-4">
            <p className="text-[11px] uppercase text-gray-400">Bienvenido</p>
            <p className="font-medium text-gray-700">{userData.nombreUsuario}</p>
          </div>
        </div>
      )}
      <p
        className={clsx(
          "pb-3 uppercase leading-5 text-gray-400 transition-all",
          isExpanded ? "text-xs" : "text-2xl flex justify-center"
        )}
      >
        {isExpanded ? "Menú" : <AiOutlineSmallDash />}
      </p>
      <ul className="space-y-2">
        {navItems.map((nav, idx) => {
          const Icon = nav.icon;

          const baseBtnClasses =
            "flex w-full items-center justify-between rounded-lg px-3 py-3 text-sm font-medium transition";
          const expandedBtnClasses = isExpanded
            ? "text-gray-800 hover:bg-gray-100"
            : "justify-center text-[#465fff] bg-[#ecf3ff]";
          const activeBtnClasses =
            openSubmenu === idx ? "bg-[#ecf3ff] text-[#465fff]" : "";

          return (
            <li key={nav.name}>
              {nav.subItems ? (
                <>
                  <button
                    onClick={() => handleSubmenuToggle(idx)}
                    className={clsx(baseBtnClasses, expandedBtnClasses, activeBtnClasses)}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="h-5 w-5" />
                      {isExpanded && <span>{nav.name}</span>}
                    </div>
                    {isExpanded && (
                      <ChevronDownIcon
                        className={clsx(
                          "h-5 w-5 transition-transform",
                          openSubmenu === idx && "rotate-180"
                        )}
                      />
                    )}
                  </button>
                  {isExpanded && (
                    <ul
                      ref={(el) => {
                        subMenuRefs.current[idx] = el;
                      }}
                      className="overflow-hidden pl-10 transition-all duration-300"
                      style={{
                        height: openSubmenu === idx ? subMenuHeight[idx] : 0,
                      }}
                    >
                      {nav.subItems.map((s) => (
                        <li key={s.name}>
                          <Link
                            to={s.path}
                            className={clsx(
                              "block rounded-md px-2 py-3 mt-1 text-sm font-medium transition ",
                              isActive(s.path)
                                ? "bg-[#ecf3ff] text-[#465fff]"
                                : "text-gray-800 hover:bg-gray-100"
                            )}
                          >
                            {s.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              ) : (
                nav.path && (
                  <Link
                    to={nav.path}
                    className={clsx(
                      "flex items-center gap-3 rounded-lg px-3 py-3 font-semibold transition",
                      isActive(nav.path)
                        ? "bg-gray-600 text-white"
                        : "text-gray-800 hover:bg-blue-100"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    {isExpanded && <span>{nav.name}</span>}
                  </Link>
                )
              )}
            </li>
          );
        })}
      </ul>
      {isExpanded && (
        <div className="mt-10 rounded-2xl bg-gray-100 px-4 py-5 dark:bg-white/5">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-2 rounded-lg bg-[#465fff] px-3 py-2 font-semibold text-white transition hover:bg-blue-500"
          >
            <ArrowRightOnRectangleIcon className="h-5 w-5" />
            <span>Cerrar sesión</span>
          </button>
        </div>
      )}
    </aside>
  );
};

export default AppSidebar;
