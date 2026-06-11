import { Camera, Upload, Sparkles, User, Scissors } from "lucide-react";
import { Button } from "@components/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/card";
import { Badge } from "@components/badge";
import { Progress } from "@components/progress";
import { useFacialAnalysisPresenter } from "./useFacialAnalysisPresenter";

const FacialAnalysis = () => {
  const {
    image,
    videoRef,
    analyzing,
    cameraActive,
    capturePhoto,
    fileInputRef,
    analyzeImage,
    activateCamera,
    analysisResult,
    recommendations,
    handleFileUpload,
  } = useFacialAnalysisPresenter();
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-semibold text-[#2D3748]">Análisis Facial</h2>
        <p className="text-[#718096] mt-1">
          Descubre qué estilos y colores te favorecen más según tus rasgos
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Captura tu Imagen</CardTitle>
            <CardDescription>
              Usa tu cámara o sube una foto para comenzar el análisis
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="aspect-square max-h-64 sm:max-h-80 w-full bg-[#F7FAFC] rounded-lg flex items-center justify-center overflow-hidden relative">
              {cameraActive && (
                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
              )}
              {image && !cameraActive && (
                <img src={image} alt="Uploaded" className="w-full h-full object-cover" />
              )}
              {!image && !cameraActive && (
                <div className="text-center">
                  <User className="w-16 h-16 text-[#CBD5E0] mx-auto mb-2" />
                  <p className="text-[#A0AEC0]">Sin imagen</p>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              {!cameraActive ? (
                <>
                  <Button
                    onClick={activateCamera}
                    className="flex-1 bg-[#4A5568] hover:bg-[#2D3748]"
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    Usar Cámara
                  </Button>
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    variant="outline"
                    className="flex-1"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Subir Foto
                  </Button>
                </>
              ) : (
                <Button onClick={capturePhoto} className="flex-1 bg-[#4A5568] hover:bg-[#2D3748]">
                  <Camera className="w-4 h-4 mr-2" />
                  Capturar Foto
                </Button>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />

            <Button
              onClick={analyzeImage}
              disabled={!image || analyzing}
              className="w-full bg-[#48BB78] hover:bg-[#38A169] text-white"
            >
              {analyzing ? (
                <>
                  <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                  Analizando...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Iniciar Análisis
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {analysisResult && (
          <Card>
            <CardHeader>
              <CardTitle>Resultados del Análisis</CardTitle>
              <CardDescription>
                Características detectadas con {analysisResult.confidence}% de confianza
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-[#4A5568]">Precisión</span>
                  <span className="text-sm text-[#718096]">{analysisResult.confidence}%</span>
                </div>
                <Progress value={analysisResult.confidence} className="h-2" />
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-[#F7FAFC] rounded-lg">
                  <div
                    className="w-12 h-12 rounded-full border-2 border-white shadow-sm"
                    style={{ backgroundColor: analysisResult.skinToneHex }}
                  ></div>
                  <div>
                    <p className="text-sm text-[#718096]">Tono de Piel</p>
                    <p className="font-medium text-[#2D3748]">{analysisResult.skinTone}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-[#F7FAFC] rounded-lg">
                  <div className="w-12 h-12 rounded-full bg-[#4A5568] flex items-center justify-center">
                    <Scissors className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-[#718096]">Tipo de Cabello</p>
                    <p className="font-medium text-[#2D3748]">{analysisResult.hairType}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-[#F7FAFC] rounded-lg">
                  <div className="w-12 h-12 rounded-full bg-[#48BB78] flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-[#718096]">Forma del Rostro</p>
                    <p className="font-medium text-[#2D3748]">{analysisResult.faceShape}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {recommendations.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold text-[#2D3748] mb-4">
            Recomendaciones Personalizadas
          </h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {recommendations.map((rec, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#4A5568] flex items-center justify-center flex-shrink-0">
                      <rec.icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <Badge variant="secondary" className="mb-2">
                        {rec.category}
                      </Badge>
                      <CardTitle className="text-lg">{rec.title}</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-[#718096]">{rec.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default FacialAnalysis;