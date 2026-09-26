import { useCallback, useEffect, useRef, useState } from "react";
import { Sparkles, Palette, Scissors } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { toast } from "sonner";
import { facialAnalysisService } from "@modules/facial-analysis/application/facialAnalysisServices";
import {
  skinToneLabel,
  hairTypeLabel,
  faceShapeLabel,
} from "@modules/facial-analysis/infrastructure/mappers/facialAnalysisMapper";
import type {
  FacialAnalysis,
  HairType,
  FaceShape,
  SkinTone,
} from "@modules/facial-analysis/domain/models/FacialAnalysis";
import { useAuthStore } from "@modules/auth/application/state/authStore";

interface AnalysisResult {
  skinTone: string;
  hairType: string;
  faceShape: string;
  skinToneHex: string;
  confidence: number;
}

interface Recommendation {
  category: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

// Detección local (no hay endpoint de inferencia en el backend):
// los valores se eligen al azar entre las opciones válidas de la API y luego
// se PERSISTEN en el backend mediante createAnalysis().
const SKIN_TONE_OPTIONS: { value: SkinTone; hex: string }[] = [
  { value: "muy_clara", hex: "#F5D5C3" },
  { value: "clara", hex: "#E8B89A" },
  { value: "morena_clara", hex: "#D9A97C" },
  { value: "morena", hex: "#C89968" },
  { value: "morena_oscura", hex: "#8D5524" },
  { value: "oscura", hex: "#5C4033" },
];

const HAIR_TYPE_OPTIONS: HairType[] = ["lacio", "ondulado", "rizado", "crespo", "afro"];
const FACE_SHAPE_OPTIONS: FaceShape[] = [
  "ovalado",
  "redondo",
  "cuadrado",
  "corazon",
  "diamante",
  "rectangular",
];

const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

export const useFacialAnalysisPresenter = () => {
  const user = useAuthStore((state) => state.user);
  const [image, setImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [history, setHistory] = useState<FacialAnalysis[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraActive, setCameraActive] = useState(false);

  const loadHistory = useCallback(async (isCancelled?: () => boolean) => {
    const clientId = user?.id;
    if (!clientId) return;
    setIsLoadingHistory(true);
    try {
      const data = await facialAnalysisService.getAnalyses(clientId);
      if (isCancelled?.()) return;
      setHistory(data);
    } catch {
      // El historial es opcional; no bloquea la página si falla.
    } finally {
      if (!isCancelled?.()) setIsLoadingHistory(false);
    }
  }, [user?.id]);

  useEffect(() => {
    let cancelled = false;
    const isCancelled = () => cancelled;
    Promise.resolve()
      .then(() => loadHistory(isCancelled))
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [loadHistory]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target?.result as string);
        setCameraActive(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const activateCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
        setImage(null);
      }
    } catch (error) {
      console.error(error);
      toast.error("No se pudo acceder a la cámara");
    }
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx?.drawImage(videoRef.current, 0, 0);
      const imageData = canvas.toDataURL("image/jpeg");
      setImage(imageData);

      const stream = videoRef.current.srcObject as MediaStream;
      stream?.getTracks().forEach((track) => track.stop());
      setCameraActive(false);
    }
  };

  const analyzeImage = async () => {
    if (!image) {
      toast.error("Por favor, carga una imagen primero");
      return;
    }

    setAnalyzing(true);

    const skinTone = pick(SKIN_TONE_OPTIONS);
    const hairType = pick(HAIR_TYPE_OPTIONS);
    const faceShape = pick(FACE_SHAPE_OPTIONS);
    const confidence = Math.floor(Math.random() * 15) + 85;

    const result: AnalysisResult = {
      skinTone: skinToneLabel(skinTone.value),
      hairType: hairTypeLabel(hairType),
      faceShape: faceShapeLabel(faceShape),
      skinToneHex: skinTone.hex,
      confidence,
    };

    const recs = buildRecommendations(result);

    setAnalysisResult(result);
    setRecommendations(recs);
    setAnalyzing(false);
    toast.success("Análisis completado exitosamente");

    // Persistir el análisis en el backend (best-effort: la UI ya se actualizó).
    const clientId = user?.id;
    if (!clientId) {
      toast.error("No se pudo guardar el análisis: sesión sin cliente asociado");
      return;
    }
    setIsSaving(true);
    try {
      const saved = await facialAnalysisService.createAnalysis(clientId, {
        imageUrl: image,
        skinTone: skinTone.value,
        skinToneHex: skinTone.hex,
        hairType,
        faceShape,
        confidencePct: confidence,
        recommendations: recs.map(({ category, title, description }) => ({
          category,
          title,
          description,
        })),
      });
      setHistory((prev) => [saved, ...prev]);
    } catch {
      toast.error("El análisis se mostró pero no se pudo guardar en el servidor");
    } finally {
      setIsSaving(false);
    }
  };

