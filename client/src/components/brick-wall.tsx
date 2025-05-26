import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Layers, Hammer, Sparkles, Settings, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Contributor } from "@shared/schema";

const brickColors = [
  'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 
  'bg-purple-500', 'bg-pink-500', 'bg-orange-500', 'bg-cyan-500',
  'bg-emerald-500', 'bg-rose-500', 'bg-indigo-500', 'bg-teal-500'
];

const getBrickColor = (index: number) => brickColors[index % brickColors.length];

export default function BrickWall() {
  const { data: contributors = [], isLoading } = useQuery<Contributor[]>({
    queryKey: ["/api/contributors"],
  });
  
  const [showAdmin, setShowAdmin] = useState(false);
  const [sparklingBrick, setSparklingBrick] = useState<number | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const deleteContributorMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest("DELETE", `/api/contributors/${id}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/contributors"] });
      queryClient.invalidateQueries({ queryKey: ["/api/contributors/count"] });
      toast({
        title: "Contributor removed",
        description: "The name has been successfully removed from the wall.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to remove contributor",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <Card className="border border-gray-200 shadow-lg overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-semibold text-gray-800 flex items-center gap-3">
              <Layers className="text-purple-600 w-6 h-6" />
              Community Wall
            </h3>
          </div>
          <div className="border-4 border-purple-600 rounded-lg p-4 bg-gradient-to-br from-purple-50 to-blue-50 min-h-96 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const handleDeleteContributor = async (id: number) => {
    deleteContributorMutation.mutate(id);
  };

  const handleSparkle = (id: number) => {
    setSparklingBrick(id);
    setTimeout(() => setSparklingBrick(null), 1500);
  };

  return (
    <Card className="border border-gray-200 shadow-lg overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-semibold text-gray-800 flex items-center gap-3">
            <Layers className="text-purple-600 w-6 h-6" />
            Community Wall
          </h3>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600">
              {contributors.length} Contributors
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAdmin(!showAdmin)}
              className="flex items-center gap-2"
            >
              <Settings className="w-4 h-4" />
              Admin
            </Button>
          </div>
        </div>
        
        <div className="border-4 border-purple-600 rounded-lg p-4 bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 min-h-96 brick-pattern relative overflow-hidden">
          {/* Floating particles effect */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-yellow-400 rounded-full opacity-60"
                animate={{
                  x: [0, 100, 0],
                  y: [0, -50, 0],
                  scale: [0, 1, 0],
                }}
                transition={{
                  duration: 3 + i,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.5,
                }}
                style={{
                  left: `${10 + i * 15}%`,
                  top: `${20 + i * 10}%`,
                }}
              />
            ))}
          </div>

          {contributors.length === 0 ? (
            <div className="text-center py-12 relative z-10">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Hammer className="w-16 h-16 text-purple-400 mx-auto mb-4" />
              </motion.div>
              <p className="text-purple-600 text-lg font-medium">Be the first to add your name to our magical wall!</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 relative z-10">
              <AnimatePresence>
                {contributors.map((contributor, index) => (
                  <motion.div
                    key={contributor.id}
                    initial={{ 
                      opacity: 0, 
                      x: -200, 
                      y: -200, 
                      rotate: -45,
                      scale: 0.3
                    }}
                    animate={{ 
                      opacity: 1, 
                      x: 0, 
                      y: 0, 
                      rotate: 0,
                      scale: 1
                    }}
                    transition={{ 
                      type: "spring",
                      damping: 15,
                      stiffness: 200,
                      delay: index * 0.15 
                    }}
                    whileHover={{ 
                      scale: 1.08,
                      rotate: 2,
                      boxShadow: "0 15px 35px rgba(0,0,0,0.15)",
                      zIndex: 10
                    }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleSparkle(contributor.id)}
                    className={`
                      ${getBrickColor(index)} 
                      ${sparklingBrick === contributor.id ? 'animate-sparkle' : ''}
                      relative rounded-lg p-3 text-center shadow-lg 
                      cursor-pointer transition-all duration-200 
                      text-white font-bold text-sm border-2 border-white/30
                      backdrop-blur-sm min-h-[60px] flex items-center justify-center
                      overflow-hidden group
                    `}
                  >
                    {/* Brick texture overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none" />
                    
                    {/* Name text with word wrap */}
                    <span className="relative z-10 break-words text-center leading-tight px-1">
                      {contributor.name}
                    </span>

                    {/* Admin delete button */}
                    {showAdmin && (
                      <Button
                        variant="destructive"
                        size="sm"
                        className="absolute -top-2 -right-2 w-6 h-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteContributor(contributor.id);
                        }}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    )}

                    {/* Sparkle effect */}
                    {sparklingBrick === contributor.id && (
                      <motion.div
                        className="absolute inset-0 pointer-events-none"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <Sparkles className="absolute top-1 right-1 w-4 h-4 text-yellow-300" />
                        <Sparkles className="absolute bottom-1 left-1 w-3 h-3 text-yellow-300" />
                      </motion.div>
                    )}
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
