import React, { useState } from 'react';
import { CampusBin, BuildingZone, WasteType } from '../types';
import { CAMPUS_ZONES } from '../data/campusData';
import { X, PlusCircle, MapPin } from 'lucide-react';

interface AddBinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddBin: (bin: Omit<CampusBin, 'id' | 'reportedCount'>) => void;
}

export const AddBinModal: React.FC<AddBinModalProps> = ({
  isOpen,
  onClose,
  onAddBin,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 overflow-hidden relative">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 font-['Outfit',sans-serif]">
                Log a New Dustbin Location
              </h3>
              <p className="text-xs text-slate-500">
                Register a newly installed or missing dustbin on campus
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-slate-900 hover:bg-slate-200 flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1">
              Dustbin Station Name:
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Block B 2nd Floor Corridor Bin"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Campus Building / Zone:
              </label>
              <select
                value={zone}
                onChange={(e) => setZone(e.target.value as BuildingZone)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              >
                {CAMPUS_ZONES.map((z) => (
                  <option key={z.id} value={z.id}>
                    {z.shortName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Placement Location:
              </label>
              <select
                value={floor}
                onChange={(e) => setFloor(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              >
                <option value="Just Outside Building (Outdoor)">Just Outside Building (Outdoor) - Standard</option>
                <option value="Outdoor / Grounds">Outdoor / Lawn & Walkway</option>
                <option value="Indoor (SAC Building Only)">Indoor (SAC Building Only)</option>
              </select>
            </div>
          </div>

          {/* Campus Placement Rule Note */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-2.5 text-[11px] text-emerald-900 flex items-start gap-2">
            <span className="font-bold text-emerald-700 shrink-0">📍 Campus Rule:</span>
            <span>All dustbins on campus are paired together (Wet + Dry) <strong>strictly just outside buildings</strong>. Only the <strong>SAC Building</strong> has an indoor station.</span>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">
              Specific Landmark Description:
            </label>
            <input
              type="text"
              value={landmark}
              onChange={(e) => setLandmark(e.target.value)}
              placeholder="e.g. Next to Water Cooler and Room 204"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1.5">
              Compartments Available at this Spot:
            </label>
            <div className="grid grid-cols-3 gap-2">
              <label className={`p-2.5 rounded-xl border flex items-center gap-2 cursor-pointer font-bold ${
                hasWet ? 'border-emerald-500 bg-emerald-50 text-emerald-900' : 'border-slate-200 bg-slate-50 text-slate-600'
              }`}>
                <input
                  type="checkbox"
                  checked={hasWet}
                  onChange={(e) => setHasWet(e.target.checked)}
                  className="rounded text-emerald-600"
                />
                <span>🟢 Wet Waste</span>
              </label>

              <label className={`p-2.5 rounded-xl border flex items-center gap-2 cursor-pointer font-bold ${
                hasDry ? 'border-sky-500 bg-sky-50 text-sky-900' : 'border-slate-200 bg-slate-50 text-slate-600'
              }`}>
                <input
                  type="checkbox"
                  checked={hasDry}
                  onChange={(e) => setHasDry(e.target.checked)}
                  className="rounded text-sky-600"
                />
                <span>🔵 Dry Waste</span>
              </label>

              <label className={`p-2.5 rounded-xl border flex items-center gap-2 cursor-pointer font-bold ${
                hasEwaste ? 'border-slate-800 bg-slate-100 text-slate-900' : 'border-slate-200 bg-slate-50 text-slate-600'
              }`}>
                <input
                  type="checkbox"
                  checked={hasEwaste}
                  onChange={(e) => setHasEwaste(e.target.checked)}
                  className="rounded text-slate-800"
                />
                <span>⚡ E-Waste</span>
              </label>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md shadow-emerald-600/25 flex items-center gap-1.5"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Add to Campus Map</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
