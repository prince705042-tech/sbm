import React, { useState } from 'react';
import { CampusBin, BuildingZone, WasteType } from '../types';
import { CAMPUS_ZONES } from '../data/campusData';
import { X, PlusCircle, Lock, ShieldCheck, ShieldAlert } from 'lucide-react';
import { motion } from 'motion/react';

interface AddBinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddBin: (bin: Omit<CampusBin, 'id' | 'reportedCount'>) => void;
  isAdmin: boolean;
  onRequestAdminLogin: () => void;
}

export const AddBinModal: React.FC<AddBinModalProps> = ({
  isOpen,
  onClose,
  onAddBin,
  isAdmin,
  onRequestAdminLogin,
}) => {
  const [name, setName] = useState('');
  const [locationName, setLocationName] = useState('');
  const [zone, setZone] = useState<BuildingZone>('sac-building');
  const [floor, setFloor] = useState('Just Outside Building (Outdoor)');
  const [landmark, setLandmark] = useState('');
  const [hasWet, setHasWet] = useState(true);
  const [hasDry, setHasDry] = useState(true);
  const [hasEwaste, setHasEwaste] = useState(false);
  const [capacityLiters, setCapacityLiters] = useState(100);

  if (!isOpen) return null;

  // If not logged in as Admin, show access gate
  if (!isAdmin) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-stone-900/60"
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2 }}
          className="relative z-10 bg-white rounded-lg max-w-md w-full p-6 sm:p-7 shadow-xl border border-stone-200 text-center"
        >
          <button
            id="btn-close-add-bin-gate"
            onClick={onClose}
            className="absolute top-4 right-4 w-7 h-7 rounded bg-stone-100 text-stone-500 hover:text-stone-900 hover:bg-stone-200 flex items-center justify-center transition-colors cursor-pointer border border-stone-200"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="w-12 h-12 rounded bg-amber-50 text-amber-800 border border-amber-200 flex items-center justify-center mx-auto mb-3.5">
            <Lock className="w-6 h-6" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-900 border border-amber-200 mb-2 font-mono-code">
            <ShieldAlert className="w-3 h-3 text-amber-700" />
            Administrative Clearance Required
          </div>

          <h3 className="text-xl font-bold text-stone-900 font-editorial">
            Station Registry Restricted
          </h3>
          <p className="text-xs text-stone-600 mt-2 leading-relaxed">
            Registering and commissioning new dustbin stations on the NIT Patna campus map is restricted to authorized estate management and Swachh Bharat Mission staff.
          </p>

          <div className="mt-6 flex flex-col sm:flex-row items-center gap-2">
            <motion.button
              whileTap={{ scale: 0.98 }}
              type="button"
              id="btn-cancel-add-bin-gate"
              onClick={onClose}
              className="w-full sm:w-1/2 py-2 rounded border border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100 text-xs font-medium transition-colors cursor-pointer"
            >
              Cancel
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.98 }}
              type="button"
              id="btn-login-to-add-bin"
              onClick={() => {
                onClose();
                onRequestAdminLogin();
              }}
              className="w-full sm:w-1/2 py-2 rounded bg-[#134E3A] hover:bg-[#0F3E2E] text-white text-xs font-semibold shadow-2xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Admin Authentication</span>
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    // Pick a coordinate inside the chosen zone
    const targetZone = CAMPUS_ZONES.find((z) => z.id === zone) || CAMPUS_ZONES[0];
    const coords = {
      x: targetZone.coords.x + targetZone.coords.width * 0.4 + (Math.random() * 4 - 2),
      y: targetZone.coords.y + targetZone.coords.height * 0.5 + (Math.random() * 4 - 2),
    };

    const types: WasteType[] = [];
    if (hasWet) types.push('wet');
    if (hasDry) types.push('dry');
    if (hasEwaste) types.push('e-waste');

    onAddBin({
      name: name.trim(),
      locationName: locationName.trim() || targetZone.name,
      zone,
      floor,
      landmark: landmark.trim() || 'Near entrance corridor',
      coords,
      types,
      fillLevel: Math.floor(Math.random() * 20) + 10,
      status: 'normal',
      lastEmptied: 'Just now',
      capacityLiters: Number(capacityLiters) || 100,
      hasDry,
      hasWet,
      hasEwaste,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-stone-900/60"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.2 }}
        className="relative z-10 bg-white rounded-lg max-w-lg w-full p-5 sm:p-6 shadow-xl border border-stone-200 overflow-hidden my-auto max-h-[92vh] flex flex-col"
      >
        <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-stone-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded bg-emerald-50 text-[#134E3A] border border-emerald-200 flex items-center justify-center shrink-0">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-stone-900 font-editorial">
                  Register Campus Dustbin Station
                </h3>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-900 border border-emerald-200 px-1.5 py-0.2 font-mono-code rounded">
                  <ShieldCheck className="w-2.5 h-2.5 text-[#134E3A]" />
                  Admin
                </span>
              </div>
              <p className="text-xs text-stone-500">
                Commission a newly installed sanitation unit into the campus GIS directory
              </p>
            </div>
          </div>
          <button
            id="btn-close-add-bin-form"
            onClick={onClose}
            className="w-7 h-7 rounded bg-stone-100 text-stone-500 hover:text-stone-900 hover:bg-stone-200 flex items-center justify-center cursor-pointer transition-colors shrink-0 border border-stone-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5 text-xs overflow-y-auto pr-1">
          <div>
            <label className="font-semibold text-stone-700 block mb-1">
              Station Identifier / Name:
            </label>
            <input
              id="input-bin-name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Block B Main Entrance Paired Station"
              className="w-full bg-stone-50 border border-stone-200 rounded px-3 py-2 text-xs font-medium text-stone-900 focus:outline-hidden focus:border-[#134E3A] focus:bg-white transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-stone-700 block mb-1">
                Campus Building / Zone:
              </label>
              <select
                id="select-bin-zone"
                value={zone}
                onChange={(e) => setZone(e.target.value as BuildingZone)}
                className="w-full bg-stone-50 border border-stone-200 rounded px-3 py-2 text-xs font-medium text-stone-900 focus:outline-hidden focus:border-[#134E3A] focus:bg-white transition-colors"
              >
                {CAMPUS_ZONES.map((z) => (
                  <option key={z.id} value={z.id}>
                    {z.shortName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-semibold text-stone-700 block mb-1">
                Placement Context:
              </label>
              <select
                id="select-bin-floor"
                value={floor}
                onChange={(e) => setFloor(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded px-3 py-2 text-xs font-medium text-stone-900 focus:outline-hidden focus:border-[#134E3A] focus:bg-white transition-colors"
              >
                <option value="Just Outside Building (Outdoor)">Just Outside Building (Outdoor) - Standard</option>
                <option value="Outdoor / Grounds">Outdoor / Lawn &amp; Walkway</option>
                <option value="Indoor (SAC Building Only)">Indoor (SAC Building Only)</option>
              </select>
            </div>
          </div>

          {/* Campus Placement Rule Note */}
          <div className="bg-stone-50 border border-stone-200 rounded p-2.5 text-[11px] text-stone-700 flex items-start gap-2">
            <span className="font-bold text-[#134E3A] shrink-0 font-mono-code">NOTICE:</span>
            <span>Campus standard mandates dual stations (Wet + Dry) positioned immediately exterior to entrances. SAC Building is the only approved indoor station facility.</span>
          </div>

          <div>
            <label className="font-semibold text-stone-700 block mb-1">
              Exact Landmark / Location Details:
            </label>
            <input
              id="input-bin-landmark"
              type="text"
              value={landmark}
              onChange={(e) => setLandmark(e.target.value)}
              placeholder="e.g. Next to Water Cooler portico, west entrance"
              className="w-full bg-stone-50 border border-stone-200 rounded px-3 py-2 text-xs font-medium text-stone-900 focus:outline-hidden focus:border-[#134E3A] focus:bg-white transition-colors"
            />
          </div>

          <div>
            <label className="font-semibold text-stone-700 block mb-1.5">
              Station Waste Streams:
            </label>
            <div className="grid grid-cols-3 gap-2">
              <label className={`p-2 rounded border flex items-center gap-2 cursor-pointer font-medium text-xs transition-colors ${
                hasWet ? 'border-[#134E3A] bg-emerald-50/60 text-stone-900 font-semibold' : 'border-stone-200 bg-stone-50 text-stone-600 hover:bg-stone-100'
              }`}>
                <input
                  id="checkbox-wet-waste"
                  type="checkbox"
                  checked={hasWet}
                  onChange={(e) => setHasWet(e.target.checked)}
                  className="rounded text-[#134E3A]"
                />
                <span>Wet Waste</span>
              </label>

              <label className={`p-2 rounded border flex items-center gap-2 cursor-pointer font-medium text-xs transition-colors ${
                hasDry ? 'border-sky-700 bg-sky-50/60 text-stone-900 font-semibold' : 'border-stone-200 bg-stone-50 text-stone-600 hover:bg-stone-100'
              }`}>
                <input
                  id="checkbox-dry-waste"
                  type="checkbox"
                  checked={hasDry}
                  onChange={(e) => setHasDry(e.target.checked)}
                  className="rounded text-sky-700"
                />
                <span>Dry Waste</span>
              </label>

              <label className={`p-2 rounded border flex items-center gap-2 cursor-pointer font-medium text-xs transition-colors ${
                hasEwaste ? 'border-stone-700 bg-stone-200/60 text-stone-900 font-semibold' : 'border-stone-200 bg-stone-50 text-stone-600 hover:bg-stone-100'
              }`}>
                <input
                  id="checkbox-ewaste"
                  type="checkbox"
                  checked={hasEwaste}
                  onChange={(e) => setHasEwaste(e.target.checked)}
                  className="rounded text-stone-800"
                />
                <span>E-Waste</span>
              </label>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-stone-100">
            <button
              id="btn-cancel-add-bin-form"
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs font-medium text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <motion.button
              whileTap={{ scale: 0.98 }}
              id="btn-submit-add-bin-form"
              type="submit"
              className="px-4 py-1.5 text-xs font-semibold text-white bg-[#134E3A] hover:bg-[#0F3E2E] rounded shadow-2xs flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Register Station</span>
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
