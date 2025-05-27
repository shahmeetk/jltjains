import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Layers, Hammer, Sparkles, Settings, Trash2, Edit2, Check, X, Zap, Maximize, Minimize } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Contributor } from "@shared/schema";

// LED-optimized colors with high contrast and vibrant appearance for big screens
const brickColors = [
  'bg-gradient-to-br from-pink-400 to-pink-600', // Vibrant Pink
  'bg-gradient-to-br from-purple-400 to-purple-600', // Rich Purple
  'bg-gradient-to-br from-blue-400 to-blue-600', // Bright Blue
  'bg-gradient-to-br from-cyan-400 to-cyan-600', // Electric Cyan
  'bg-gradient-to-br from-green-400 to-green-600', // Vivid Green
  'bg-gradient-to-br from-yellow-400 to-yellow-600', // Bright Yellow
  'bg-gradient-to-br from-orange-400 to-orange-600', // Vibrant Orange
  'bg-gradient-to-br from-red-400 to-red-600', // Bold Red
  'bg-gradient-to-br from-indigo-400 to-indigo-600', // Deep Indigo
  'bg-gradient-to-br from-teal-400 to-teal-600', // Bright Teal
  'bg-gradient-to-br from-emerald-400 to-emerald-600', // Emerald Green
  'bg-gradient-to-br from-rose-400 to-rose-600', // Rose Pink
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

  const [newlyAddedBricks, setNewlyAddedBricks] = useState<Set<number>>(new Set());
  const [isBuilding, setIsBuilding] = useState(false);
  const [buildingEffect, setBuildingEffect] = useState<number | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const maxContributors = 54; // Fixed limit for the frame
  const previousContributorsRef = useRef<Contributor[]>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Track newly added contributors for special animations
  useEffect(() => {
    const previousContributors = previousContributorsRef.current;
    const newContributors = contributors.filter(
      contributor => !previousContributors.find(prev => prev.id === contributor.id)
    );

    if (newContributors.length > 0 && previousContributors.length > 0) {
      // Mark new bricks for special animation
      const newIds = new Set(newContributors.map(c => c.id));
      setNewlyAddedBricks(newIds);

      // Show building effect for the newest brick
      const newestBrick = newContributors[newContributors.length - 1];
      setBuildingEffect(newestBrick.id);
      setIsBuilding(true);

      // Clear the building effect after animation (match the CSS animation duration)
      setTimeout(() => {
        setIsBuilding(false);
        setBuildingEffect(null);
        setNewlyAddedBricks(new Set());
      }, 3000);
    }

    previousContributorsRef.current = contributors;
  }, [contributors]);

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

  // Fullscreen wall component
  const FullscreenWall = () => (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 overflow-auto">
      <div className="relative min-h-screen p-6">
        {/* Header with close button */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            {/* Jain Allied Science Logo */}
            <img
              src="/jlt-logo.png"
              alt="JLT Logo"
              className="w-12 h-12 object-contain"
            />
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                JLT Jain Sangh Dubai
              </h1>
              <p className="text-lg bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent font-medium">Jain Allied Science DMCC</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsFullscreen(false)}
            className="flex items-center gap-2"
          >
            <Minimize className="w-4 h-4" />
            Exit Fullscreen
          </Button>
        </div>

        {/* Dynamic Wall Grid */}
        {contributors.length === 0 ? (
          <div className="text-center py-32">
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ duration: 3, repeat: Infinity }}
              className="flex flex-col items-center"
            >
              <img
                src="/jlt-logo.png"
                alt="JLT Logo"
                className="w-24 h-24 object-contain"
              />
              <div className="text-6xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-2 mt-4">
                JLT Jain Sangh Dubai
              </div>
              <div className="text-2xl font-medium bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent mb-8">
                Jain Allied Science DMCC
              </div>
            </motion.div>
            <p className="text-2xl font-semibold mb-4 bg-gradient-to-r from-purple-700 to-blue-700 bg-clip-text text-transparent">Building Community Together</p>
            <p className="text-xl bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">Be the first to add your name and help build our community wall!</p>
          </div>
        ) : (
          <div
            className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 xl:grid-cols-8 2xl:grid-cols-9 gap-6 justify-center"
            style={{ willChange: 'transform' }}
          >
            <AnimatePresence mode="popLayout">
              {contributors.slice(0, maxContributors).map((contributor, index) => {
                const isNewBrick = newlyAddedBricks.has(contributor.id);
                const isBuildingBrick = buildingEffect === contributor.id;

                return (
                  <motion.div
                    key={contributor.id}
                    layout
                    initial={isNewBrick ? {
                      opacity: 0,
                      scale: 0.3,
                      rotate: 0
                    } : {
                      opacity: 1,
                      scale: 1,
                      rotate: 0
                    }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                      rotate: 0
                    }}
                    exit={{
                      opacity: 0,
                      scale: 0.8,
                      transition: { duration: 0.2 }
                    }}
                    transition={isNewBrick ? {
                      duration: 1.2,
                      ease: "easeOut",
                      delay: 0.1
                    } : {
                      layout: { duration: 0.3, ease: "easeInOut" }
                    }}
                    whileHover={{
                      scale: 1.05,
                      rotate: 2,
                      boxShadow: "0 15px 30px rgba(0,100,200,0.15)",
                      zIndex: 20,
                      transition: { duration: 0.2 }
                    }}
                    onDoubleClick={() => handleEditStart(contributor.id, contributor.name)}
                    onClick={() => handleSparkle(contributor.id)}
                    className={`
                      ${getBrickColor(index)}
                      ${sparklingBrick === contributor.id ? 'animate-sparkle' : ''}
                      ${isNewBrick ? 'animate-brick-fly-in-dynamic' : ''}
                      ${isBuildingBrick ? 'animate-construction-glow' : ''}
                      relative rounded-lg p-6 text-center shadow-xl
                      cursor-pointer transition-all duration-200
                      text-white font-black text-lg border-3 border-white/60
                      backdrop-blur-sm min-h-[100px] flex items-center justify-center
                      overflow-hidden group
                    `}
                    style={{ willChange: 'transform' }}
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
                          className="text-sm h-8 bg-white text-black border-0 text-center p-1"
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
                            className="h-5 w-5 p-0 text-green-300 hover:text-green-100"
                            onClick={handleEditSave}
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-5 w-5 p-0 text-red-300 hover:text-red-100"
                            onClick={handleEditCancel}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="relative z-10 break-words text-center leading-tight px-1 select-none w-full h-full flex items-center justify-center">
                        {contributor.name.startsWith('http') || contributor.name.includes('.png') || contributor.name.includes('.jpg') || contributor.name.includes('.jpeg') || contributor.name.includes('.gif') || contributor.name.includes('.svg') ? (
                          <img
                            src={contributor.name}
                            alt="Contributor Logo"
                            className="w-16 h-16 object-contain"
                            onError={(e) => {
                              // Fallback to text if image fails to load
                              const target = e.currentTarget as HTMLImageElement;
                              target.style.display = 'none';
                              const nextElement = target.nextElementSibling as HTMLElement;
                              if (nextElement) nextElement.style.display = 'block';
                            }}
                          />
                        ) : null}
                        <span
                          className={`${contributor.name.startsWith('http') || contributor.name.includes('.png') || contributor.name.includes('.jpg') || contributor.name.includes('.jpeg') || contributor.name.includes('.gif') || contributor.name.includes('.svg') ? 'hidden' : 'block'} text-base leading-tight animate-name-shine ${isNewBrick ? 'animate-new-name-highlight' : ''}`}
                          style={{ wordWrap: 'break-word', overflowWrap: 'break-word' }}
                        >
                          {contributor.name}
                        </span>
                      </div>
                    )}

                    {/* Admin Controls */}
                    {showAdmin && editingBrick !== contributor.id && (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute -top-1 -left-1 w-5 h-5 p-0 opacity-0 group-hover:opacity-100 transition-opacity text-blue-300 hover:text-blue-100"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditStart(contributor.id, contributor.name);
                          }}
                        >
                          <Edit2 className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="absolute -top-1 -right-1 w-5 h-5 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteContributor(contributor.id);
                          }}
                        >
                          <Trash2 className="w-3 h-3" />
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
                        <Sparkles className="absolute top-0 right-0 w-4 h-4 text-yellow-300" />
                        <Sparkles className="absolute bottom-0 left-0 w-3 h-3 text-yellow-300" />
                        <Sparkles className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-5 h-5 text-yellow-200" />
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );

  if (isFullscreen) {
    return <FullscreenWall />;
  }

  return (
    <Card className="border border-gray-200 shadow-lg overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="text-sm text-gray-600 flex items-center gap-2">
            {isBuilding && (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="text-blue-600"
              >
                <Hammer className="w-4 h-4" />
              </motion.div>
            )}
            <span>{Math.min(contributors.length, maxContributors)} / {maxContributors} Contributors</span>
            {isBuilding && (
              <motion.span
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="text-blue-600 font-semibold"
              >
                Building...
              </motion.span>
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="flex items-center gap-2"
          >
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
            {isFullscreen ? 'Exit' : 'Fullscreen'}
          </Button>
        </div>

        <div className="relative rounded-xl p-6 bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 min-h-[700px] overflow-hidden">
          {/* Gradient border */}
          <div className="absolute inset-0 bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 rounded-xl p-1">
            <div className="w-full h-full bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 rounded-lg"></div>
          </div>
          <div className="relative z-10" style={{ willChange: 'transform' }}>
          {/* Enhanced Background Pattern with Multiple Logos */}
          <div className="absolute inset-0 opacity-30">
            {/* Scattered logo instances across the entire wall */}
            {[...Array(35)].map((_, i) => {
              // Create sparse, random positions across the entire wall
              const positions = [
                // Top area (10-25%)
                { top: '8%', left: '12%', rotate: 15 },
                { top: '15%', left: '75%', rotate: -20 },
                { top: '22%', left: '25%', rotate: 30 },
                { top: '18%', left: '88%', rotate: -15 },

                // Upper-middle area (25-40%)
                { top: '28%', left: '15%', rotate: 25 },
                { top: '35%', left: '65%', rotate: -25 },
                { top: '32%', left: '85%', rotate: 20 },
                { top: '38%', left: '35%', rotate: -30 },

                // Center area (40-60%)
                { top: '45%', left: '10%', rotate: -20 },
                { top: '52%', left: '70%', rotate: 35 },
                { top: '48%', left: '90%', rotate: -10 },
                { top: '55%', left: '25%', rotate: 25 },
                { top: '58%', left: '80%', rotate: -35 },

                // Lower-middle area (60-75%)
                { top: '62%', left: '15%', rotate: 30 },
                { top: '68%', left: '55%', rotate: -25 },
                { top: '72%', left: '85%', rotate: 15 },
                { top: '65%', left: '40%', rotate: -20 },
                { top: '75%', left: '75%', rotate: 25 },

                // Bottom area (75-90%)
                { top: '78%', left: '20%', rotate: -30 },
                { top: '82%', left: '60%', rotate: 20 },
                { top: '85%', left: '10%', rotate: -15 },
                { top: '88%', left: '45%', rotate: 35 },
                { top: '92%', left: '80%', rotate: -25 },

                // Additional scattered positions
                { top: '12%', left: '45%', rotate: -10 },
                { top: '25%', left: '55%', rotate: 40 },
                { top: '42%', left: '60%', rotate: -35 },
                { top: '58%', left: '5%', rotate: 30 },
                { top: '75%', left: '95%', rotate: -20 },
                { top: '35%', left: '5%', rotate: 25 },
                { top: '65%', left: '95%', rotate: -30 },
                { top: '15%', left: '60%', rotate: 15 },
                { top: '85%', left: '30%', rotate: -25 },
                { top: '45%', left: '40%', rotate: 20 },
                { top: '25%', left: '90%', rotate: -15 },
                { top: '75%', left: '50%', rotate: 35 },
                { top: '95%', left: '65%', rotate: -40 }
              ];
              const pos = positions[i];
              return (
                <div
                  key={i}
                  className="absolute"
                  style={{
                    top: pos.top,
                    left: pos.left,
                    transform: `rotate(${pos.rotate}deg)`
                  }}
                >
                  <img
                    src="/jlt-logo.png"
                    alt="JLT Logo"
                    className="w-14 h-14 object-contain opacity-45"
                  />
                </div>
              );
            })}

            {/* Center logo and text */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
              <img
                src="/jlt-logo.png"
                alt="JLT Logo"
                className="w-28 h-28 object-contain opacity-80"
              />
              <div className="text-4xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent select-none text-center mt-2">
                JLT Jain Sangh Dubai
              </div>
              <div className="text-lg font-medium bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent select-none text-center mt-1 opacity-80">
                Jain Allied Science DMCC
              </div>
            </div>

            {/* Corner text elements */}
            <div className="absolute top-4 left-4 text-base font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent opacity-70">
              JLT Jain Sangh Dubai
            </div>
            <div className="absolute bottom-4 right-4 text-base font-bold bg-gradient-to-r from-blue-500 to-green-500 bg-clip-text text-transparent opacity-70">
              JLT Jain Sangh Dubai
            </div>
            <div className="absolute top-4 right-4 text-base font-bold bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent opacity-70">
              Community Wall
            </div>
            <div className="absolute bottom-4 left-4 text-base font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent opacity-70">
              Jain Allied Science DMCC
            </div>
          </div>

          {/* Animated Lotus Petal Lines */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(6)].map((_, i) => {
              const colors = ['bg-pink-200', 'bg-purple-200', 'bg-blue-200', 'bg-cyan-200', 'bg-green-200', 'bg-yellow-200'];
              return (
                <motion.div
                  key={`h-${i}`}
                  className={`absolute w-full h-px ${colors[i % colors.length]} opacity-20`}
                  style={{ top: `${16.67 * (i + 1)}%` }}
                  animate={{ scaleX: [0, 1, 0] }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    delay: i * 0.3,
                    ease: "easeInOut"
                  }}
                />
              );
            })}
            {[...Array(6)].map((_, i) => {
              const colors = ['bg-orange-200', 'bg-red-200', 'bg-indigo-200', 'bg-teal-200', 'bg-emerald-200', 'bg-rose-200'];
              return (
                <motion.div
                  key={`v-${i}`}
                  className={`absolute h-full w-px ${colors[i % colors.length]} opacity-20`}
                  style={{ left: `${16.67 * (i + 1)}%` }}
                  animate={{ scaleY: [0, 1, 0] }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    delay: i * 0.4,
                    ease: "easeInOut"
                  }}
                />
              );
            })}
          </div>

          {/* Floating Lotus Energy Particles */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(12)].map((_, i) => {
              const particleColors = ['bg-pink-400', 'bg-purple-400', 'bg-blue-400', 'bg-cyan-400', 'bg-green-400', 'bg-yellow-400', 'bg-orange-400', 'bg-red-400'];
              return (
                <motion.div
                  key={i}
                  className={`absolute w-1 h-1 ${particleColors[i % particleColors.length]} rounded-full opacity-60`}
                  animate={{
                    x: [0, Math.random() * 200 - 100],
                    y: [0, Math.random() * 200 - 100],
                    scale: [0, 1, 0],
                    opacity: [0, 0.8, 0],
                  }}
                  transition={{
                    duration: 6 + Math.random() * 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.5,
                  }}
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                />
              );
            })}
          </div>

          {contributors.length === 0 ? (
            <div className="text-center py-16 relative z-10">
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ duration: 3, repeat: Infinity }}
                className="flex flex-col items-center"
              >
                <img
                  src="/jlt-logo.png"
                  alt="JLT Logo"
                  className="w-20 h-20 object-contain"
                />
                <div className="text-4xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-2 mt-4">
                  JLT Jain Sangh Dubai
                </div>
                <div className="text-lg font-medium bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent mb-6">
                  Jain Allied Science DMCC
                </div>
              </motion.div>
              <p className="text-xl font-semibold mb-2 bg-gradient-to-r from-purple-700 to-blue-700 bg-clip-text text-transparent">Building Community Together</p>
              <p className="text-lg bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">Be the first to add your name and help build our community wall!</p>
            </div>
          ) : (
            <div
              className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-8 gap-4 relative z-10 auto-rows-min justify-center"
              style={{ willChange: 'transform' }}
            >
              <AnimatePresence mode="popLayout">
                {contributors.slice(0, maxContributors).map((contributor, index) => {
                  const isNewBrick = newlyAddedBricks.has(contributor.id);
                  const isBuildingBrick = buildingEffect === contributor.id;

                  return (
                    <motion.div
                      key={contributor.id}
                      layout
                      initial={isNewBrick ? {
                        opacity: 0,
                        scale: 0.3,
                        rotate: 0
                      } : {
                        opacity: 1,
                        scale: 1,
                        rotate: 0
                      }}
                      animate={{
                        opacity: 1,
                        scale: 1,
                        rotate: 0
                      }}
                      exit={{
                        opacity: 0,
                        scale: 0.8,
                        transition: { duration: 0.2 }
                      }}
                      transition={isNewBrick ? {
                        duration: 1.2,
                        ease: "easeOut",
                        delay: 0.1
                      } : {
                        layout: { duration: 0.3, ease: "easeInOut" }
                      }}
                      whileHover={{
                        scale: 1.05,
                        rotate: 2,
                        boxShadow: "0 10px 25px rgba(0,100,200,0.15)",
                        zIndex: 20,
                        transition: { duration: 0.2 }
                      }}
                      onDoubleClick={() => handleEditStart(contributor.id, contributor.name)}
                      onClick={() => handleSparkle(contributor.id)}
                      className={`
                        ${getBrickColor(index)}
                        ${sparklingBrick === contributor.id ? 'animate-sparkle' : ''}
                        ${isNewBrick ? 'animate-brick-fly-in-dynamic' : ''}
                        ${isBuildingBrick ? 'animate-construction-glow' : ''}
                        relative rounded-lg p-4 text-center shadow-xl
                        cursor-pointer transition-all duration-200
                        text-white font-black text-base border-3 border-white/60
                        backdrop-blur-sm min-h-[90px] flex items-center justify-center
                        overflow-hidden group
                      `}
                      style={{ willChange: 'transform' }}
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
                        <div className="relative z-10 break-words text-center leading-tight px-1 select-none w-full h-full flex items-center justify-center">
                          {contributor.name.startsWith('http') || contributor.name.includes('.png') || contributor.name.includes('.jpg') || contributor.name.includes('.jpeg') || contributor.name.includes('.gif') || contributor.name.includes('.svg') ? (
                            <img
                              src={contributor.name}
                              alt="Contributor Logo"
                              className="w-12 h-12 object-contain"
                              onError={(e) => {
                                // Fallback to text if image fails to load
                                const target = e.currentTarget as HTMLImageElement;
                                target.style.display = 'none';
                                const nextElement = target.nextElementSibling as HTMLElement;
                                if (nextElement) nextElement.style.display = 'block';
                              }}
                            />
                          ) : null}
                          <motion.span
                            className={`${contributor.name.startsWith('http') || contributor.name.includes('.png') || contributor.name.includes('.jpg') || contributor.name.includes('.jpeg') || contributor.name.includes('.gif') || contributor.name.includes('.svg') ? 'hidden' : 'block'} text-sm leading-tight animate-name-shine ${isNewBrick ? 'animate-new-name-highlight' : ''}`}
                            style={{ wordWrap: 'break-word', overflowWrap: 'break-word' }}
                            initial={isNewBrick ? { opacity: 0, scale: 0.5 } : { opacity: 1, scale: 1 }}
                            animate={{
                              opacity: 1,
                              scale: 1
                            }}
                            transition={isNewBrick ? {
                              duration: 1.5,
                              delay: 2.0,
                              ease: "easeOut"
                            } : {}}
                          >
                            {contributor.name}
                          </motion.span>
                        </div>
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
                  );
                })}
              </AnimatePresence>
            </div>
          )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
