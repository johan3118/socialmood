import UserProfile from "@/components/(socialmood)/user-profile"

export default function MainBar() {
  return (
    <header className="mt-8 text-white flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-semibold">
          Hola, Allen Silverio <span className="text-yellow-400">✨</span>
        </h1>
        <p className="text-sm text-gray-400">
          Supervisa los moods de todas tus redes sociales
        </p>
      </div>
      <UserProfile/>
     
    </header>
  )
}