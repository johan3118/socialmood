import { ReactNode } from "react";

interface BlurredContainerProps {
  children: ReactNode;
}

const BlurredContainer: React.FC<BlurredContainerProps> = ({ children }) => {
  return (
    <div
      className="relative flex flex-col items-center justify-center
                 p-6 md:p-10 max-w-full w-[90%] md:w-[600px]
                 bg-gradient-to-b from-white/20 via-white/10 to-white/5 backdrop-blur-lg drop-shadow-xl
                 border border-white/80 rounded-[30px] md:rounded-[50px]
                 m-4 z-50"
    >
      {children}
    </div>
  );
};

export default BlurredContainer;
