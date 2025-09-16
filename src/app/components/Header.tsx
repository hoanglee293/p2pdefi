import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/ui/button"
import { Settings, Bell, ChevronDown, User, LogOut, Wallet, Mail, Calendar, UserCircle } from "lucide-react"
import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/ui/dropdown-menu";

interface WalletInfo {
  address: string;
  balance?: number;
}

export function Header() {
    const { logout, user, getProfile, isLoading } = useAuth();
    const [walletInfo, setWalletInfo] = useState<WalletInfo | null>(null);
    const [isProfileLoading, setIsProfileLoading] = useState(false);

    // Load user profile and wallet info
    useEffect(() => {
      const loadProfile = async () => {
        if (user && !walletInfo) {
          setIsProfileLoading(true);
          try {
            const result = await getProfile();
            if (result.success && result.wallet) {
              setWalletInfo({
                address: result.wallet.address,
                balance: 0 // You can add balance calculation here
              });
            }
          } catch (error) {
            console.error('Failed to load profile:', error);
          } finally {
            setIsProfileLoading(false);
          }
        } else if (!user) {
          // Reset wallet info when user logs out
          setWalletInfo(null);
          setIsProfileLoading(false);
        }
      };

      loadProfile();
    }, [user, walletInfo, getProfile]);

    // Format wallet address for display
    const formatWalletAddress = (address: string) => {
      if (!address) return "0x0000...0000";
      return `${address.slice(0, 6)}...${address.slice(-4)}`;
    };

    // Get user display name
    const getUserDisplayName = () => {
      if (!user) return "Guest";
      return user.ufulllname || user.uname || "User";
    };

    // Get user avatar
    const getUserAvatar = () => {
      if (!user || !user.uavatar) return null;
      return user.uavatar;
    };

    const handleLogout = async () => {
      try {
        await logout();
        // Reset local state after logout
        setWalletInfo(null);
        setIsProfileLoading(false);
        window.location.reload();
      } catch (error) {
        console.error('Logout failed:', error);
      }
    }
  return (
    <header className="bg-[#000000] border-b border-[#333333] px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left side - Logo and Navigation */}
        <div className="flex items-center gap-8">
          <img src="/logo.png" alt="Logo" className="w-10 h-10" />
          <nav className="flex items-center gap-6">
            <Button variant="ghost" className="text-[#ffffff] hover:text-[#ffa514]">
              Mua bán
            </Button>
            <Button variant="ghost" className="text-[#ffffff] hover:text-[#ffa514]">
              Wallet
            </Button>
          </nav>
        </div>

        {/* Right side - Balance and User */}
        <div className="flex items-center gap-4">
          <div className="text-[#ffffff] text-sm">
            {isProfileLoading ? "Loading..." : "0.00000 SOL ($0.00)"}
          </div>
          <Button variant="ghost" size="icon" className="text-[#ffffff]">
            <Settings className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-[#ffffff]">
            <Bell className="h-5 w-5" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="text-[#ffffff] flex items-center gap-2">
                {getUserAvatar() ? (
                  <img 
                    src={getUserAvatar()!} 
                    alt="User Avatar" 
                    className="w-5 h-5 rounded-full object-cover" 
                  />
                ) : (
                  <User className="w-5 h-5" />
                )}
                {isProfileLoading ? "Loading..." : getUserDisplayName()}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80 bg-[#1a1a1a] border-[#333333] text-white">
              <DropdownMenuLabel className="text-[#ffa514] font-semibold">
                User Profile
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-[#333333]" />
              
              {/* User Info Section */}
              <div className="px-2 py-3">
                <div className="flex items-center gap-3 mb-3">
                  {getUserAvatar() ? (
                    <img 
                      src={getUserAvatar()!} 
                      alt="User Avatar" 
                      className="w-12 h-12 rounded-full object-cover" 
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-[#333333] flex items-center justify-center">
                      <UserCircle className="w-8 h-8 text-[#666666]" />
                    </div>
                  )}
                  <div>
                    <div className="font-semibold text-white">
                      {isProfileLoading ? "Loading..." : getUserDisplayName()}
                    </div>
                    <div className="text-sm text-[#999999]">
                      @{user?.uname || "username"}
                    </div>
                  </div>
                </div>
                
                {/* User Details */}
                {user && (
                  <div className="space-y-2 text-sm">
                    {user.uemail && (
                      <div className="flex items-center gap-2 text-[#cccccc]">
                        <Mail className="w-4 h-4 text-[#ffa514]" />
                        <span className="truncate">{user.uemail}</span>
                      </div>
                    )}
                    {user.ubirthday && (
                      <div className="flex items-center gap-2 text-[#cccccc]">
                        <Calendar className="w-4 h-4 text-[#ffa514]" />
                        <span>{user.ubirthday}</span>
                      </div>
                    )}
                    {user.usex && (
                      <div className="flex items-center gap-2 text-[#cccccc]">
                        <User className="w-4 h-4 text-[#ffa514]" />
                        <span className="capitalize">{user.usex}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              <DropdownMenuSeparator className="bg-[#333333]" />
              
              {/* Wallet Info Section */}
              {walletInfo && (
                <>
                  <DropdownMenuLabel className="text-[#ffa514] font-semibold">
                    Wallet Information
                  </DropdownMenuLabel>
                  <div className="px-2 py-2">
                    <div className="flex items-center gap-2 text-sm text-[#cccccc]">
                      <Wallet className="w-4 h-4 text-[#ffa514]" />
                      <span className="font-mono text-xs">
                        {formatWalletAddress(walletInfo.address)}
                      </span>
                    </div>
                    <div className="text-xs text-[#999999] mt-1">
                      Balance: 0.00000 SOL ($0.00)
                    </div>
                  </div>
                  <DropdownMenuSeparator className="bg-[#333333]" />
                </>
              )}
              
              {/* Action Items */}
              <DropdownMenuItem className="text-[#cccccc] hover:bg-[#333333] hover:text-white cursor-pointer">
                <Wallet className="w-4 h-4 mr-2" />
                Manage Wallets
              </DropdownMenuItem>
              
              <DropdownMenuSeparator className="bg-[#333333]" />
              
              {/* Logout Button */}
              <DropdownMenuItem 
                className="text-red-400 hover:bg-red-900/20 hover:text-red-300 cursor-pointer"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
