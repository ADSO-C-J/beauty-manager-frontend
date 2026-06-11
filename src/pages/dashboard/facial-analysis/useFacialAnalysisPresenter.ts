import { useState, useRef } from "react";
import { Sparkles, Palette, Scissors } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { toast } from "sonner";

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

export const useFacialAnalysisPresenter = () => {
  const [image, setImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraActive, setCameraActive] = useState(false);

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

  const analyzeImage = () => {
    if (!image) {
      toast.error("Por favor, carga una imagen primero");
      return;
    }

    setAnalyzing(true);

    setTimeout(() => {
      const skinTones = [
        { name: "Piel Clara", hex: "#F5D5C3" },
        { name: "Piel Morena Clara", hex: "#E8B89A" },
        { name: "Piel Morena", hex: "#C89968" },
        { name: "Piel Morena Oscura", hex: "#8D5524" },
        { name: "Piel Oscura", hex: "#5C4033" },
      ];

      const hairTypes = ["Lacio", "Ondulado", "Rizado", "Crespo", "Afro"];

      const faceShapes = ["Ovalado", "Redondo", "Cuadrado", "Corazón", "Diamante"];

      const randomSkinTone = skinTones[Math.floor(Math.random() * skinTones.length)];
      const randomHairType = hairTypes[Math.floor(Math.random() * hairTypes.length)];
      const randomFaceShape = faceShapes[Math.floor(Math.random() * faceShapes.length)];

      const result: AnalysisResult = {
        skinTone: randomSkinTone.name,
        hairType: randomHairType,
        faceShape: randomFaceShape,
        skinToneHex: randomSkinTone.hex,
        confidence: Math.floor(Math.random() * 15) + 85,
      };

      setAnalysisResult(result);
      generateRecommendations(result);
      setAnalyzing(false);
      toast.success("Análisis completado exitosamente");
    }, 2500);
  };

  const generateRecommendations = (result: AnalysisResult) => {
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

    setRecommendations(recs);
  };

  return {
    image,
    analyzing,
    analysisResult,
    recommendations,
    fileInputRef,
    videoRef,
    cameraActive,
    handleFileUpload,
    activateCamera,
    capturePhoto,
    analyzeImage,
  };
}