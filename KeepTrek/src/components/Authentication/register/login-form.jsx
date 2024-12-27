import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"

export default function LoginForm() {
  return (
<Card className="w-full max-w-6xl overflow-hidden flex flex-col md:flex-row relative border-none ">
{/* Left Side - Login Form */}
      <div className="w-full md:w-5/12 p-8 bg-white">
        <div className="space-y-6">
          {/* Social Login Buttons */}
          <Button 
            variant="outline" 
            className="w-full flex items-center justify-center gap-2 bg-white hover:bg-gray-50"
            onClick={() => {}}
          >
            <img src="./src/assets/dummy-image.jpg" alt="Google" width={20} height={20} />
            Sign up with Google
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full flex items-center justify-center gap-2 bg-white hover:bg-gray-50"
            onClick={() => {}}
          >
            <img src="./src/assets/dummy-image.jpg" alt="Microsoft" width={20} height={20} />
            Sign up with Microsoft
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full flex items-center justify-center gap-2 bg-white hover:bg-gray-50"
            onClick={() => {}}
          >
            <img src="./src/assets/dummy-image.jpg" alt="Apple" width={20} height={20} />
            Sign up with Apple
          </Button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                or sign up with email
              </span>
            </div>
          </div>

          {/* Email Form */}
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                className="w-full bg-white"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                className="w-full bg-white"
              />
            </div>
          </div>

          <div className="text-sm text-center">
            <a href="/login" className="text-gray-500 hover:text-gray-700">
              Have an account?
            </a>
          </div>

          <Button className="w-full bg-teal-500 hover:bg-teal-600 text-white">
            Register
          </Button>
        </div>
      </div>

      {/* Right Side - Hero Image */}
      <div className="relative w-full md:w-7/12 border-transparent">
        <div className="absolute inset-0">
          <img
            src="./src/assets/loginCard.png"
            alt="Yosemite Valley"
            width={800}
            height={1000}
            className="object-cover w-full h-full"
            priority
          />
          
        </div>
        
        
      </div>
    </Card>
  )
}

