import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Layers, Hammer } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { Contributor } from "@shared/schema";

export default function BrickWall() {
  const { data: contributors = [], isLoading } = useQuery<Contributor[]>({
    queryKey: ["/api/contributors"],
  });

  if (isLoading) {
    return (
      <Card className="border border-gray-200 shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-semibold text-gray-800 flex items-center gap-3">
              <Layers className="text-brick-red w-6 h-6" />
              Community Wall
            </h3>
          </div>
          <div className="border-4 border-brick-red rounded-lg p-4 bg-gray-50 min-h-96 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-primary-blue border-t-transparent rounded-full animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-gray-200 shadow-lg">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-semibold text-gray-800 flex items-center gap-3">
            <Layers className="text-brick-red w-6 h-6" />
            Community Wall
          </h3>
          <div className="text-sm text-gray-600">
            {contributors.length} Contributors
          </div>
        </div>
        
        <div className="border-4 border-brick-red rounded-lg p-4 bg-gray-50 min-h-96">
          {contributors.length === 0 ? (
            <div className="text-center py-12">
              <Hammer className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Be the first to add your name to our community wall!</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
              <AnimatePresence>
                {contributors.map((contributor, index) => (
                  <motion.div
                    key={contributor.id}
                    initial={{ opacity: 0, y: -20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ 
                      duration: 0.6, 
                      ease: "easeOut",
                      delay: index * 0.1 
                    }}
                    whileHover={{ 
                      scale: 1.05,
                      boxShadow: "0 10px 25px rgba(0,0,0,0.1)"
                    }}
                    className="bg-white border-2 border-gray-300 rounded-lg p-3 text-center shadow-sm transition-all duration-200 cursor-pointer"
                  >
                    <span className="text-brick-red font-medium text-sm break-words">
                      {contributor.name}
                    </span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
