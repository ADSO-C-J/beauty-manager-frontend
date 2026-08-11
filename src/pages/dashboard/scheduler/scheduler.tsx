import { useSchedulerPresenter } from "./useSchedulerPresenter";
import StylistSidebar from "./components/StylistSidebar";
import WeeklyView from "./components/WeeklyView";
import CreateAppointmentModal from "./components/CreateAppointmentModal";

export default function Scheduler() {
  const {
    stylists, selectedStylist, setSelectedStylist,
    weekDays, timeSlots, filteredAppointments,
    modalOpen, selectedSlot, loading,
    goToPrevWeek, goToNextWeek, goToToday,
    handleSlotClick,
    addAppointment, closeModal,
  } = useSchedulerPresenter();

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold text-[#2D3748]">Scheduler</h2>
        <p className="text-[#4A5568] mt-1">
          {selectedStylist
            ? `Agenda de ${selectedStylist.name}`
            : "Selecciona un estilista para ver su agenda"}
        </p>
      </div>

      <div className="flex gap-4">
        <StylistSidebar
          stylists={stylists}
          selectedStylist={selectedStylist}
          onSelect={setSelectedStylist}
        />

        {selectedStylist ? (
          loading ? (
            <div className="flex-1 flex items-center justify-center bg-white rounded-lg border border-gray-200 p-10">
              <p className="text-[#718096]">Cargando citas...</p>
            </div>
          ) : (
            <WeeklyView
              weekDays={weekDays}
              timeSlots={timeSlots}
              appointments={filteredAppointments}
              onSlotClick={handleSlotClick}
              onPrevWeek={goToPrevWeek}
              onNextWeek={goToNextWeek}
              onToday={goToToday}
            />
          )
        ) : (
          <div className="flex-1 flex items-center justify-center bg-white rounded-lg border border-dashed border-gray-300 p-10">
            <p className="text-[#718096]">Selecciona un estilista para ver su agenda semanal</p>
          </div>
        )}
      </div>

      <CreateAppointmentModal
        open={modalOpen}
        selectedSlot={selectedSlot}
        onClose={closeModal}
        onSave={addAppointment}
      />
    </div>
  );
}
