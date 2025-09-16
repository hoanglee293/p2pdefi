"use client"

import { useState } from "react"
import { Button } from "@/ui/button"
import { Input } from "@/ui/input"
import { ChevronDown, Info } from "lucide-react"
import Image from "next/image"

export function MainView() {
    const [activeTab, setActiveTab] = useState<"buy" | "sell">("sell")
    const [sellAmount, setSellAmount] = useState("5.6074-60000")
    const [receiveAmount, setReceiveAmount] = useState("150000-1500000000")

    return (
        <div className="container mx-auto px-6 py-12 h-[calc(100vh-73px)] flex items-center justify-around">
            <div className="grid lg:grid-cols-2 gap-[20%] items-start w-full h-[80%]">
                {/* Left side - Branding */}
                <div className="flex flex-col items-center text-center">
                    {/* Large Golden X Logo */}
                    <div className="mb-8">
                        <Image src="/logo.png" alt="Logo" width={336} height={336} className="w-84 h-w-84" />
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

                <div className="bg-theme-gray-200 rounded-2xl w-full max-w-md p-1">
                    {/* Tabs */}
                    <div className="flex h-16 overflow-hidden shrink-0">
                        <button className={`flex-1 h-full rounded-tl-xl text-[#4f5867] ${activeTab === "buy" && "bg-theme-gray-900 !text-white"}`} onClick={() => setActiveTab("buy")}
                        >
                            Mua
                        </button>
                        <div className={`w-[48px] z-1 flex items-stretch mx-[-5px] ${activeTab === "sell" && "scale-x-[-1]"}`}>
                            <svg viewBox="5 0 52 64" xmlns="http://www.w3.org/2000/svg" fill="none" className="h-full w-full" preserveAspectRatio="none"><path d="M46.5 63.9994H5.70738L3.68042 64V0.000460991C-4.60053 -0.000104716 3.68042 9.4379e-06 3.68042 9.4379e-06V0.000460991C3.99404 0.000482416 4.3314 0.000504815 4.69387 0.000528233C14.6274 0.00116999 19.0234 9.51779 19.0234 9.51779L26.9905 32.5003L34.1162 53.2578C34.1162 53.2578 37.5 63.9994 46.5 63.9994Z" fill="#181A20"></path></svg>
                        </div>
                        <button className={`flex-1 h-full rounded-tr-xl text-[#4f5867] ${activeTab === "sell" && "bg-theme-gray-900 !text-white"}`} onClick={() => setActiveTab("sell")}
                        >
                            Bán
                        </button>
                    </div>

                    {/* Form Fields */}
                    <div className="space-y-4 p-6 bg-theme-gray-900">
                        {/* Bạn bán */}
                        <div>
                            <div className="bg-transparent rounded-lg p-3 border border-theme-gray-200">
                                <label className="text-[#ffffff] text-sm mb-2 block">Bạn bán</label>
                                <div className="flex items-center justify-between mb-2">
                                    <Input
                                        placeholder="5.6074-60000"
                                        className="bg-transparent border-none text-[#707a8a] !text-lg p-0 h-auto"
                                        value={sellAmount}
                                        onChange={(e) => setSellAmount(e.target.value)}
                                    />
                                    <div className="flex items-center gap-2">
                                        <div className="flex items-center gap-1 bg-transparent rounded px-2 py-1">
                                            <div className="w-4 h-4 bg-[#1fc16b] rounded-full flex items-center justify-center">
                                                <span className="text-[#ffffff] text-xs font-bold">T</span>
                                            </div>
                                            <span className="text-[#ffffff] text-sm">USDT</span>
                                            <ChevronDown className="h-3 w-3 text-[#ffffff]" />
                                        </div>
                                    </div>
                                </div>
                                {/* <div className="text-[#6e6e6e] text-xs">
                                    Số dư: 0.00 USDT <span className="text-[#ffa514]">Nạp thêm tiền</span>
                                </div> */}
                            </div>
                        </div>

                        {/* Bạn nhận được */}
                        <div>
                            <div className="bg-transparent rounded-lg p-3 border border-theme-gray-200">
                                <label className="text-[#ffffff] text-sm mb-2 block">Bạn nhận được</label>
                                <div className="flex items-center justify-between">
                                    <Input
                                        placeholder="150000-1500000000"
                                        className="bg-transparent border-none text-[#707a8a] !text-lg p-0 h-auto"
                                        value={receiveAmount}
                                        onChange={(e) => setReceiveAmount(e.target.value)}
                                    />
                                    <div className="flex items-center gap-1 bg-transparent rounded px-2 py-1">
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
                        <Button className="w-full bg-[#1fc16b] hover:bg-[#00ff78] text-[#000000] font-bold py-3 text-lg font-orbitron">
                            {activeTab === "buy" ? "MUA" : "BÁN"}
                        </Button>
                    </div>
                </div>
            </div>
        </div>

    )
}
