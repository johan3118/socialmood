'use client';

import { ReactNode, useEffect, useState } from 'react';
import Image from "next/image";
import BlurredContainer from "@/components/(socialmood)/blur-background";


interface MobileMessageProps {
    children: ReactNode;
}

export default function MobileMessage({ children }: MobileMessageProps) {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkIfMobile = () => {
            const isMobileDevice =
                /Mobi|Android/i.test(navigator.userAgent) || window.innerWidth < 1024;
            setIsMobile(isMobileDevice);
        };

        checkIfMobile();
        // Listen for window resize to dynamically update
        window.addEventListener('resize', checkIfMobile);

        return () => window.removeEventListener('resize', checkIfMobile);
    }, []);

    if (isMobile) {
        return (
            <div className="flex flex-col items-center justify-center w-full min-h-full h-screen bg-[#2C2436] p-4">
                <BlurredContainer customStyle='w-full space-y-4'>
                    <Image src={"/socialmood-logo.svg"} width={163} height={70} alt={""} />
                    <h1 className="text-center text-white font-bold">Esta aplicación no está disponible para dispositivos móviles</h1>
                    <h2 className="text-center text-white">Por favor, utilizar una computadora de escritorio o láptop para acceder a las funcionalidades de SocialMood</h2>
                </BlurredContainer>

            </div>
        );
    }

    return <>{children}</>;
}
