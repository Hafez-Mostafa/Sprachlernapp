import React from "react";
import { useTranslation } from "react-i18next";
import { SUPPORTED_LANGUAGES, type SupportedLanguage } from "../i18n/config";

interface LanguageSwitcherProps {
  /**
   * "default": normale Darstellung auf hellem Hintergrund (z. B. im MainLayout-Header).
   * "onDark": kompakte, helle Variante für dunkle/farbige Hintergründe (z. B. Login-Header).
   */
  variant?: "default" | "onDark";
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  variant = "default",
}) => {
  const { t, i18n } = useTranslation();

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    void i18n.changeLanguage(event.target.value as SupportedLanguage);
  };

  const isOnDark = variant === "onDark";

  return (
    <label
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.4rem",
      }}
    >
      {!isOnDark && (
        <span style={{ fontSize: "0.875rem" }}>{t("language.switchLabel")}</span>
      )}
      <select
        value={i18n.language}
        onChange={handleChange}
        aria-label={t("language.switchLabel")}
        style={
          isOnDark
            ? {
              background: "rgba(255,255,255,0.15)",
              color: "#ffffff",
              border: "1px solid rgba(255,255,255,0.4)",
              borderRadius: "999px",
              padding: "0.3rem 0.7rem",
              fontSize: "0.8rem",
              cursor: "pointer",
            }
            : undefined
        }
      >
        {SUPPORTED_LANGUAGES.map((lng) => (
          <option
            key={lng}
            value={lng}
            style={isOnDark ? { color: "#1e293b" } : undefined}
          >
            {t(`language.${lng}`)}
          </option>
        ))}
      </select>
    </label>
  );
};
