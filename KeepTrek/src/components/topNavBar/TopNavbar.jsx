'use client'

import React, { useEffect, useState } from "react"
import { Bell, User, Menu, LogOut, User as UserIcon } from 'lucide-react'
import { NavLink, useNavigate, useLocation } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import Modal from "@/components/Authentication/Modal"
import LoginForm from "@/components/Authentication/login/login-form"
import RegisterForm from "@/components/Authentication/register/register-form"
import { Link as ScrollLink } from "react-scroll"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import { UserAvatar } from "@/components/profilePage/avatar"
import { CurrentUser } from '@/APIs/auth';  
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"

export default function TopNavbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState(null)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [userId, setUserId] = useState(null)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token")
      if (token) {
        try {
          const currentUserId = await CurrentUser()
          setUserId(currentUserId)
          const storedUser = JSON.parse(localStorage.getItem("user"))
          setUser(storedUser || { username: "Guest" })
          setIsLoggedIn(true)
        } catch (error) {
          console.error('Error fetching user:', error)
          handleLogout()
        }
      } else {
        setIsLoggedIn(false)
      }
    }
    fetchUserData()
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setIsLoggedIn(false)
    setUser(null)
    navigate("/")
  }

  const navigateAndScroll = (sectionId) => {
    if (location.pathname !== "/") {
      navigate("/", { state: { scrollTo: sectionId } })
    } else {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" })
    }
  }

  const NavItems = ({ onClick = () => {} }) => (
    <>
      <NavLink
        to="/yourTrips"
        className="border-transparent hover:border-gray-400 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
        onClick={onClick}
      >
        Trips
      </NavLink>
      <button
        onClick={() => {
          navigateAndScroll("features")
          onClick()
        }}
        className="cursor-pointer border-transparent hover:border-gray-400 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium text-gray-600"
      >
        Features
      </button>
      <button
        onClick={() => {
          navigateAndScroll("pre-launch")
          onClick()
        }}
        className="cursor-pointer border-transparent hover:border-gray-400 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium text-gray-600"
      >
        Pricing
      </button>
      <button
        onClick={() => {
          navigateAndScroll("newsletter")
          onClick()
        }}
        className="cursor-pointer border-transparent hover:border-gray-400 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium text-gray-600"
      >
        Newsletter
      </button>
    </>
  )

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white border-b shadow-sm">
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
                  <img src="/assets/KeepTrekNew.png" alt="KeepTrek" className="object-scale-down" />
                </NavLink>
              </div>
            </div>
            <div className="hidden md:flex md:items-center md:space-x-4">
              <NavItems />
            </div>
            <div className="flex items-center">
              {isLoggedIn ? (
                <>
                  <Button asChild className="mr-4 sm:inline-flex">
                    <NavLink
                      to="/create-trip"
                      className="border-transparent inline-flex text-sm font-semibold"
                    >
                      Create a Trip
                    </NavLink>
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="icon" variant="ghost" className="m-2 rounded-full">
                        <UserAvatar 
                          userId={userId}
                          className="h-12 w-12"
                        />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-48 mt-2">
                      <DropdownMenuItem onClick={() => navigate("/profile")} className="cursor-pointer">
                        <UserIcon className="mr-2 h-4 w-4" />
                        Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleLogout}  className="cursor-pointer text-red-500">
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <>
                  <Button
                    onClick={() => setIsLoginModalOpen(true)}
                    className="text-sm font-semibold"
                  >
                    Login
                  </Button>
                  <Button
                    onClick={() => setIsRegisterModalOpen(true)}
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

      <Modal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)}>
        <LoginForm onSwitchToRegister={() => {
          setIsLoginModalOpen(false)
          setIsRegisterModalOpen(true)
        }} />
      </Modal>

      <Modal isOpen={isRegisterModalOpen} onClose={() => setIsRegisterModalOpen(false)}>
        <RegisterForm onSwitchToLogin={() => {
          setIsRegisterModalOpen(false)
          setIsLoginModalOpen(true)
        }} />
      </Modal>
    </>
  )
}