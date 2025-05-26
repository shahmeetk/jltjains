import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
    <Card className="mb-8 border border-gray-200 shadow-lg">
      <CardContent className="p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-3">
          <UserPlus className="text-primary-blue w-6 h-6" />
          Join Our Community
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
                      <Input
                        placeholder="Enter Your Name"
                        className="border-2 border-gray-300 focus:border-primary-blue px-4 py-3 text-base"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-sm mt-1" />
                  </FormItem>
                )}
              />
            </div>
            <Button
              type="submit"
              disabled={addContributorMutation.isPending}
              className="px-8 py-3 bg-primary-blue hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 font-medium flex items-center justify-center gap-2 h-auto"
            >
              {addContributorMutation.isPending ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
              Add Name
            </Button>
          </form>
        </Form>

        {showSuccess && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 flex items-center gap-2 animate-slide-in">
            <CheckCircle className="w-4 h-4" />
            <span>Name added successfully!</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
