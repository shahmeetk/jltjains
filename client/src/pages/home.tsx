import { Building } from "lucide-react";
import AddNameForm from "@/components/add-name-form";
import BrickWall from "@/components/brick-wall";
import ProgressSidebar from "@/components/progress-sidebar";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 text-white py-8 shadow-lg">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-4">
            <img
              src="/jlt-logo.png"
              alt="JLT Logo"
              className="w-16 h-16 object-contain"
            />
            <div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-pink-100 to-white bg-clip-text text-transparent">
                JLT Jain Sangh Dubai
              </h1>
              <p className="text-lg text-purple-100 font-medium">Jain Allied Science DMCC</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="px-4 py-4">
        {/* Brick Wall */}
        <div className="mb-6">
          <BrickWall />
        </div>

        {/* Bottom Layout: Contributors | Form | Remaining */}
        <div className="grid grid-cols-3 gap-4 items-center">
          {/* Left: Contributors Count */}
          <ProgressSidebar showOnlyContributors={true} />

          {/* Center: Form */}
          <AddNameForm />

          {/* Right: Remaining Count */}
          <ProgressSidebar showOnlyRemaining={true} />
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400 flex items-center justify-center gap-2">
            <Building className="w-4 h-4" />
            © 2024 JLT Jain Sangh Dubai. Enlarging Jain Community while serving the same roots.
          </p>
        </div>
      </footer>
    </div>
  );
}
