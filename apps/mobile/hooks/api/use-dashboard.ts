import { useQuery } from "@tanstack/react-query";
import { useApi } from "./useApi";
import { DashboardResponse } from "@/types/dashboard";

export const useGetDashboardStats = () => {
  const api = useApi();

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
  });
};
