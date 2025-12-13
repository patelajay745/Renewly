import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useApi } from "./useApi";
import { SubscriptionFormData } from "@/app/(home)/create-subscription";
import { RecentSubscription } from "@/types/dashboard";

interface CreateSubscriptionData extends SubscriptionFormData {
    expoToken: string;
}

export const useCreateSubscription = () => {

    const api = useApi();
    return useMutation({
        mutationFn: async (formData: CreateSubscriptionData) => {
            try {

                console.log("data to be submitted:", formData)

                const res = await api.post("/subscriptions", formData)

                return res.data
            } catch (error) {
                console.log("Error while creating a subscription", error)
                throw error
            }
        }
    })
}

export const useAllSubscriptions = () => {
    const api = useApi();

    return useQuery<RecentSubscription[]>({
        queryKey: ["allSubscriptions"],
        queryFn: async () => {
            try {
                const res = await api.get("/subscriptions");
                return res.data as RecentSubscription[];
            } catch (error) {
                console.log("Error fetching all subscriptions: ", error);
                throw error;
            }
        },
    });
};

export const useDeleteSubscription = () => {
    const api = useApi();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (subscriptionId: string) => {
            try {
                const res = await api.delete(`/subscriptions/${subscriptionId}`);
                return res.data;
            } catch (error) {
                console.log("Error deleting subscription: ", error);
                throw error;
            }
        },
        onSuccess: () => {
            // Invalidate and refetch
            queryClient.invalidateQueries({ queryKey: ["allSubscriptions"] });
            queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
        },
    });
};

export const useUpdateSubscription = () => {
    const api = useApi();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, data }: { id: string; data: Partial<CreateSubscriptionData> }) => {
            try {
                console.log("Updating subscription:", id, data);
                const res = await api.patch(`/subscriptions/${id}`, data);
                return res.data;
            } catch (error) {
                console.log("Error updating subscription: ", error);
                throw error;
            }
        },
        onSuccess: () => {
            // Invalidate and refetch
            queryClient.invalidateQueries({ queryKey: ["allSubscriptions"] });
            queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
        },
    });
};

export const useGetSubscription = (id: string) => {
    const api = useApi();

    return useQuery<RecentSubscription>({
        queryKey: ["subscription", id],
        queryFn: async () => {
            try {
                const res = await api.get(`/subscriptions/${id}`);
                return res.data as RecentSubscription;
            } catch (error) {
                console.log("Error fetching subscription: ", error);
                throw error;
            }
        },
        enabled: !!id,
    });
};