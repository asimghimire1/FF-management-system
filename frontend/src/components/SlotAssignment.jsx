import { useState } from "react";
import { Users } from "lucide-react";

// Props: { slots, onAssignSlot, loading }
// Example slots: [{ slotNumber, registration: { teamId, team: { name } } }, ...]
export default function SlotAssignment({ slots = [], onAssignSlot, loading = false }) {
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState(null);

  if (!slots || slots.length === 0) {
    return (
      <div className="card text-center text-gray-400 py-8">
        No slots data available
      </div>
    );
  }

  const handleAssign = () => {
    if (selectedSlot && selectedTeam) {
      onAssignSlot(selectedTeam.registration._id, selectedSlot);
      setSelectedSlot(null);
      setSelectedTeam(null);
    }
  };

  const emptySlots = slots.filter((s) => !s.registration);
  const filledSlots = slots.filter((s) => s.registration);

  return (
    <div className="card">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Users size={20} />
        Slot Management
      </h3>

      <div className="mb-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
        {slots.map((slot) => (
          <div
            key={slot.slotNumber}
            onClick={() => setSelectedTeam(slot)}
            className={`p-3 rounded border-2 transition cursor-pointer text-center ${
              slot.registration
                ? "border-green-600 bg-green-900 bg-opacity-20"
                : "border-gray-600 bg-gray-800 hover:border-gray-500"
            } ${
              selectedTeam?.slotNumber === slot.slotNumber
                ? "ring-2 ring-blue-500"
                : ""
            }`}
          >
            <div className="text-xs text-gray-400 font-semibold">
              SLOT {slot.slotNumber}
            </div>
            <div className="text-sm font-medium text-white mt-1 truncate">
              {slot.registration
                ? slot.registration.team?.name || "Team"
                : "Empty"}
            </div>
          </div>
        ))}
      </div>

      {selectedTeam?.registration && (
        <div className="bg-gray-700 rounded p-4 mb-4">
          <p className="text-sm text-gray-300">
            Selected: <span className="text-white font-semibold">{selectedTeam.registration.team?.name}</span>
          </p>
          <div className="mt-3 grid grid-cols-4 sm:grid-cols-6 gap-2">
            {emptySlots.map((slot) => (
              <button
                key={slot.slotNumber}
                onClick={() => setSelectedSlot(slot.slotNumber)}
                className={`p-2 rounded transition text-sm font-medium ${
                  selectedSlot === slot.slotNumber
                    ? "bg-blue-600 text-white"
                    : "bg-gray-600 text-gray-300 hover:bg-gray-500"
                }`}
              >
                Slot {slot.slotNumber}
              </button>
            ))}
          </div>
          <button
            onClick={handleAssign}
            className="btn-primary mt-3 w-full"
            disabled={!selectedSlot || loading}
          >
            {loading ? "Assigning..." : "Assign Slot"}
          </button>
        </div>
      )}

      <div className="text-sm text-gray-400">
        <p>Filled: {filledSlots.length} / {slots.length}</p>
      </div>
    </div>
  );
}
