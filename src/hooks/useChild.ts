import { useQuery } from "@tanstack/react-query";
import { childService } from "../services/child.service";
import type { ChildId } from "../types";

export const useChild = (childId: ChildId | undefined) => {
  return useQuery({
    queryKey: ["child", childId],
    queryFn: () => childService.getChildById(childId as ChildId),
    enabled: Boolean(childId),
  });
};
