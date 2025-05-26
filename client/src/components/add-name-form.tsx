import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { UserPlus, Plus, CheckCircle, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertContributorSchema, type InsertContributor } from "@shared/schema";

export default function AddNameForm() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showSuccess, setShowSuccess] = useState(false);

  const form = useForm<InsertContributor>({
    resolver: zodResolver(insertContributorSchema),
    defaultValues: {
      name: "",
    },
  });

  const addContributorMutation = useMutation({
    mutationFn: async (data: InsertContributor) => {
      const response = await apiRequest("POST", "/api/contributors", data);
      return response.json();
    },
    onSuccess: (contributor) => {
      queryClient.invalidateQueries({ queryKey: ["/api/contributors"] });
      queryClient.invalidateQueries({ queryKey: ["/api/contributors/count"] });
      
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      
      toast({
        title: "Welcome to our community!",
        description: `${contributor.name} has been added to the wall successfully.`,
      });
      
      form.reset();
    },
    onError: (error: any) => {
      const message = error.message || "Failed to add contributor";
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertContributor) => {
    addContributorMutation.mutate(data);
  };

  return (
    <Card className="mb-8 border border-purple-200 shadow-xl bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 overflow-hidden">
      <CardContent className="p-6 relative">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-purple-200/30 to-transparent rounded-full -mr-16 -mt-16" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-pink-200/30 to-transparent rounded-full -ml-12 -mb-12" />
        
        <div className="relative">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <UserPlus className="text-purple-600 w-8 h-8" />
            </motion.div>
            Valuable Contributors
          </h2>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <motion.div
                          whileFocus={{ scale: 1.02 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Input
                            placeholder="Enter Your Name ✨"
                            className="border-2 border-purple-300 focus:border-purple-500 px-4 py-4 text-base rounded-xl bg-white/80 backdrop-blur-sm shadow-lg focus:shadow-xl transition-all duration-300"
                            {...field}
                          />
                        </motion.div>
                      </FormControl>
                      <FormMessage className="text-sm mt-1" />
                    </FormItem>
                  )}
                />
              </div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  type="submit"
                  disabled={addContributorMutation.isPending}
                  className="px-8 py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 hover:from-purple-700 hover:via-pink-700 hover:to-orange-600 transition-all duration-300 font-bold flex items-center justify-center gap-3 h-auto rounded-xl shadow-lg hover:shadow-xl text-white border-0"
                >
                  {addContributorMutation.isPending ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    />
                  ) : (
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Plus className="w-5 h-5" />
                    </motion.div>
                  )}
                  Add Name
                </Button>
              </motion.div>
            </form>
          </Form>

          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.8 }}
              className="mt-6 p-4 bg-gradient-to-r from-green-100 to-emerald-100 border-2 border-green-300 rounded-xl text-green-800 flex items-center gap-3 shadow-lg"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.5 }}
              >
                <CheckCircle className="w-6 h-6" />
              </motion.div>
              <span className="font-semibold">🎉 Name added successfully! Welcome to our community!</span>
            </motion.div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
