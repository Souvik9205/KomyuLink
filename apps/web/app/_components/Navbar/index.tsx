"use client";
import React from "react";
import { useState } from "react";
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "@/components/ui/navbar";
import { ModeToggle } from "../themeToggle";

function SharedNavbar() {
  const navItems = [
    {
      name: "Resources",
      link: "/resources",
    },
    {
      name: "Events",
      link: "/events",
    },
    {
      name: "Leaderboard",
      link: "/leaderboard",
    },
    {
      name: "Redeem",
      link: "/redeem",
    },
    {
      name: "Contact",
      link: "/contact",
    },
  ];
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  return (
    <div className="w-full sticky top-5 z-50 ">
      <Navbar>
        {/* Desktop Navigation */}
        <NavBody>
          <NavbarLogo />
          <NavItems items={navItems} />
          <div className="flex items-center gap-2">
            <NavbarButton variant="theme">
              <ModeToggle />
            </NavbarButton>
            <NavbarButton variant="primary">Login 🚀 </NavbarButton>
          </div>
        </NavBody>

        {/* Mobile Navigation */}
        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo />
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </MobileNavHeader>

          <MobileNavMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
            className="flex flex-col items-center justify-center pt-4 dark:bg-neutral-900/95 bg-neutral-100/95 backdrop-blur-3xl dark:backdrop:blur-3xl"
          >
            {navItems.map((item, idx) => (
              <a
                key={`mobile-link-${idx}`}
                href={item.link}
                onClick={() => setIsMobileMenuOpen(false)}
                className="relative text-neutral-600 dark:text-neutral-300"
              >
                <span className="block">{item.name}</span>
              </a>
            ))}
            <div className="flex w-full flex-col gap-4 justify-center items-center">
              <NavbarButton
                onClick={() => setIsMobileMenuOpen(false)}
                variant="theme"
                className="w-fit"
              >
                <ModeToggle />
              </NavbarButton>
              <NavbarButton
                onClick={() => setIsMobileMenuOpen(false)}
                variant="primary"
                className="w-full"
              >
                Login 🚀
              </NavbarButton>
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
    </div>
  );
}

export default SharedNavbar;
