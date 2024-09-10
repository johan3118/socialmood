import { ReactNode } from "react";

interface BlurredContainerProps {
  children: ReactNode;
  variant?: "blur" | "rose";
  customStyle?: string;
}

const BlurredContainer: React.FC<BlurredContainerProps> = ({
  children,
  variant = "blur",
  customStyle = "",
}) => {
  const baseStyles =
    "relative flex flex-col items-center justify-center p-6 md:p-10 max-w-full w-[90%] md:w-[600px] border border-white/80 rounded-[30px] md:rounded-[50px] m-4 z-50 drop-shadow-xl";

  const variantStyles =
    variant === "blur"
      ? "bg-gradient-to-b from-white/20 via-white/10 to-white/5 backdrop-blur-lg"
      : "bg-gradient-to-b from-pink-300 via-rose-400 to-rose-500";

  return (
    <div className={`${baseStyles} ${variantStyles} ${customStyle}`}>
      {children}
    </div>
  );
};

export default BlurredContainer;
