import { useQuery } from "@tanstack/react-query";
import { useApi } from "./useApi";
import type { DashboardResponse } from "@/types/dashboard";

export const useGetDashboardStats = () => {
  const api = useApi();

  return useQuery<DashboardResponse>({
    queryKey: ["dashboardStats"],
    refetchInterval: 60000,
    queryFn: async () => {
      try {
        const res = await api.get("/dashboard/admin");

        return res.data as DashboardResponse;
      } catch (error) {
        console.log("Error fetching dashboard stats: ", error);
        throw error;
      }
    },
  });
};
