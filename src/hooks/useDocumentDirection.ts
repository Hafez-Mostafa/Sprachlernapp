import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { isRtl } from "../i18n/config";

/**Hält das dir- und lang-Attribut des <html>-Elements synchron zur
 * aktuell aktiven i18n-Sprache. Muss einmal auf oberster Ebene der App
 * eingebunden werden (z. B. in App.tsx).
 * Wichtig: CSS sollte durchgängig logische Properties nutzen
 * (margin-inline-start statt margin-left, etc.), damit das automatische
 * Spiegeln bei RTL greift, ohne dass jede Komponente einzeln angepasst
 * werden muss.*/
export const useDocumentDirection = () => {
  const { i18n } = useTranslation();

  useEffect(() => {
    const applyDirection = (lng: string) => {
      const dir = isRtl(lng) ? "rtl" : "ltr";
      document.documentElement.dir = dir;
      document.documentElement.lang = lng;
    };

    applyDirection(i18n.language);
    i18n.on("languageChanged", applyDirection);

    return () => {
      i18n.off("languageChanged", applyDirection);
    };
  }, [i18n]);
};
