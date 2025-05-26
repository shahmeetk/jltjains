import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ChartLine, Box, Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

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
      <Card className="border border-gray-200 shadow-lg">
        <CardContent className="p-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-3">
            <ChartLine className="text-success-green w-5 h-5" />
            Progress
          </h4>
          <div className="text-center">
            <motion.div 
              className="text-3xl font-bold text-primary-blue mb-2"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              {isLoading ? "..." : remaining}
            </motion.div>
            <div className="text-sm text-gray-600 mb-4">Names Remaining</div>
            <div className="w-full bg-gray-200 rounded-full h-3 mb-3 overflow-hidden">
              <motion.div 
                className="bg-gradient-to-r from-primary-blue to-success-green h-3 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
            <div className="text-xs text-gray-500">
              {currentCount} / {MAX_CONTRIBUTORS} Contributors
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ready to Place Card */}
      <Card className="border border-gray-200 shadow-lg">
        <CardContent className="p-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-3">
            <Box className="text-brick-red w-5 h-5" />
            Ready to Place
          </h4>
          <div className="space-y-3">
            <motion.div 
              className="bg-yellow-50 border-2 border-dashed border-yellow-300 rounded-lg p-3 text-center opacity-70"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <span className="text-yellow-700 font-medium text-sm">Your Name Here</span>
            </motion.div>
            <motion.div 
              className="bg-blue-50 border-2 border-dashed border-blue-300 rounded-lg p-3 text-center opacity-50"
              animate={{ opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <span className="text-blue-700 font-medium text-sm">Next Contributor</span>
            </motion.div>
          </div>
        </CardContent>
      </Card>

      {/* Motivational Message */}
      <Card className="bg-gradient-to-br from-primary-blue to-blue-700 text-white border border-gray-200 shadow-lg">
        <CardContent className="p-6">
          <div className="text-center">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Heart className="w-8 h-8 mx-auto mb-3 opacity-80" />
            </motion.div>
            <p className="text-sm leading-relaxed font-medium">
              "Together, we're building the future of Jain Allied Science DMCC."
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
