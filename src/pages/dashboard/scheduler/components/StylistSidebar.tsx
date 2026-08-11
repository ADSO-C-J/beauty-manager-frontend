import { Avatar, AvatarFallback } from "@components/avatar";

type Stylist = {
  id: string;
  name: string;
  specialty?: string;
};
type StylistSidebarProps = {
  stylists: Stylist[];
  selectedStylist: Stylist | null;
  onSelect: (stylist: Stylist) => void;
};
export default function StylistSidebar({ stylists, selectedStylist, onSelect }: StylistSidebarProps) {
  return (
    <aside className="w-56 shrink-0 bg-white border-r border-gray-200 p-3 space-y-2">
      <h3 className="text-sm font-semibold text-[#2D3748] px-2">Estilistas</h3>
      {stylists.map((stylist) => {
        const isSelected = selectedStylist?.id === stylist.id;
        return (
          <button
            key={stylist.id}
            onClick={() => onSelect(stylist)}
            className={`w-full flex items-center gap-3 p-2.5 rounded-lg transition-colors text-left ${
              isSelected ? "bg-[#4A5568] text-white" : "hover:bg-[#F7FAFC]"
            }`}
          >
            <Avatar className="w-8 h-8">
              <AvatarFallback className={`${isSelected ? "bg-white text-[#4A5568]" : "bg-[#4A5568] text-white"} text-xs`}>
                {stylist.name.split(" ").map((n) => n[0]).join("").toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{stylist.name}</p>
              {stylist.specialty && (
                <p className={`text-xs truncate ${isSelected ? "text-gray-300" : "text-[#718096]"}`}>
                  {stylist.specialty}
                </p>
              )}
            </div>
          </button>
        );
      })}
    </aside>
  );
}