"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PostTypeDropdown } from "@/components/posts/post-type-dropdown";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AccountSwitcher } from "@/components/account/account-switcher";
import { useNDKCurrentPubkey } from "@nostr-dev-kit/ndk-hooks";
import { NostrAvatar } from "@/ui/atoms/NostrAvatar";

const navigationItems = [
  { name: "Dashboard", path: "/dashboard" },
  { name: "Posts", path: "/dashboard/posts" },
  { name: "Subscribers", path: "/dashboard/subscribers" },
  { name: "Recommendations", path: "/dashboard/recommendations" },
  { name: "Settings", path: "/dashboard/settings" },
];

export function Navigation() {
  const currentPubkey = useNDKCurrentPubkey();
  const router = useRouter();
  const pathname = usePathname();

  const [activeStyle, setActiveStyle] = useState({ left: 0, width: 0 });
  const tabRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const activeIndex = navigationItems.findIndex(
      (item) =>
        pathname === item.path || (item.path !== "/dashboard" && pathname.startsWith(item.path + "/"))
    );

    const activeTab = tabRefs.current[activeIndex];
    if (activeTab) {
      const { offsetLeft, offsetWidth } = activeTab;
      setActiveStyle({ left: offsetLeft, width: offsetWidth });
    }
  }, [pathname]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <header className="sticky top-0 z-10 w-full border-b bg-background">
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <AccountSwitcher />
        </div>

        <nav className="relative">
          <div
            className="absolute bottom-[-14px] h-[2px] bg-[#0e0f11] dark:bg-white transition-all duration-300 ease-out"
            style={{ left: activeStyle.left, width: activeStyle.width }}
          />

          <div className="flex space-x-[6px] items-center">
            {navigationItems.map((item, index) => (
              <div
                key={item.name}
                ref={(el) => (tabRefs.current[index] = el)}
                onClick={() => router.push(item.path)}
                className={`px-3 py-2 cursor-pointer transition-colors duration-300 h-[30px] text-sm font-medium whitespace-nowrap flex items-center justify-center
                  ${pathname.startsWith(item.path)
                    ? "text-[#0e0e10] dark:text-white"
                    : "text-[#0e0f1199] dark:text-[#ffffff99]"
                  }`}
              >
                {item.name}
              </div>
            ))}
          </div>
        </nav>

        <div className="flex items-center gap-4">
          <PostTypeDropdown variant="default" size="sm" buttonText="Create" showIcon={false} />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full p-0">
                <NostrAvatar pubkey={currentPubkey} size={32} className="h-8 w-8" alt="User" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={toggleDarkMode}>
                <div className="flex items-center gap-2">
                {isDarkMode ? (<>
                  <Sun className="h-[1.2rem] w-[1.2rem]" />
                  <span>Light Mode</span>
                </>) : (<>
                  <Moon className="h-[1.2rem] w-[1.2rem]" />
                  <span>Dark Mode</span>
                </>)}
                </div>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
