import { useMutation } from "@tanstack/react-query";
import { useApi } from "./useApi";
import { SubscriptionFormData } from "@/app/(home)/create-subscription";

interface CreateSubscriptionData extends SubscriptionFormData {
    expoToken: string;
}

export const useCreateSubscription = () => {

    const api = useApi();
    return useMutation({
        mutationFn: async (formData: CreateSubscriptionData) => {
            try {

                console.log("data to be submitted:", formData)

                // const res = await api.post("/subscriptions", formData)
            } catch (error) {
                console.log("Error while creating a subscription", error)
                throw error
            }
        }
    })
}