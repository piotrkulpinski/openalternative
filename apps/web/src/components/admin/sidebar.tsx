"use client";

import { useState } from "react";
import { useMediaQuery } from "@mantine/hooks";
import { motion } from "framer-motion";
import { cx } from "cva";
import {
  CopyrightIcon,
  GalleryHorizontalEndIcon,
  GemIcon,
  GlobeIcon,
  LayoutDashboardIcon,
  LogOutIcon,
  MenuIcon,
  ReplaceIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Nav } from "~/components/admin/nav";
import { NavMain } from "~/components/admin/nav-main";
import { Separator } from "~/components/common/separator";
import { siteConfig } from "~/config/site";
import { signOut } from "~/lib/auth-client";

export const Sidebar = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [isOpen, setIsOpen] = useState(!isMobile); // Trạng thái sidebar mở hoặc đóng
  const router = useRouter();

  const handleSignOut = async () => {
    signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.success("You've been signed out successfully");
          router.push("/");
        },
      },
    });
  };

  return (
    <motion.div
      initial={{ width: isMobile ? 0 : 200 }}
      animate={{ width: isOpen ? 200 : 50 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="sticky top-0 h-dvh z-40 flex flex-col border-r bg-white dark:bg-gray-900 shadow-md"
    >
      {/* Nút Toggle Sidebar */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 m-2 rounded-md bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition"
      >
        <MenuIcon className="w-6 h-6" />
      </button>

      <Nav>
        <NavMain
          isCollapsed={!isOpen}
          links={[
            {
              title: "Dashboard",
              href: "/admin",
              prefix: <LayoutDashboardIcon />,
            },
          ]}
        />
      </Nav>

      <Separator />

      <Nav>
        <NavMain
          isCollapsed={!isOpen}
          links={[
            { title: "Tools", href: "/admin/tools", prefix: <GemIcon /> },
            { title: "Alternatives", href: "/admin/alternatives", prefix: <ReplaceIcon /> },
            { title: "Categories", href: "/admin/categories", prefix: <GalleryHorizontalEndIcon /> },
            { title: "Licenses", href: "/admin/licenses", prefix: <CopyrightIcon /> },
          ]}
        />
      </Nav>

      <Nav className="mt-auto">
        <NavMain
          isCollapsed={!isOpen}
          links={[
            { title: "Visit Site", href: siteConfig.url, prefix: <GlobeIcon /> },
            { title: "Sign Out", href: "#", onClick: handleSignOut, prefix: <LogOutIcon /> },
          ]}
        />
      </Nav>
    </motion.div>
  );
};
