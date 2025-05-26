import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Layers, Hammer, Sparkles, Settings, Trash2, Edit2, Check, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Contributor } from "@shared/schema";

// Professional corporate colors inspired by Jain Allied Science branding
const brickColors = [
  'bg-blue-600', 'bg-indigo-600', 'bg-cyan-600', 'bg-teal-600', 
  'bg-emerald-600', 'bg-green-600', 'bg-blue-700', 'bg-indigo-700',
  'bg-cyan-700', 'bg-teal-700', 'bg-emerald-700', 'bg-green-700'
];

const getBrickColor = (index: number) => brickColors[index % brickColors.length];

export default function BrickWall() {
  const { data: contributors = [], isLoading } = useQuery<Contributor[]>({
    queryKey: ["/api/contributors"],
  });
  
  const [showAdmin, setShowAdmin] = useState(false);
  const [sparklingBrick, setSparklingBrick] = useState<number | null>(null);
  const [editingBrick, setEditingBrick] = useState<number | null>(null);
  const [editingName, setEditingName] = useState("");
  const [maxContributors, setMaxContributors] = useState(54);
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

  const updateContributorMutation = useMutation({
    mutationFn: async ({ id, name }: { id: number; name: string }) => {
      const response = await apiRequest("PATCH", `/api/contributors/${id}`, { name });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/contributors"] });
      setEditingBrick(null);
      setEditingName("");
      toast({
        title: "Name updated",
        description: "The contributor name has been successfully updated.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update name",
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

  const handleEditStart = (id: number, currentName: string) => {
    setEditingBrick(id);
    setEditingName(currentName);
  };

  const handleEditSave = () => {
    if (editingBrick && editingName.trim()) {
      updateContributorMutation.mutate({ id: editingBrick, name: editingName.trim() });
    }
  };

  const handleEditCancel = () => {
    setEditingBrick(null);
    setEditingName("");
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
        
        <div className="border-4 border-blue-600 rounded-xl p-6 bg-gradient-to-br from-blue-50 via-cyan-50 to-emerald-50 min-h-[500px] relative overflow-hidden">
          {/* Logo Background Pattern - Corporate Jain Allied Science Theme */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="text-6xl font-bold text-blue-900 select-none">Jain Allied Science</div>
            </div>
            <div className="absolute top-4 left-4 text-sm font-semibold text-blue-700 opacity-20">
              JAIN ALLIED SCIENCE
            </div>
            <div className="absolute bottom-4 right-4 text-sm font-semibold text-blue-700 opacity-20">
              DMCC
            </div>
          </div>

          {/* Animated Grid Lines for Logo Structure */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={`h-${i}`}
                className="absolute w-full h-px bg-blue-200 opacity-20"
                style={{ top: `${12.5 * (i + 1)}%` }}
                animate={{ scaleX: [0, 1, 0] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut"
                }}
              />
            ))}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={`v-${i}`}
                className="absolute h-full w-px bg-blue-200 opacity-20"
                style={{ left: `${12.5 * (i + 1)}%` }}
                animate={{ scaleY: [0, 1, 0] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  delay: i * 0.3,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>

          {/* Floating Energy Particles */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-blue-400 rounded-full opacity-60"
                animate={{
                  x: [0, Math.random() * 200 - 100],
                  y: [0, Math.random() * 200 - 100],
                  scale: [0, 1, 0],
                  opacity: [0, 0.8, 0],
                }}
                transition={{
                  duration: 5 + Math.random() * 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.4,
                }}
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
              />
            ))}
          </div>

          {contributors.length === 0 ? (
            <div className="text-center py-16 relative z-10">
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0] 
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <div className="text-4xl font-bold text-blue-600 mb-6">Jain Allied Science</div>
              </motion.div>
              <p className="text-blue-700 text-xl font-semibold mb-2">Building Excellence Together</p>
              <p className="text-blue-600 text-lg">Be the first to add your name and help build our community wall!</p>
            </div>
          ) : (
            <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-9 lg:grid-cols-10 xl:grid-cols-12 gap-2 relative z-10">
              <AnimatePresence>
                {contributors.map((contributor, index) => (
                  <motion.div
                    key={contributor.id}
                    initial={{ 
                      opacity: 0, 
                      x: -300, 
                      y: -300, 
                      rotate: -180,
                      scale: 0.1
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
                      damping: 12,
                      stiffness: 150,
                      delay: index * 0.1 
                    }}
                    whileHover={{ 
                      scale: 1.1,
                      rotate: 3,
                      boxShadow: "0 20px 40px rgba(0,100,200,0.2)",
                      zIndex: 20
                    }}
                    onDoubleClick={() => handleEditStart(contributor.id, contributor.name)}
                    onClick={() => handleSparkle(contributor.id)}
                    className={`
                      ${getBrickColor(index)} 
                      ${sparklingBrick === contributor.id ? 'animate-sparkle' : ''}
                      relative rounded-lg p-2 text-center shadow-lg 
                      cursor-pointer transition-all duration-300 
                      text-white font-bold text-xs border-2 border-white/40
                      backdrop-blur-sm min-h-[50px] flex items-center justify-center
                      overflow-hidden group
                    `}
                  >
                    {/* Professional Brick Texture */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-black/10 pointer-events-none" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                    
                    {/* Editable Name */}
                    {editingBrick === contributor.id ? (
                      <div className="relative z-20 w-full">
                        <Input
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          className="text-xs h-6 bg-white text-black border-0 text-center p-1"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleEditSave();
                            if (e.key === 'Escape') handleEditCancel();
                          }}
                        />
                        <div className="flex justify-center gap-1 mt-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-4 w-4 p-0 text-green-300 hover:text-green-100"
                            onClick={handleEditSave}
                          >
                            <Check className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-4 w-4 p-0 text-red-300 hover:text-red-100"
                            onClick={handleEditCancel}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <span className="relative z-10 break-words text-center leading-tight px-1 select-none">
                        {contributor.name}
                      </span>
                    )}

                    {/* Admin Controls */}
                    {showAdmin && editingBrick !== contributor.id && (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute -top-1 -left-1 w-4 h-4 p-0 opacity-0 group-hover:opacity-100 transition-opacity text-blue-300 hover:text-blue-100"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditStart(contributor.id, contributor.name);
                          }}
                        >
                          <Edit2 className="w-2 h-2" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="absolute -top-1 -right-1 w-4 h-4 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteContributor(contributor.id);
                          }}
                        >
                          <Trash2 className="w-2 h-2" />
                        </Button>
                      </>
                    )}

                    {/* Enhanced Sparkle Effect */}
                    {sparklingBrick === contributor.id && (
                      <motion.div
                        className="absolute inset-0 pointer-events-none"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <Sparkles className="absolute top-0 right-0 w-3 h-3 text-yellow-300" />
                        <Sparkles className="absolute bottom-0 left-0 w-2 h-2 text-yellow-300" />
                        <Sparkles className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 text-yellow-200" />
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Empty slots showing logo completion progress */}
              {Array.from({ length: Math.max(0, maxContributors - contributors.length) }, (_, i) => (
                <motion.div
                  key={`empty-${i}`}
                  className="relative rounded-lg min-h-[50px] border-2 border-dashed border-blue-300 opacity-30 flex items-center justify-center"
                  animate={{ 
                    opacity: [0.2, 0.5, 0.2],
                    borderColor: ['rgb(147, 197, 253)', 'rgb(59, 130, 246)', 'rgb(147, 197, 253)']
                  }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity,
                    delay: i * 0.1 
                  }}
                >
                  <div className="text-blue-400 text-xs font-medium">+</div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Admin Settings */}
          {showAdmin && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg"
            >
              <div className="text-sm font-medium text-gray-700 mb-2">Max Contributors:</div>
              <Input
                type="number"
                value={maxContributors}
                onChange={(e) => setMaxContributors(Number(e.target.value))}
                className="w-20 h-8 text-center"
                min="1"
                max="200"
              />
            </motion.div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
