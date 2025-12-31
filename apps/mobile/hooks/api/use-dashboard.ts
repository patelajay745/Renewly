import { useQuery } from "@tanstack/react-query";
import { useApi } from "./useApi";
import { DashboardResponse } from "@/types/dashboard";
import { useAuth } from "@clerk/clerk-expo";

export const useGetDashboardStats = () => {
  const api = useApi();
  const { isSignedIn } = useAuth();

  return useQuery<DashboardResponse>({
    queryKey: ["dashboardStats"],
    queryFn: async () => {
      try {
        const res = await api.get("/dashboard");

        return res.data as DashboardResponse;
      } catch (error) {
        console.log("Error fetching dashboard stats: ", error);
        throw error;
      }
    },
    enabled: !!isSignedIn, // Only run query if user is signed in
  });
};
