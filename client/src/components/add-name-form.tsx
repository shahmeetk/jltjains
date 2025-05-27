import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { UserPlus, Sparkles, Heart, Hammer, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function AddNameForm() {
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [showBrickCreation, setShowBrickCreation] = useState(false);
  const [createdBrickName, setCreatedBrickName] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const addContributorMutation = useMutation({
    mutationFn: async (name: string) => {
      const response = await apiRequest("POST", "/api/contributors", { name });
      return response.json();
    },
    onSuccess: () => {
      // Immediately update queries to show the new brick in the wall
      queryClient.invalidateQueries({ queryKey: ["/api/contributors"] });
      queryClient.invalidateQueries({ queryKey: ["/api/contributors/count"] });

      // Show brick creation animation first
      setCreatedBrickName(name);
      setShowBrickCreation(true);
      setIsSubmitting(false);

      // After brick creation animation, show flying animation
      setTimeout(() => {
        setShowBrickCreation(false);
        setShowSuccessAnimation(true);

        setName("");

        toast({
          title: `🎉 Thank You ${name} for Contributing to community!`,
          description: "Your brick is flying in and being added to our wall!",
        });

        // Hide success animation after 3 seconds
        setTimeout(() => setShowSuccessAnimation(false), 3000);
      }, 1500);
    },
    onError: (error: any) => {
      setIsSubmitting(false);
      toast({
        title: "Unable to add name",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    addContributorMutation.mutate(name.trim());
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="relative"
    >
      {/* Brick Creation Animation */}
      <AnimatePresence>
        {showBrickCreation && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 0 }}
            animate={{
              opacity: [0, 1, 1, 1],
              scale: [0.5, 1.2, 1, 1],
              y: [0, -20, -10, 0]
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute -top-20 left-1/2 transform -translate-x-1/2 z-30"
          >
            <div className="bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg p-4 text-white font-bold text-center shadow-2xl border-2 border-white/40 min-w-[120px]">
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ duration: 0.5, repeat: 2 }}
                className="text-sm"
              >
                {createdBrickName}
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-xs mt-1 text-pink-100"
              >
                ✨ Brick Created!
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Flying Brick Animation - flies towards the wall */}
      <AnimatePresence>
        {showSuccessAnimation && (
          <motion.div
            initial={{
              opacity: 1,
              x: 0,
              y: 0,
              scale: 1,
              rotate: 0
            }}
            animate={{
              opacity: [1, 1, 0.8, 0],
              x: [0, -100, -300, -500],
              y: [0, -200, -400, -600],
              scale: [1, 0.8, 0.6, 0.3],
              rotate: [0, 15, 30, 45]
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 2.0,
              ease: [0.25, 0.46, 0.45, 0.94]
            }}
            className="absolute -top-20 left-1/2 transform -translate-x-1/2 z-30 pointer-events-none"
          >
            <div className="bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg p-4 text-white font-bold text-center shadow-2xl border-2 border-white/40 min-w-[120px]">
              <div className="text-sm">
                {createdBrickName}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Card className="h-[160px] w-full flex flex-col border border-gray-200 shadow-lg overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white relative overflow-hidden p-3 text-center">
          {/* Lotus petals in header background */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-1 right-2 w-4 h-6 bg-gradient-to-br from-yellow-300 to-orange-300 rounded-full transform rotate-45"></div>
            <div className="absolute bottom-1 left-2 w-3 h-5 bg-gradient-to-br from-cyan-300 to-green-300 rounded-full transform -rotate-30"></div>
          </div>
          <div className="relative z-10">
            <CardTitle className="text-sm font-semibold text-white mb-1 flex items-center justify-center gap-2">
              <UserPlus className="w-4 h-4" />
              Become a Valued Contributor
            </CardTitle>
            <p className="text-xs text-white/90">
              Together, we're building the future of JLT Jain Sangh Dubai.
            </p>
          </div>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col justify-center p-2">
          <form onSubmit={handleSubmit} className="space-y-2">
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter Labharthi Name"
              className="text-center h-8 text-sm"
              maxLength={200}
              disabled={isSubmitting || showBrickCreation}
            />

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                type="submit"
                disabled={!name.trim() || isSubmitting}
                className={`
                  w-full bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 hover:from-pink-600 hover:via-purple-600 hover:to-blue-600
                  text-white font-semibold py-1 px-2 rounded-lg transition-all duration-300 h-8 text-sm
                  ${isSubmitting ? 'animate-pulse' : ''}
                  ${showSuccessAnimation ? 'bg-gradient-to-r from-green-500 to-emerald-500' : ''}
                `}
              >
                <AnimatePresence mode="wait">
                  {isSubmitting ? (
                    <motion.div
                      key="submitting"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2"
                    >
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="text-white"
                      >
                        <Hammer className="w-3 h-3" />
                      </motion.div>
                      Building...
                    </motion.div>
                  ) : showSuccessAnimation ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="flex items-center gap-2"
                    >
                      <motion.div
                        animate={{
                          scale: [1, 1.2, 1],
                          rotate: [0, 10, -10, 0]
                        }}
                        transition={{ duration: 0.5, repeat: 2 }}
                      >
                        <Sparkles className="w-3 h-3" />
                      </motion.div>
                      Added!
                    </motion.div>
                  ) : (
                    <motion.div
                      key="default"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2"
                    >
                      <UserPlus className="w-3 h-3" />
                      Add Name to Wall
                    </motion.div>
                  )}
                </AnimatePresence>
              </Button>
            </motion.div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}