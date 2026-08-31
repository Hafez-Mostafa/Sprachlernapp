import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  useWordDetailAdmin,
  useUpsertWordImage,
  useUploadWordImage,
  useDeleteWordImage,
  useUpsertWordAudio,
  useUploadWordAudio,
  useDeleteWordAudio,
} from "../hooks/useWordMediaMutations";
import { firstImageUrl, firstAudioUrl } from "../hooks/useWordDetails";
import type { WordId } from "../types";

interface WordMediaModalProps {
  wordId: WordId;
  wordText: string;
  onClose: () => void;
}

export const WordMediaModal: React.FC<WordMediaModalProps> = ({
  wordId,
  wordText,
  onClose,
}) => {
  const { t } = useTranslation();
  const { data: wordDetail, isLoading } = useWordDetailAdmin(wordId);

  const upsertImage = useUpsertWordImage(wordId);
  const uploadImage = useUploadWordImage(wordId);
  const deleteImage = useDeleteWordImage(wordId);
  const upsertAudio = useUpsertWordAudio(wordId);
  const uploadAudio = useUploadWordAudio(wordId);
  const deleteAudio = useDeleteWordAudio(wordId);

  const [imageUrl, setImageUrl] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [hasSavedImage, setHasSavedImage] = useState(Boolean(firstImageUrl(wordDetail)));

  const currentImageUrl = firstImageUrl(wordDetail);
  const currentAudioUrl = firstAudioUrl(wordDetail);

  // Eingabefelder mit den aktuell gesetzten URLs vorbefüllen, sobald geladen
  useEffect(() => {
    setImageUrl(currentImageUrl ?? "");
  }, [currentImageUrl]);

  useEffect(() => {
    setAudioUrl(currentAudioUrl ?? "");
  }, [currentAudioUrl]);

  useEffect(() => {
    setHasSavedImage(Boolean(currentImageUrl));
  }, [currentImageUrl]);

  const handleSaveImage = () => {
    if (imageFile) {
      uploadImage.mutate(imageFile, {
        onSuccess: () => {
          setHasSavedImage(true);
          setImageFile(null);
          setImageUrl("");
        },
      });
      return;
    }

    if (!imageUrl.trim()) return;
    upsertImage.mutate({ url: imageUrl.trim() }, {
      onSuccess: () => {
        setHasSavedImage(true);
        setImageUrl("");
      },
    });
  };

  const handleSaveAudio = () => {
    if (audioFile) {
      uploadAudio.mutate(audioFile, {
        onSuccess: () => {
          setAudioFile(null);
          setAudioUrl("");
        },
      });
      return;
    }

    if (!audioUrl.trim()) return;
    upsertAudio.mutate({ url: audioUrl.trim() }, {
      onSuccess: () => {
        setAudioUrl("");
      },
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="text-lg font-bold text-slate-900">{wordText}</h2>
        <p className="text-sm text-slate-500">{t("admin.mediaSubtitle")}</p>

        {isLoading ? (
          <p className="mt-4 text-sm text-slate-400">{t("common.loading")}</p>
        ) : (
          <div className="mt-4 flex flex-col gap-6">
            {/* Bild */}
            <div>
              <p className="text-sm font-medium text-slate-700">
                {t("admin.image")}
              </p>

              {currentImageUrl && (
                <img
                  src={currentImageUrl}
                  alt=""
                  className="mt-2 h-24 w-24 rounded-xl object-cover"
                />
              )}

              <div className="mt-2 flex flex-col gap-2">
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://... oder Cloudinary-URL"
                  className="flex-1 rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20"
                />
                <label className="flex cursor-pointer items-center justify-between rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-700">
                  <span>{imageFile ? imageFile.name : "Datei auswählen"}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0] ?? null;
                      setImageFile(file);
                    }}
                    className="hidden"
                  />
                </label>
                <button
                  type="button"
                  onClick={handleSaveImage}
                  disabled={upsertImage.isPending || uploadImage.isPending}
                  className="rounded-xl bg-indigo-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-60"
                >
                  {upsertImage.isPending || uploadImage.isPending
                    ? t("common.loading")
                    : t("common.save")}
                </button>
              </div>

              {currentImageUrl && (
                <button
                  type="button"
                  onClick={() => deleteImage.mutate()}
                  disabled={deleteImage.isPending}
                  className="mt-2 text-sm font-medium text-red-600 hover:underline"
                >
                  {t("admin.removeImage")}
                </button>
              )}
            </div>

            {/* Audio */}
            <div>
              <p className="text-sm font-medium text-slate-700">
                {t("admin.audio")}
              </p>

              {currentAudioUrl && (
                <audio controls src={currentAudioUrl} className="mt-2 w-full" />
              )}

              <div className="mt-2 flex flex-col gap-2">
                <input
                  type="text"
                  value={audioUrl}
                  onChange={(e) => setAudioUrl(e.target.value)}
                  placeholder="https://... oder Audio-Link"
                  className="flex-1 rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20"
                />
                <label className="flex cursor-pointer items-center justify-between rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-700">
                  <span>{audioFile ? audioFile.name : "Datei auswählen"}</span>
                  <input
                    type="file"
                    accept="audio/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0] ?? null;
                      setAudioFile(file);
                    }}
                    className="hidden"
                  />
                </label>
                <button
                  type="button"
                  onClick={handleSaveAudio}
                  disabled={upsertAudio.isPending || uploadAudio.isPending}
                  className="rounded-xl bg-indigo-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-60"
                >
                  {upsertAudio.isPending || uploadAudio.isPending
                    ? t("common.loading")
                    : t("common.save")}
                </button>
              </div>

              {currentAudioUrl && (
                <button
                  type="button"
                  onClick={() => deleteAudio.mutate()}
                  disabled={deleteAudio.isPending}
                  className="mt-2 text-sm font-medium text-red-600 hover:underline"
                >
                  {t("admin.removeAudio")}
                </button>
              )}
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={onClose}
          disabled={!hasSavedImage}
          className="mt-6 w-full rounded-xl bg-slate-900 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {hasSavedImage ? t("common.back") : "Bild zuerst speichern"}
        </button>
      </div>
    </div>
  );
};
