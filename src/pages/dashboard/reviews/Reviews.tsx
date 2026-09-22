import {
  Plus,
  Filter,
  Search,
  X,
  Star,
  MessageSquare,
  User,
  CalendarDays,
  Eye,
  EyeOff,
  TrendingUp,
} from 'lucide-react';
import { Button } from '@components/button';
import { Card, CardContent } from '@components/card';
import { Badge } from '@components/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@components/dialog';
import { Input } from '@components/input';
import { Label } from '@components/label';
import { Switch } from '@components/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@components/select';
import { useReviewsPresenter } from './useReviewsPresenter';

const formatDate = (iso?: string) =>
  iso
    ? new Date(iso).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : '—';

interface Option {
  id: string;
  label: string;
}

// Etiqueta legible para un id; cae al ID corto si no está entre las opciones cargadas.
const optionLabel = (id: string, options: Option[], shortPrefix: string) =>
  options.find((o) => o.id === id)?.label ?? `${shortPrefix} #${id.slice(0, 8)}`;

const Stars = ({ rating }: { rating: number }) => (
  <div className="flex items-center gap-0.5">
    {Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'fill-[#ECC94B] text-[#ECC94B]' : 'text-[#CBD5E0]'
        }`}
      />
    ))}
  </div>
);

const Reviews = () => {
  const {
    ratingStats,
    appointmentOptions,
    clientOptions,
    stylistOptions,
    isLoading,
    error,
    clearError,
    searchTerm,
    setSearchTerm,
    filterRating,
    setFilterRating,
    open,
    setOpen,
    form,
    setForm,
    errors,
    detailReview,
    setDetailReview,
    handleClose,
    handleSubmit,
    toggleVisibility,
    deleteReview,
    filteredReviews,
    averageRating,
  } = useReviewsPresenter();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-[#2D3748]">Reseñas</h2>
          <p className="text-[#4A5568] mt-1">Valoraciones de clientes sobre citas completadas</p>
        </div>
        <Button
          className="bg-[#4A5568] hover:bg-[#2D3748] w-full sm:w-auto"
          onClick={() => setOpen(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Nueva reseña
        </Button>

        <Dialog
          open={open}
          onOpenChange={(isOpen) => {
            if (!isOpen) handleClose();
          }}
        >
          <DialogContent className="w-[calc(100vw-2rem)] sm:max-w-lg max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Crear reseña</DialogTitle>
            </DialogHeader>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <Label htmlFor="appointmentId">Cita</Label>
                <Select
                  value={form.appointmentId}
                  onValueChange={(v) => setForm({ ...form, appointmentId: v })}
                >
                  <SelectTrigger id="appointmentId">
                    <SelectValue placeholder="Selecciona una cita" />
                  </SelectTrigger>
                  <SelectContent>
                    {appointmentOptions.length === 0 && (
                      <div className="px-2 py-1.5 text-sm text-[#718096]">
                        No hay citas disponibles
                      </div>
                    )}
                    {appointmentOptions.map((opt) => (
                      <SelectItem key={opt.id} value={opt.id}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.appointmentId && (
                  <p className="text-red-500 text-xs mt-1">{errors.appointmentId}</p>
                )}
              </div>

              <div>
                <Label htmlFor="clientId">Cliente</Label>
                <Select
                  value={form.clientId}
                  onValueChange={(v) => setForm({ ...form, clientId: v })}
                >
                  <SelectTrigger id="clientId">
                    <SelectValue placeholder="Selecciona un cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    {clientOptions.length === 0 && (
                      <div className="px-2 py-1.5 text-sm text-[#718096]">
                        No hay clientes disponibles
                      </div>
                    )}
                    {clientOptions.map((opt) => (
                      <SelectItem key={opt.id} value={opt.id}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.clientId && (
                  <p className="text-red-500 text-xs mt-1">{errors.clientId}</p>
                )}
              </div>

              <div>
                <Label htmlFor="staffId">Estilista (opcional)</Label>
                <Select
                  value={form.staffId || 'none'}
                  onValueChange={(v) =>
                    setForm({ ...form, staffId: v === 'none' ? '' : v })
                  }
                >
                  <SelectTrigger id="staffId">
                    <SelectValue placeholder="Selecciona un estilista" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Sin asignar</SelectItem>
                    {stylistOptions.map((opt) => (
                      <SelectItem key={opt.id} value={opt.id}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Calificación</Label>
                <div className="flex items-center gap-2 mt-1">
                  {Array.from({ length: 5 }, (_, i) => i + 1).map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setForm({ ...form, rating: value })}
                      aria-label={`${value} estrellas`}
                    >
                      <Star
                        className={`w-7 h-7 ${
                          value <= form.rating
                            ? 'fill-[#ECC94B] text-[#ECC94B]'
                            : 'text-[#CBD5E0]'
                        }`}
                      />
                    </button>
                  ))}
                </div>
                {errors.rating && (
                  <p className="text-red-500 text-xs mt-1">{errors.rating}</p>
                )}
              </div>

              <div>
                <Label htmlFor="comment">Comentario (opcional)</Label>
                <Input
                  id="comment"
                  placeholder="Comentario del cliente..."
                  value={form.comment}
                  onChange={(e) => setForm({ ...form, comment: e.target.value })}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="isPublic">Reseña pública</Label>
                <Switch
                  id="isPublic"
                  checked={form.isPublic}
                  onCheckedChange={(checked) => setForm({ ...form, isPublic: checked })}
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button type="submit" className="flex-1 bg-[#4A5568] hover:bg-[#2D3748]">
                  Guardar reseña
                </Button>
                <Button type="button" variant="outline" className="flex-1" onClick={handleClose}>
                  Cancelar
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Resumen */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-[#ECC94B]/10">
              <Star className="w-6 h-6 text-[#D69E2E]" />
            </div>
            <div>
              <p className="text-sm text-[#718096]">Promedio general</p>
              <p className="text-xl font-bold text-[#2D3748]">
                {averageRating.toFixed(1)} / 5
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-[#4A5568]/10">
              <MessageSquare className="w-6 h-6 text-[#4A5568]" />
            </div>
            <div>
              <p className="text-sm text-[#718096]">Total de reseñas</p>
              <p className="text-xl font-bold text-[#2D3748]">{filteredReviews.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-[#48BB78]/10">
              <TrendingUp className="w-6 h-6 text-[#48BB78]" />
            </div>
            <div>
              <p className="text-sm text-[#718096]">Estilistas valorados</p>
              <p className="text-xl font-bold text-[#2D3748]">{ratingStats.length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Ranking por estilista */}
      {ratingStats.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold text-[#2D3748] mb-3">Rating por estilista</h3>
            <div className="space-y-2">
              {ratingStats.map((stat) => (
                <div
                  key={stat.staffId}
                  className="flex items-center justify-between gap-3 bg-gray-50 rounded-lg p-3"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <User className="w-4 h-4 text-[#718096] shrink-0" />
                    <span className="text-sm font-medium text-[#2D3748] truncate">
                      {stat.staffName}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <Stars rating={Math.round(stat.averageRating)} />
                    <span className="text-sm text-[#718096]">
                      {stat.averageRating.toFixed(1)} ({stat.totalReviews})
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 w-4 h-4 text-[#A0AEC0]" />
          <Input
            placeholder="Buscar por comentario o cita..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select
          value={filterRating === 'all' ? 'all' : String(filterRating)}
          onValueChange={(v) => setFilterRating(v === 'all' ? 'all' : Number(v))}
        >
          <SelectTrigger className="w-full sm:w-48">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las calificaciones</SelectItem>
            {[5, 4, 3, 2, 1].map((value) => (
              <SelectItem key={value} value={String(value)}>
                {value} estrellas
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {error && (
        <div
          className="flex items-center justify-between rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600"
          onClick={clearError}
        >
          {error}
          <X className="w-4 h-4 cursor-pointer" />
        </div>
      )}

      <div className="grid gap-4">
        {isLoading && <p className="text-sm text-[#718096]">Cargando reseñas...</p>}
        {!isLoading && filteredReviews.length === 0 && (
          <p className="text-sm text-[#718096]">No hay reseñas registradas.</p>
        )}
        {filteredReviews.map((review) => (
          <Card key={review.id}>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <Stars rating={review.rating} />
                    {!review.isPublic && (
                      <Badge className="bg-gray-200 text-[#4A5568]">Privada</Badge>
                    )}
                  </div>
                  <p className="text-sm text-[#2D3748] mt-2">
                    {review.comment ?? 'Sin comentario'}
                  </p>
                  <p className="text-xs text-[#A0AEC0] mt-1">
                    Cita #{review.appointmentId.slice(0, 8)} • {formatDate(review.createdAt)}
                  </p>
                </div>
                <div className="flex items-center gap-3 sm:ml-auto">
                  <Button variant="outline" size="sm" onClick={() => setDetailReview(review)}>
                    Ver detalles
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modal detalle */}
      {detailReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-xl font-semibold text-[#2D3748]">Detalle de reseña</h3>
              <button
                onClick={() => setDetailReview(null)}
                className="text-[#718096] hover:text-[#2D3748]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <Stars rating={detailReview.rating} />
                <Badge className={detailReview.isPublic ? 'bg-[#48BB78] text-white' : 'bg-gray-200 text-[#4A5568]'}>
                  {detailReview.isPublic ? 'Pública' : 'Privada'}
                </Badge>
              </div>

              {detailReview.comment && (
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <MessageSquare className="w-4 h-4 text-[#718096]" />
                    <p className="text-xs text-[#718096]">Comentario</p>
                  </div>
                  <p className="text-sm text-[#2D3748]">{detailReview.comment}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <CalendarDays className="w-4 h-4 text-[#718096]" />
                    <p className="text-xs text-[#718096]">Fecha</p>
                  </div>
                  <p className="text-sm font-semibold text-[#2D3748]">
                    {formatDate(detailReview.createdAt)}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <User className="w-4 h-4 text-[#718096]" />
                    <p className="text-xs text-[#718096]">Cliente</p>
                  </div>
                  <p className="text-sm font-semibold text-[#2D3748]">
                    {optionLabel(detailReview.clientId, clientOptions, 'Cliente')}
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-[#718096] mb-1">Cita</p>
                <p className="text-sm font-semibold text-[#2D3748]">
                  {optionLabel(detailReview.appointmentId, appointmentOptions, 'Cita')}
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => void toggleVisibility(detailReview)}
                >
                  {detailReview.isPublic ? (
                    <>
                      <EyeOff className="w-4 h-4 mr-2" /> Hacer privada
                    </>
                  ) : (
                    <>
                      <Eye className="w-4 h-4 mr-2" /> Hacer pública
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 border-red-300 text-red-500 hover:bg-red-50"
                  onClick={() => void deleteReview(detailReview.id)}
                >
                  Eliminar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reviews;