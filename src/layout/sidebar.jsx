import {
  ArrowDownUp,
  ChartColumnStacked,
  Database,
  MessageSquareText,
  LayoutDashboard,
} from "lucide-react";
import React from "react";
import { useLocation } from "react-router-dom";

const SideBar = () => {
  const location = useLocation();
  const pathname = location?.pathname;

  const navItems = [
    { label: "Dashboard", icon: LayoutDashboard, href: "/" },
    { label: "Products", icon: Database, href: "/products" },
    { label: "Category", icon: ChartColumnStacked, href: "/categoryPage" },
    { label: "Orders", icon: ArrowDownUp, href: "/orders" },
    { label: "Chat", icon: MessageSquareText, href: "/chat" },
  ];

  return (
    <div className="h-full bg-white border-r shadow-lg">
      <div className="h-full flex flex-col justify-between">
        <div className="p-6 overflow-y-auto custom-scrollbar">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Admin Panel
          </h2>
          <nav className="space-y-2">
            {navItems.map(({ label, icon: Icon, href }) => (
              <a
                key={label}
                href={href}
                className={`flex items-center gap-3 rounded-lg px-4 py-2 text-sm font-medium transition ${
                  pathname === href
                    ? "bg-green-200 text-green-800"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <Icon className="h-5 w-5" />
                {label}
              </a>
            ))}
          </nav>
        </div>
        <div className="px-6 py-4 border-t text-xs text-gray-400">
          &copy; {new Date().getFullYear()} Growvana
        </div>
      </div>
    </div>
  );
};

export default SideBar;
