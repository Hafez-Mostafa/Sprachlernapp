import { useQuery } from "@tanstack/react-query";
import { childService } from "../services/child.service";
import { useAuth } from "./useAuth";

// Eindeutiger Key für den TanStack-Query-Cache
export const CHILDREN_QUERY_KEY = ["children"] as const;

/**
 * Custom Hook zum Abrufen und Cachen der Kinder-Liste.
 * Nutzt TanStack Query für automatisches Caching, Ladezustände und Fehlerbehandlung.
 */
export const useChildren = () => {
  // const { isAuthenticated } = useAuth();
  const { isAuthenticated, role } = useAuth();

  return useQuery({
    queryKey: CHILDREN_QUERY_KEY,
    queryFn: childService.getChildren,
    // Die Query wird nur ausgeführt, wenn der Nutzer tatsächlich eingeloggt ist
    // enabled: isAuthenticated,
    enabled: isAuthenticated && role === "guardian",
  });
};

/*
3. Wie dieser Hook in einer UI-Komponente genutzt wird
import React from "react";
import { useChildren } from "../hooks/useChildren";

export const ChildrenList: React.FC = () => {
  // Der Hook liefert automatisch Daten, Lade- und Fehlerzustand zurück
  const { data: children, isLoading, isError, error } = useChildren();

  if (isLoading) return <div>Kinder werden geladen...</div>;
  if (isError) return <div>Fehler beim Laden: {(error as Error).message}</div>;

  return (
    <ul>
      {children?.map((child) => (
        <li key={child.id}>{child.firstName} {child.lastName}</li>
      ))}
    </ul>
  );
};
*/
