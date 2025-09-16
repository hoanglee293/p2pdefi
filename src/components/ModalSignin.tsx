"use client"
import { useLang } from "@/lang";
import React from "react";
import Image from "next/image";

interface ModalSigninProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ModalSignin({ isOpen, onClose }: ModalSigninProps) {
const { t } = useLang();
  if (!isOpen) return null;
  const handleGoogleSignIn = async () => {
    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI}&response_type=code&scope=email%20profile&access_type=offline`
    console.log("handleGoogleSignIn")
  }


  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 top-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50"
      onClick={handleOverlayClick}
    >
      <div className="p-5 bg-[#0E0E0E] rounded-lg shadow-[0px_0px_4px_0px_rgba(232,232,232,0.50)] dark:shadow-[0px_0px_4px_0px_rgba(0,0,0,0.50)] outline outline-1 outline-offset-[-1px] outline-indigo-500 backdrop-blur-[5px] inline-flex justify-start items-end gap-1">
        <div className="w-full max-w-96 md:w-96 inline-flex flex-col justify-start items-center gap-4">
          <div className="self-stretch inline-flex justify-between items-center">
            <div className="justify-start text-indigo-500 dark:text-indigo-400 text-lg font-semibold uppercase leading-relaxed">
              {t('header.wallet.connect')}
            </div>
          </div>
          <div className="flex flex-col justify-start items-center gap-1.5">
            <div className="justify-start text-white text-lg font-medium uppercase leading-relaxed">
              {t('header.wallet.welcome')}
            </div>
            <div className="justify-start text-white text-sm font-normal leading-tight">
              {t('header.wallet.connect_with_us')}
            </div>
          </div>
          <div className="inline-flex justify-start items-center gap-4 md:gap-20 mt-5">
            <div
              data-property-1="Frame 427320434"
              className="w-12 inline-flex flex-col justify-start items-center gap-1"
            >
              <div className="self-stretch h-12 relative">
                <div className="w-12 h-12 left-0 top-0 absolute rounded-full bg-gray-100 dark:bg-gray-800"  />
                <div className="w-7 h-7 left-[10px] top-[10px] absolute overflow-hidden cursor-pointer" onClick={handleGoogleSignIn}>
                  <Image
                    src="https://img.icons8.com/color/48/google-logo.png"
                    alt="google"
                    width={28}
                    height={28}
                  />
                </div>
              </div>
              <div className="self-stretch text-center justify-start text-white text-sm font-normal leading-tight mt-2">
                Google
              </div>
            </div>
            <div className="inline-flex flex-col justify-start items-center gap-1">
              <div className="self-stretch h-12 relative">
                <div className="w-12 h-12 left-0 top-0 absolute rounded-full bg-gray-100 dark:bg-gray-800" />
                <div className="w-7 h-7 left-[10px] top-[10px] absolute overflow-hidden cursor-pointer" onClick={() => window.open(`${process.env.NEXT_PUBLIC_TELEGRAM_BOT_URL}=${sessionStorage.getItem('ref')}`, "_blank")}>
                  <Image
                    src="https://img.icons8.com/color/48/telegram-app.png"
                    alt="telegram"
                    width={28}
                    height={28}
                  />
                </div>
              </div>
              <div className="text-center justify-start text-white text-sm font-normal leading-tight mt-2">
                Telegram
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
