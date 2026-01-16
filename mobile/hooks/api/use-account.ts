import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useApi } from "./useApi";

export const useDeleteAccount = () => {
    const api = useApi();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async () => {
            try {
                const res = await api.delete("/subscriptions/delete-account");
                return res.data;
            } catch (error) {
                console.log("Error deleting account: ", error);
                throw error;
            }
        },
        onSuccess: async () => {
            
            queryClient.clear();
        },
    });
};
