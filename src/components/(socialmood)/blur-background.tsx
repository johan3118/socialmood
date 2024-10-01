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
    "relative flex flex-col items-center justify-center p-6 md:p-10 max-w-full w-[90%] md:w-[600px] border border-white/80 rounded-[30px] md:rounded-[50px] m-4 z-49 drop-shadow-xl";

  const variantStyles =
    variant === "blur"
      ? "bg-gradient-to-b from-white/20 via-white/10 to-white/5 backdrop-blur-lg"
      : "";

  const inlineStyle =
    variant === "rose"
      ? {
          background:
            "linear-gradient(123.02deg, #FFFFFF -183.77%, #D24EA6 92.72%)",
        }
      : {};

  return (
    <div
      className={`${baseStyles} ${variantStyles} ${customStyle}`}
      style={inlineStyle}
    >
      {children}
    </div>
  );
};

export default BlurredContainer;
