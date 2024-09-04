import { Button } from "@/components/ui/button";
import SocialButton from "@/components/(socialmood)/SocialButton";

export default async function ComponentsPage() {
  return (
    <div className="w-full flex space-x-3 rounded-lg bg-gray-600 p-6 shadow dark:bg-gray-800 sm:p-8 mx-2">
      <SocialButton
        size="defaultBold"
        variant="default"
        defaultText="@tutienda.do"
        icon="ig"
      ></SocialButton>{" "}
      <SocialButton
        size="lg"
        variant="blue"
        defaultText="@tutienda.do"
        icon="fb"
      ></SocialButton>{" "}
      <SocialButton
        size="sm"
        variant="green"
        defaultText="@tutienda.do"
        icon="ig"
      ></SocialButton>{" "}
      <SocialButton
        size="smBold"
        variant="yellow"
        defaultText="@tutienda.do"
        icon="fb"
      ></SocialButton>{" "}
      <SocialButton
        size="lgBold"
        variant="orange"
        defaultText="@tutienda.do"
        icon="ig"
      ></SocialButton>{" "}
    </div>
  );
}