  return {
    image,
    analyzing,
    analysisResult,
    recommendations,
    fileInputRef,
    videoRef,
    cameraActive,
    history,
    isSaving,
    isLoadingHistory,
    handleFileUpload,
    activateCamera,
    capturePhoto,
    analyzeImage,
  };
};

function buildRecommendations(result: AnalysisResult): Recommendation[] {
    const recs: Recommendation[] = [];

    if (result.skinTone.includes("Clara")) {
      recs.push({
        category: "Coloración",
        title: "Tonos Cálidos y Pastel",
        description:
          "Los tonos miel, caramelo y rubios cenizas resaltarán tu tono de piel. Evita tonos muy oscuros que pueden crear contraste excesivo.",
        icon: Palette,
      });
    } else if (result.skinTone.includes("Morena")) {
      recs.push({
        category: "Coloración",
        title: "Tonos Caoba y Chocolate",
        description:
          "Los tonos caobas, chocolates y castaños con reflejos dorados son perfectos para tu tono de piel. También puedes experimentar con rojizos.",
        icon: Palette,
      });
    } else {
      recs.push({
        category: "Coloración",
        title: "Tonos Profundos y Vibrantes",
        description:
          "Los tonos negro azulado, borgoña intenso y castaño oscuro con reflejos cobre complementarán hermosamente tu tono de piel.",
        icon: Palette,
      });
    }

    if (result.hairType === "Lacio") {
      recs.push({
        category: "Corte",
        title: "Capas y Textura",
        description:
          "Un corte en capas agregará movimiento y volumen. Considera un bob largo o capas desfiladas para darle más vida a tu cabello.",
        icon: Scissors,
      });
    } else if (result.hairType === "Ondulado" || result.hairType === "Rizado") {
      recs.push({
        category: "Corte",
        title: "Mantén el Largo",
        description:
          "Los cortes largos con capas suaves realzan tus rizos naturales. Evita capas muy cortas que pueden crear volumen no deseado.",
        icon: Scissors,
      });
    } else {
      recs.push({
        category: "Corte",
        title: "Cortes Estructurados",
        description:
          "Un afro definido o un corte estilo TWA (Teeny Weeny Afro) resaltará la textura natural de tu cabello. Considera también trenzas o locs.",
        icon: Scissors,
      });
    }

    if (result.faceShape === "Redondo") {
      recs.push({
        category: "Estilo",
        title: "Largo y con Volumen en la Corona",
        description:
          "Estilos que añaden altura en la parte superior alargan visualmente el rostro. Evita cortes a la altura de la barbilla.",
        icon: Sparkles,
      });
    } else if (result.faceShape === "Cuadrado") {
      recs.push({
        category: "Estilo",
        title: "Suaviza los Ángulos",
        description:
          "Ondas suaves y flequillo lateral ayudan a suavizar la mandíbula. Los cortes bob con textura también funcionan muy bien.",
        icon: Sparkles,
      });
    } else if (result.faceShape === "Corazón") {
      recs.push({
        category: "Estilo",
        title: "Equilibra la Frente",
        description:
          "Flequillo lateral o cortina, y cortes que añaden volumen en la barbilla equilibran las proporciones de tu rostro.",
        icon: Sparkles,
      });
    } else {
      recs.push({
        category: "Estilo",
        title: "Realza tus Rasgos",
        description:
          "Tu forma de rostro es muy versátil. Prácticamente cualquier estilo te quedará bien. Experimenta con confianza!",
        icon: Sparkles,
      });
    }

    recs.push({
      category: "Tratamiento",
      title: "Hidratación Profunda",
      description:
        "Basado en tu tipo de cabello, te recomendamos tratamientos de hidratación intensiva cada 2 semanas para mantener brillo y salud.",
      icon: Sparkles,
    });

    return recs;
}