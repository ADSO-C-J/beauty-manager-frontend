import { Plus, Clock, DollarSign, X, Tag, FileText } from "lucide-react";
import { Button } from "@components/button";
import { Card, CardContent } from "@components/card";
import { Badge } from "@components/badge";
import { useServicesPresenter } from "./useServicesPresenter";

const categories = ["Todos", "Cabello", "Manos", "Pies", "Caballeros"];


const Services = () => {
  const {
    form,
    errors,
    setForm,
    openEdit,
    modalMode,
    openCreate,
    handleSubmit,
    showFormModal,
    detailService,
    activeCategory,
    handleCloseForm,
    setDetailService,
    filteredServices,
    setActiveCategory,
  } = useServicesPresenter();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-[#2D3748]">Servicios</h2>
          <p className="text-[#4A5568] mt-1">Gestiona los servicios disponibles en tu salón</p>
        </div>
        <Button className="bg-[#4A5568] hover:bg-[#2D3748] w-full sm:w-auto" onClick={openCreate}>
          <Plus className="w-4 h-4 mr-2" />
          Nuevo servicio
        </Button>
      </div>

      {/* Category filters */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map((category) => (
          <Button
            key={category}
            variant={activeCategory === category ? "default" : "outline"}
            className={activeCategory === category ? "bg-[#4A5568] hover:bg-[#2D3748]" : ""}
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Service cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredServices.map((service) => (
          <Card key={service.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-lg text-[#2D3748]">{service.name}</h3>
                    {service.popular && <Badge className="bg-[#48BB78] text-white">Popular</Badge>}
                  </div>
                  <Badge variant="outline" className="mt-2">
                    {service.category}
                  </Badge>
                </div>

                <p className="text-sm text-[#4A5568]">{service.description}</p>

                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2 text-[#718096]">
                    <Clock className="w-4 h-4" />
                    <span>{service.duration}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#718096]">
                    <DollarSign className="w-4 h-4" />
                    <span className="font-semibold text-[#2D3748]">{service.price}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200 flex gap-2">
                  <Button variant="outline" className="flex-1" onClick={() => openEdit(service)}>
                    Editar
                  </Button>
                  <Button
                    className="flex-1 bg-[#4A5568] hover:bg-[#2D3748]"
                    onClick={() => setDetailService(service)}
                  >
                    Ver detalles
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create / Edit modal */}
      {showFormModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-xl font-semibold text-[#2D3748]">
                {modalMode === "create" ? "Nuevo servicio" : "Editar servicio"}
              </h3>
              <button onClick={handleCloseForm} className="text-[#718096] hover:text-[#2D3748]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#2D3748] mb-1">
                  Nombre del servicio <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Ej. Corte de cabello"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4A5568]"
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-[#2D3748] mb-1">Categoría</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4A5568]"
                >
                  {categories
                    .filter((c) => c !== "Todos")
                    .map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#2D3748] mb-1">
                    Duración <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.duration}
                    onChange={(e) => setForm({ ...form, duration: e.target.value })}
                    placeholder="Ej. 1h, 45min"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4A5568]"
                  />
                  {errors.duration && (
                    <p className="text-red-500 text-xs mt-1">{errors.duration}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#2D3748] mb-1">
                    Precio <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    placeholder="Ej. 25"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4A5568]"
                  />
                  {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#2D3748] mb-1">
                  Descripción <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Describe el servicio..."
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4A5568] resize-none"
                />
                {errors.description && (
                  <p className="text-red-500 text-xs mt-1">{errors.description}</p>
                )}
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="popular"
                  checked={form.popular}
                  onChange={(e) => setForm({ ...form, popular: e.target.checked })}
                  className="w-4 h-4 accent-[#4A5568]"
                />
                <label htmlFor="popular" className="text-sm text-[#2D3748]">
                  Marcar como popular
                </label>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={handleCloseForm}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="w-full bg-[#4A5568] hover:bg-[#2D3748]"
                  onClick={(e) => {
                    e.preventDefault();
                    handleSubmit(e as unknown as React.FormEvent);
                  }}
                >
                  {modalMode === "create" ? "Guardar servicio" : "Guardar cambios"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Detail modal */}
      {detailService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-xl font-semibold text-[#2D3748]">Detalle del servicio</h3>
              <button
                onClick={() => setDetailService(null)}
                className="text-[#718096] hover:text-[#2D3748]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div className="flex items-start justify-between gap-3">
                <h4 className="text-2xl font-bold text-[#2D3748]">{detailService.name}</h4>
                {detailService.popular && (
                  <Badge className="bg-[#48BB78] text-white shrink-0">Popular</Badge>
                )}
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <Tag className="w-4 h-4 text-[#718096] mx-auto mb-1" />
                  <p className="text-xs text-[#718096]">Categoría</p>
                  <p className="text-sm font-semibold text-[#2D3748]">{detailService.category}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <Clock className="w-4 h-4 text-[#718096] mx-auto mb-1" />
                  <p className="text-xs text-[#718096]">Duración</p>
                  <p className="text-sm font-semibold text-[#2D3748]">{detailService.duration}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <DollarSign className="w-4 h-4 text-[#718096] mx-auto mb-1" />
                  <p className="text-xs text-[#718096]">Precio</p>
                  <p className="text-sm font-semibold text-[#2D3748]">{detailService.price}</p>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="w-4 h-4 text-[#718096]" />
                  <p className="text-sm font-medium text-[#2D3748]">Descripción</p>
                </div>
                <p className="text-sm text-[#4A5568] leading-relaxed">
                  {detailService.description}
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <Button variant="outline" className="flex-1" onClick={() => setDetailService(null)}>
                  Cerrar
                </Button>
                <Button
                  className="flex-1 bg-[#4A5568] hover:bg-[#2D3748]"
                  onClick={() => {
                    setDetailService(null);
                    openEdit(detailService);
                  }}
                >
                  Editar servicio
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Services;