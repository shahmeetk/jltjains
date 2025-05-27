
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ChartLine, Heart, Trophy, Target, Users, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const MAX_CONTRIBUTORS = 54;

interface ProgressSidebarProps {
  showOnlyMotivational?: boolean;
  showOnlyStats?: boolean;
  showOnlyContributors?: boolean;
  showOnlyRemaining?: boolean;
}

export default function ProgressSidebar({
  showOnlyMotivational = false,
  showOnlyStats = false,
  showOnlyContributors = false,
  showOnlyRemaining = false
}: ProgressSidebarProps) {
  const { data: countData, isLoading } = useQuery<{ count: number }>({
    queryKey: ["/api/contributors/count"],
  });

  const currentCount = countData?.count || 0;
  const remaining = MAX_CONTRIBUTORS - currentCount;
  const percentage = (currentCount / MAX_CONTRIBUTORS) * 100;

  // Show only motivational message
  if (showOnlyMotivational) {
    return (
      <Card className="bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 text-white border border-gray-200 shadow-xl relative overflow-hidden">
        {/* Lotus petals in background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-2 right-2 w-8 h-12 bg-gradient-to-br from-yellow-300 to-orange-300 rounded-full transform rotate-45"></div>
          <div className="absolute bottom-2 left-2 w-6 h-10 bg-gradient-to-br from-cyan-300 to-green-300 rounded-full transform -rotate-30"></div>
        </div>
        <CardContent className="p-6 relative z-10">
          <div className="text-center">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <Heart className="w-10 h-10 mx-auto mb-4 opacity-90" />
            </motion.div>
            <p className="text-sm leading-relaxed font-medium text-white/95">
              "Together, we're building the future of JLT Jain Sangh Dubai."
            </p>
            <motion.div
              className="mt-3 flex justify-center gap-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-1 h-1 bg-white/60 rounded-full"
                  animate={{ scale: [0, 1, 0] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.2
                  }}
                />
              ))}
            </motion.div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show only contributors count
  if (showOnlyContributors) {
    return (
      <Card className="bg-gradient-to-br from-pink-50 to-pink-100 border-pink-200 h-[160px] w-full flex flex-col">
        <CardHeader className="p-3 text-center bg-gradient-to-r from-pink-500 to-pink-600 text-white">
          <CardTitle className="text-sm font-semibold text-white">
            <div className="flex items-center justify-center gap-2">
              <Users className="w-4 h-4" />
              Contributors
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col items-center justify-center p-2">
          <div className="text-2xl font-bold text-pink-600">{currentCount}</div>
          <p className="text-xs bg-gradient-to-r from-pink-500 to-pink-700 bg-clip-text text-transparent font-medium">
            Names on the Wall
          </p>
        </CardContent>
      </Card>
    );
  }

  // Show only remaining count
  if (showOnlyRemaining) {
    return (
      <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 h-[160px] w-full flex flex-col">
        <CardHeader className="p-3 text-center bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardTitle className="text-sm font-semibold text-white">
            <div className="flex items-center justify-center gap-2">
              <Target className="w-4 h-4" />
              Remaining
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col items-center justify-center p-2">
          <div className="text-2xl font-bold text-purple-600">{remaining}</div>
          <p className="text-xs bg-gradient-to-r from-purple-500 to-purple-700 bg-clip-text text-transparent font-medium">
            Spots Available
          </p>
        </CardContent>
      </Card>
    );
  }

  // Show only stats
  if (showOnlyStats) {
    return (
      <div className="space-y-4">
        <Card className="bg-gradient-to-br from-pink-50 to-pink-100 border-pink-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="w-4 h-4 text-pink-600" />
              Contributors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-pink-600">{currentCount}</div>
            <p className="text-xs text-gray-600">names on the wall</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Target className="w-4 h-4 text-purple-600" />
              Remaining
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{remaining}</div>
            <p className="text-xs text-gray-600">spots available</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{percentage.toFixed(1)}%</div>
            <p className="text-xs text-gray-600">completion</p>
          </CardContent>
        </Card>

        {currentCount >= MAX_CONTRIBUTORS && (
          <Card className="bg-green-50 border-green-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2 text-green-700">
                <Trophy className="w-4 h-4" />
                Goal Achieved!
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-green-700">
                Congratulations! The community wall is complete.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  // Default: Show all content (for backward compatibility)
  return (
    <div className="space-y-6">
      {/* Progress Card */}
      <Card className="border border-purple-200 shadow-xl bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 relative overflow-hidden">
        {/* Lotus petals background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-2 right-2 w-6 h-8 bg-gradient-to-br from-pink-300 to-pink-400 rounded-full transform rotate-45"></div>
          <div className="absolute bottom-2 left-2 w-5 h-7 bg-gradient-to-br from-blue-300 to-blue-400 rounded-full transform -rotate-30"></div>
        </div>
        <CardContent className="p-6 relative z-10">
          <h4 className="text-lg font-semibold bg-gradient-to-r from-pink-700 to-purple-700 bg-clip-text text-transparent mb-4 flex items-center gap-3">
            <ChartLine className="text-purple-600 w-5 h-5" />
            Community Progress
          </h4>
          <div className="text-center">
            <motion.div
              className="text-4xl font-bold text-purple-600 mb-2"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              {isLoading ? "..." : remaining}
            </motion.div>
            <div className="text-sm text-gray-600 mb-4 font-medium">Names Remaining</div>
            <div className="w-full bg-gray-200 rounded-full h-4 mb-3 overflow-hidden shadow-inner">
              <motion.div
                className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 h-4 rounded-full relative"
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/30 to-transparent rounded-full" />
              </motion.div>
            </div>
            <div className="text-xs text-gray-500 flex justify-between">
              <span>{currentCount} Contributors</span>
              <span>Goal: {MAX_CONTRIBUTORS}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Cards */}
      <div className="space-y-4">
        <Card className="bg-gradient-to-br from-pink-50 to-pink-100 border-pink-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="w-4 h-4 text-pink-600" />
              Contributors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-pink-600">{currentCount}</div>
            <p className="text-xs text-gray-600">names on the wall</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Target className="w-4 h-4 text-purple-600" />
              Remaining
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{remaining}</div>
            <p className="text-xs text-gray-600">spots available</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{percentage.toFixed(1)}%</div>
            <p className="text-xs text-gray-600">completion</p>
          </CardContent>
        </Card>

        {currentCount >= MAX_CONTRIBUTORS && (
          <Card className="bg-green-50 border-green-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2 text-green-700">
                <Trophy className="w-4 h-4" />
                Goal Achieved!
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-green-700">
                Congratulations! The community wall is complete.
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Motivational Message */}
      <Card className="bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 text-white border border-gray-200 shadow-xl relative overflow-hidden">
        {/* Lotus petals in background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-2 right-2 w-8 h-12 bg-gradient-to-br from-yellow-300 to-orange-300 rounded-full transform rotate-45"></div>
          <div className="absolute bottom-2 left-2 w-6 h-10 bg-gradient-to-br from-cyan-300 to-green-300 rounded-full transform -rotate-30"></div>
        </div>
        <CardContent className="p-6 relative z-10">
          <div className="text-center">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <Heart className="w-10 h-10 mx-auto mb-4 opacity-90" />
            </motion.div>
            <p className="text-sm leading-relaxed font-medium text-white/95">
              "Together, we're building the future of JLT Jain Sangh Dubai."
            </p>
            <motion.div
              className="mt-3 flex justify-center gap-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-1 h-1 bg-white/60 rounded-full"
                  animate={{ scale: [0, 1, 0] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.2
                  }}
                />
              ))}
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
