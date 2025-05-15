import React, { useState } from "react"
import { Menu, LogOut, User as UserIcon } from 'lucide-react'
import { NavLink, useNavigate, useLocation } from "react-router-dom"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import { UserAvatar } from "@/components/profilePage/avatar"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { useMediaQuery } from 'react-responsive'

import { useAuth } from "@/contexts/AuthProvider"

export default function TopNavbar() {
  const isMobile = useMediaQuery({ query: "(max-width: 1170px)" });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const { user, isLoggedIn, logout, openLoginModal, openRegisterModal } = useAuth();

  const navigateAndScroll = (sectionId) => {
    if (location.pathname !== "/") {
      navigate("/", { state: { scrollTo: sectionId } })
    } else {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" })
    }
  }

  const NavItems = ({ onClick = () => {} }) => (
    <>
      {isLoggedIn && (
        <NavLink
          to="/yourTrips"
          className="border-transparent hover:border-gray-400 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
          onClick={onClick}
        >
          Trips
        </NavLink>
      )}
      <button
        onClick={() => {
          navigateAndScroll("features")
          onClick()
        }}
        className="cursor-pointer border-transparent hover:border-gray-400 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
      >
        Features
      </button>
      <button
        onClick={() => {
          navigateAndScroll("why-keeptrek")
          onClick()
        }}
        className="cursor-pointer border-transparent hover:border-gray-400 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
      >
        Why
      </button>
      <button
        onClick={() => {
          navigateAndScroll("newsletter")
          onClick()
        }}
        className="cursor-pointer border-transparent hover:border-gray-400 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
      >
        Newsletter
      </button>
    </>
  )
  
  return (
    <>
      <nav className="sticky top-0 z-50 bg-white border-b shadow-sm ${className}">
        <div className="max-w-[100rem] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 py-1">
            <div className="flex items-center">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="mr-2 md:hidden">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                  <nav className="flex flex-col space-y-4 mt-4">
                    <NavItems onClick={() => setIsMobileMenuOpen(false)} />
                  </nav>
                </SheetContent>
              </Sheet>
              <div className="flex-shrink-0 flex items-center max-w-36">
                <NavLink to="/" className="text-2xl font-bold text-gray-800">
                  <img src="/assets/navbarlogo.png" alt="KeepTrek" className="object-scale-down" />
                </NavLink>
              </div>
            </div>
            <div className="hidden md:flex md:items-center md:space-x-4">
              <NavItems />
            </div>
            <div className="flex items-center">
              { isLoggedIn ? (
                <>
                  { !isMobile && (
                  <Button asChild className="mr-4 sm:inline-flex">
                    <NavLink
                      to="/create-trip"
                      className="border-transparent inline-flex text-sm font-semibold"
                    >
                      Create a Trip
                    </NavLink>
                  </Button>
                  )}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="icon" variant="ghost" className="m-2 rounded-full">
                        <UserAvatar 
                          userId={user}
                          className="h-12 w-12"
                        />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-48 mt-2">
                      <DropdownMenuItem onClick={() => navigate("/profile")} className="cursor-pointer">
                        <UserIcon className="mr-2 h-4 w-4" />
                        Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => logout()}  className="cursor-pointer text-red-500">
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                      </DropdownMenuItem> 
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <>
                  <Button
                    onClick={openLoginModal}
                    className="text-sm font-semibold"
                  >
                    Login
                  </Button>
                  <Button
                    onClick={openRegisterModal}
                    className="ml-2 text-sm font-semibold"
                  >
                    Register
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

    </>
  )
}
