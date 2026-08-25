import { useQuery } from "@tanstack/react-query";
import { lookupService } from "../services/lookup.service";

export const useLanguages = () => {
  return useQuery({
    queryKey: ["languages"],
    queryFn: () => lookupService.getLanguages(),
    staleTime: 1000 * 60 * 60, // Sprachen ändern sich praktisch nie - 1h Cache
  });
};
