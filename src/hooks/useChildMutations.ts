import { useMutation, useQueryClient } from "@tanstack/react-query";
import { childService } from "../services/child.service";
import { CHILDREN_QUERY_KEY } from "./useChildren";
import type {
  ChildId,
  ChildProfileCreateRequest,
  ChildProfileUpdateRequest,
} from "../types";

export const useCreateChild = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ChildProfileCreateRequest) =>
      childService.createChild(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CHILDREN_QUERY_KEY });
    },
  });
};

export const useUpdateChild = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      childId,
      payload,
    }: {
      childId: ChildId;
      payload: ChildProfileUpdateRequest;
    }) => childService.updateChild(childId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CHILDREN_QUERY_KEY });
    },
  });
};

export const useDeleteChild = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (childId: ChildId) => childService.deleteChild(childId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CHILDREN_QUERY_KEY });
    },
  });
};
