"use client"

import { useState } from "react"
import { Button } from "@/ui/button"
import { Input } from "@/ui/input"
import { ChevronDown, Info } from "lucide-react"

export function MainView() {
    const [activeTab, setActiveTab] = useState<"buy" | "sell">("sell")
    const [sellAmount, setSellAmount] = useState("5.6074-60000")
    const [receiveAmount, setReceiveAmount] = useState("150000-1500000000")

    return (
        <div className="container mx-auto px-6 py-12 h-[calc(100vh-73px)] flex items-center justify-around">
            <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
                {/* Left side - Branding */}
                <div className="flex flex-col items-center text-center">
                    {/* Large Golden X Logo */}
                    <div className="mb-8">
                        <img src="/logo.png" alt="Logo" className="w-84 h-w-84" />
                    </div>

                    {/* Brand Text */}
                    <div className="space-y-4">
                        <h1 className="relative text-[45.67px] inline-block font-orbitron text-transparent !bg-clip-text [background:linear-gradient(180deg,_#ead027,_#d8a817_36.06%,_#c98107_58.17%,_#f3e030_84.62%)] [-webkit-background-clip:text] [-webkit-text-fill-color:transparent] text-center font-bold">GOLDEN X</h1>
                        <h2 className="relative text-[40px] inline-block font-orbitron text-white text-center font-bold">
                            GIAO DỊCH NHANH P2P
                            <br />
                            TRÊN GOLDEN X
                        </h2>
                    </div>
                </div>

                <div className="bg-theme-gray-200 rounded-lg w-full max-w-md">
                    {/* Tabs */}
                    <div className="flex">
                        <Button
                            variant={activeTab === "buy" ? "default" : "ghost"}
                            className={`flex-1 rounded-r-none ${activeTab === "buy" ? "bg-[#4a5568] text-[#ffffff]" : "bg-[#3a3a3a] text-[#6e6e6e] hover:text-[#ffffff]"
                                }`}
                            onClick={() => setActiveTab("buy")}
                        >
                            Mua
                        </Button>
                        <Button
                            variant={activeTab === "sell" ? "default" : "ghost"}
                            className={`flex-1 rounded-l-none ${activeTab === "sell" ? "bg-[#4a5568] text-[#ffffff]" : "bg-[#3a3a3a] text-[#6e6e6e] hover:text-[#ffffff]"
                                }`}
                            onClick={() => setActiveTab("sell")}
                        >
                            Bán
                        </Button>
                    </div>

                    {/* Form Fields */}
                    <div className="space-y-4 p-6">
                        {/* Bạn bán */}
                        <div>
                            <label className="text-[#ffffff] text-sm mb-2 block">Bạn bán</label>
                            <div className="bg-[#3a3a3a] rounded-lg p-3">
                                <div className="flex items-center justify-between mb-2">
                                    <Input
                                        placeholder="5.6074-60000"
                                        className="bg-transparent border-none text-[#ffffff] text-lg p-0 h-auto"
                                        value={sellAmount}
                                        onChange={(e) => setSellAmount(e.target.value)}
                                    />
                                    <div className="flex items-center gap-2">
                                        <span className="text-[#ffa514] text-sm">Tất cả</span>
                                        <div className="flex items-center gap-1 bg-[#4a4a4a] rounded px-2 py-1">
                                            <div className="w-4 h-4 bg-[#1fc16b] rounded-full flex items-center justify-center">
                                                <span className="text-[#ffffff] text-xs font-bold">T</span>
                                            </div>
                                            <span className="text-[#ffffff] text-sm">USDT</span>
                                            <ChevronDown className="h-3 w-3 text-[#ffffff]" />
                                        </div>
                                    </div>
                                </div>
                                <div className="text-[#6e6e6e] text-xs">
                                    Số dư: 0.00 USDT <span className="text-[#ffa514]">Nạp thêm tiền</span>
                                </div>
                            </div>
                        </div>

                        {/* Bạn nhận được */}
                        <div>
                            <label className="text-[#ffffff] text-sm mb-2 block">Bạn nhận được</label>
                            <div className="bg-[#3a3a3a] rounded-lg p-3">
                                <div className="flex items-center justify-between">
                                    <Input
                                        placeholder="150000-1500000000"
                                        className="bg-transparent border-none text-[#ffffff] text-lg p-0 h-auto"
                                        value={receiveAmount}
                                        onChange={(e) => setReceiveAmount(e.target.value)}
                                    />
                                    <div className="flex items-center gap-1 bg-[#4a4a4a] rounded px-2 py-1">
                                        <div className="w-4 h-4 bg-[#dc2626] rounded-full flex items-center justify-center">
                                            <span className="text-[#ffffff] text-xs font-bold">₫</span>
                                        </div>
                                        <span className="text-[#ffffff] text-sm">VND</span>
                                        <ChevronDown className="h-3 w-3 text-[#ffffff]" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Payment Method */}
                        <Button className="w-full bg-[#d9d9d9] text-[#000000] hover:bg-[#e4e4e4] py-3">Chuyển khoản ngân hàng</Button>

                        {/* Exchange Rate Info */}
                        <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-1">
                                <span className="text-[#6e6e6e]">Giá ước tính</span>
                                <Info className="h-3 w-3 text-[#6e6e6e]" />
                            </div>
                            <span className="text-[#ffffff]">1 USDT = 26,750 VND</span>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                            <span className="text-[#6e6e6e]">Phí</span>
                            <span className="text-[#ffffff]">0.1000%</span>
                        </div>

                        {/* Action Button */}
                        <Button className="w-full bg-[#1fc16b] hover:bg-[#00ff78] text-[#000000] font-semibold py-3 text-lg">
                            MUA VND
                        </Button>
                    </div>
                </div>
            </div>
        </div>

    )
}
