import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ChartLine, Heart, Trophy, Target } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

import { useQuery } from "@tanstack/react-query";
import { Users, Target, Trophy, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const MAX_CONTRIBUTORS = 54;

export default function ProgressSidebar() {
  const { data: countData, isLoading } = useQuery<{ count: number }>({
    queryKey: ["/api/contributors/count"],
  });

  const currentCount = countData?.count || 0;
  const remaining = MAX_CONTRIBUTORS - currentCount;
  const percentage = (currentCount / MAX_CONTRIBUTORS) * 100;

  return (
    <div className="space-y-6">
      {/* Progress Card */}
      <Card className="border border-purple-200 shadow-xl bg-gradient-to-br from-purple-50 to-blue-50">
        <CardContent className="p-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-3">
            <ChartLine className="text-purple-600 w-5 h-5" />
            Progress
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
                className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 h-4 rounded-full relative"
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
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600" />
              Contributors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{currentCount}</div>
            <p className="text-xs text-gray-600">names on the wall</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Target className="w-4 h-4 text-green-600" />
              Remaining
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{remaining}</div>
            <p className="text-xs text-gray-600">spots available</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-purple-600" />
              Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{percentage.toFixed(1)}%</div>
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
    </div>



      {/* Motivational Message */}
      <Card className="bg-gradient-to-br from-purple-600 via-pink-600 to-orange-600 text-white border border-gray-200 shadow-xl">
        <CardContent className="p-6">
          <div className="text-center">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <Heart className="w-10 h-10 mx-auto mb-4 opacity-90" />
            </motion.div>
            <p className="text-sm leading-relaxed font-medium text-white/95">
              "Together, we're building the future of Jain Allied Science DMCC."
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