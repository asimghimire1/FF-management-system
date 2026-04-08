// Auto-assign slots to registrations in first-come-first-served order
const autoAssignSlots = (registrations, maxSlots = 12) => {
  const assigned = registrations.slice(0, maxSlots).map((reg, index) => ({
    ...reg,
    slotNumber: index + 1,
  }));

  return assigned;
};

// Manual slot assignment - assign specific slot to a registration
const manualAssignSlot = (registration, slotNumber) => {
  return {
    ...registration,
    slotNumber,
  };
};

// Check if slot is available
const isSlotAvailable = (slotNumber, existingRegistrations) => {
  return !existingRegistrations.some(
    (reg) => reg.slotNumber === slotNumber && reg.status === "approved"
  );
};

// Get next available slot
const getNextAvailableSlot = (existingRegistrations, maxSlots = 12) => {
  for (let i = 1; i <= maxSlots; i++) {
    if (!existingRegistrations.some(
      (reg) => reg.slotNumber === i && reg.status === "approved"
    )) {
      return i;
    }
  }
  return null; // No slots available
};

module.exports = {
  autoAssignSlots,
  manualAssignSlot,
  isSlotAvailable,
  getNextAvailableSlot,
};
