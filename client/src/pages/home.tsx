import { Building } from "lucide-react";
import AddNameForm from "@/components/add-name-form";
import BrickWall from "@/components/brick-wall";
import ProgressSidebar from "@/components/progress-sidebar";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-primary-blue text-white py-8 shadow-lg">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight flex items-center justify-center gap-3">
            <Building className="w-12 h-12" />
            Jain Allied Science DMCC
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-3">
            <BrickWall />
            <AddNameForm />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <ProgressSidebar />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400 flex items-center justify-center gap-2">
            <Building className="w-4 h-4" />
            © 2024 Jain Allied Science DMCC. Building communities, one name at a time.
          </p>
        </div>
      </footer>
    </div>
  );
}
