import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { UserPlus, Sparkles, Heart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function AddNameForm() {
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const addContributorMutation = useMutation({
    mutationFn: async (name: string) => {
      const response = await apiRequest("POST", "/api/contributors", { name });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/contributors"] });
      queryClient.invalidateQueries({ queryKey: ["/api/contributors/count"] });
      setName("");
      setIsSubmitting(false);
      toast({
        title: "Welcome to the community!",
        description: "Your name has been added to our wall of contributors.",
      });
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
      className="mt-8"
    >
      <Card className="border border-gray-200 shadow-lg overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <CardTitle className="text-xl font-semibold flex items-center gap-3">
            <UserPlus className="w-6 h-6" />
            Join Our Community Wall
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center mb-6">
            <motion.div
              animate={{ 
                scale: [1, 1.05, 1],
                rotate: [0, 2, -2, 0] 
              }}
              transition={{ duration: 4, repeat: Infinity }}
              className="inline-flex items-center gap-2 text-lg font-medium text-gray-700 mb-2"
            >
              <Sparkles className="w-5 h-5 text-yellow-500" />
              Become a Valued Contributor
              <Heart className="w-5 h-5 text-red-500" />
            </motion.div>
            <p className="text-gray-600">
              Add your name to our community wall and become part of the Jain Allied Science DMCC family.
              Your contribution helps build something special together!
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                Your Name
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name (2-30 characters)"
                className="mt-1"
                maxLength={30}
                disabled={isSubmitting}
              />
              <p className="text-xs text-gray-500 mt-1">
                Only letters and spaces are allowed
              </p>
            </div>

            <Button
              type="submit"
              disabled={!name.trim() || isSubmitting}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Adding Your Name...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <UserPlus className="w-4 h-4" />
                  Add My Name to the Wall
                </div>
              )}
            </Button>
          </form>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-start gap-3">
              <div className="text-blue-600 mt-1">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-medium text-blue-900 mb-1">Why Join Our Wall?</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Be part of our growing community</li>
                  <li>• Show your support for Jain Allied Science DMCC</li>
                  <li>• Help us reach our goal of {54} contributors</li>
                  <li>• Your name becomes part of our digital legacy</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}