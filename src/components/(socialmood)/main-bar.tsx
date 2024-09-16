import { User } from "lucide-react"

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
      <div className="flex items-center space-x-2">
        <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center">
          <User className="text-white" />
        </div>
        <div>
          <p className="font-medium">Allen Silverio</p>
          <p className="text-xs text-gray-400">Usuario</p>
        </div>
      </div>
    </header>
  )
}