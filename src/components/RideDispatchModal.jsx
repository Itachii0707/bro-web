import { useState, useRef } from 'react';
import { 
  X, Phone, Share2, AlertTriangle, ShieldCheck, Car, 
  MapPin, Clock, CheckCircle2, Route, ArrowRight, Sparkles 
} from 'lucide-react';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { playHapticClick, playSuccessChime } from '../utils/audioFeedback';

export default function RideDispatchModal({ routeInfo, carrier, onClose }) {
  const modalRef = useRef(null);
  useFocusTrap(modalRef, Boolean(carrier), onClose);

  const [callInitiated, setCallInitiated] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);

  const origin = routeInfo?.from || 'Koramangala 4th Block';
  const dest = routeInfo?.to || 'Kempegowda International Airport (BLR)';
  const distance = routeInfo?.distanceKm || 38.4;
  const duration = routeInfo?.durationMinutes || 45;
  const fare = carrier?.fare || 355;
  const carrierName = carrier?.platform?.name || 'Rapido';

  const handleCopyShare = () => {
    playSuccessChime();
    navigator.clipboard?.writeText?.(
      `Tracking my ride on BRO AI: Riding with Ramesh Kumar (White Hyundai Aura, KA 01 MJ 8421) from ${origin} to ${dest}. ETA: ${duration} mins.`
    );
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-150">
      
      {/* Modal Dialog Card */}
      <div 
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-label="Live Dispatch Telemetry"
        className="bg-[#FAFAFA] rounded-2xl border border-[#EBEBF0] shadow-2xl max-w-xl w-full max-h-[92vh] overflow-y-auto relative text-[#333333]"
      >
        
        {/* Floating Close Button */}
        <button
          onClick={() => {
            playHapticClick();
            onClose();
          }}
          data-autofocus
          aria-label="Close dispatch modal"
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-white border border-[#EBEBF0] flex items-center justify-center text-[#666666] hover:text-[#333333] hover:bg-[#F8F9FA] transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-[#008738]"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Live Dispatch Header */}
        <div className="p-6 border-b border-[#EBEBF0] bg-white rounded-t-2xl">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-[#008738] animate-ping" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#008738]">
              Live Dispatch Telemetry · Feed #KA-84920
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#333333]">
            Driver En Route to Pickup
          </h2>
          <p className="text-xs text-[#666666] mt-0.5">
            Arriving in ~4 mins (0.8 km away) • Sony World Signal, Koramangala
          </p>
        </div>

        <div className="p-6 space-y-6">
          
          {/* Driver & Vehicle Dossier (High Trust Card) */}
          <div className="bg-white border border-[#EBEBF0] rounded-xl p-5 shadow-sm space-y-4">
            
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#333333] text-[#b59a50] flex items-center justify-center font-bold text-sm tracking-wider shadow-sm">
                  RK
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold text-[#333333]">Ramesh Kumar</span>
                    <CheckCircle2 className="w-4 h-4 text-[#008738]" />
                  </div>
                  <span className="text-xs text-[#666666]">
                    4.9 ★ (8,410 verified trips) • 7 Yrs Partner
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-semibold text-[#666666] block uppercase tracking-wider">
                  Vehicle
                </span>
                <span className="text-xs font-bold text-[#333333] block">White Hyundai Aura</span>
                <span className="text-[11px] font-mono font-bold bg-[#F8F9FA] px-2 py-0.5 rounded border border-[#EBEBF0] text-[#333333] inline-block mt-0.5">
                  KA 01 MJ 8421
                </span>
              </div>
            </div>

            {/* Tactical Cryptographic START OTP Plaque */}
            <div className="bg-[#FFF8D9] border border-[#B59A50]/40 rounded-xl p-3.5 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#856404] block">
                  Secure Boarding Pin
                </span>
                <span className="text-xs text-[#666666]">Share with driver only after boarding</span>
              </div>
              <div className="px-4 py-1.5 bg-[#333333] text-[#b59a50] font-mono font-bold text-lg rounded-lg shadow-sm tracking-widest">
                OTP: 4892
              </div>
            </div>

          </div>

          {/* Route Visualizer Module */}
          <div className="bg-white border border-[#EBEBF0] rounded-xl p-4 shadow-sm text-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#9E9E9E] block mb-2">
              Route Telemetry
            </span>

            <div className="space-y-3">
              <div className="flex items-start gap-2.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#008738] mt-1 flex-shrink-0" />
                <div>
                  <span className="font-semibold text-[#333333] block">{origin}</span>
                  <span className="text-[#9E9E9E] text-[11px]">80ft Road, Sony World Signal Hub</span>
                </div>
              </div>

              <div className="pl-1 border-l-2 border-dashed border-[#EBEBF0] ml-1 my-1 py-1 text-[11px] text-[#666666] flex items-center justify-between">
                <span>{distance} km via OSRM Airport Toll Expressway</span>
                <span className="font-mono text-[#333333] font-semibold">~{duration} min drive</span>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#333333] mt-1 flex-shrink-0" />
                <div>
                  <span className="font-semibold text-[#333333] block">{dest}</span>
                  <span className="text-[#9E9E9E] text-[11px]">Terminal 2 Departures Curb</span>
                </div>
              </div>
            </div>
          </div>

          {/* Multi-Carrier Parity & Arbitrage */}
          <div className="bg-white border border-[#EBEBF0] rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-[#333333]">Tariff Parity Benchmark</span>
              <span className="text-[11px] font-bold text-[#008738] bg-[#F3FBEF] px-2 py-0.5 rounded-full border border-[#008738]/20">
                Saved ₹63 vs nearest competitor
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
              <div className="p-2.5 rounded-lg bg-[#F3FBEF] border border-[#008738]/30">
                <span className="text-[10px] text-[#008738] font-bold block">{carrierName}</span>
                <span className="text-base font-bold text-[#008738]">₹{fare}</span>
                <span className="text-[9px] text-[#008738] block">Locked Fare</span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#F8F9FA] border border-[#EBEBF0] opacity-80">
                <span className="text-[10px] text-[#666666] block">Ola Prime</span>
                <span className="text-sm font-semibold text-[#333333]">₹397</span>
                <span className="text-[9px] text-[#9E9E9E] block">+₹42 peak</span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#F8F9FA] border border-[#EBEBF0] opacity-80">
                <span className="text-[10px] text-[#666666] block">Uber Go</span>
                <span className="text-sm font-semibold text-[#333333]">₹418</span>
                <span className="text-[9px] text-[#9E9E9E] block">+₹63 surge</span>
              </div>
            </div>

            {/* Zero Commission Banner */}
            <div className="mt-3 pt-3 border-t border-[#F8F9FA] text-[11px] text-[#666666] flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#008738] flex-shrink-0" />
              <span>
                <strong>Fair Transit Protocol:</strong> 100% of driver fare goes directly to Ramesh Kumar. 0% platform deductions.
              </span>
            </div>
          </div>

          {/* Action Buttons Tier */}
          <div className="space-y-2">
            <button
              onClick={() => {
                playHapticClick();
                setCallInitiated(true);
              }}
              className="w-full py-2.5 bg-[#333333] hover:bg-[#111111] text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-[#008738]"
            >
              <Phone className="w-3.5 h-3.5 text-[#b59a50]" />
              <span>{callInitiated ? 'Connecting via Masked Audio Relay...' : 'Call Driver (Masked VoIP Relay)'}</span>
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleCopyShare}
                className="py-2 bg-white hover:bg-[#F8F9FA] border border-[#EBEBF0] text-[#333333] text-xs font-medium rounded-lg flex items-center justify-center gap-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-[#008738]"
              >
                <Share2 className="w-3.5 h-3.5 text-[#666666]" />
                <span>{shareCopied ? 'Trip Info Copied!' : 'Share Live Trip'}</span>
              </button>

              <button
                onClick={() => {
                  playHapticClick();
                  onClose();
                }}
                className="py-2 bg-white hover:bg-[#FEF2F2] border border-[#EBEBF0] text-[#DC2626] text-xs font-medium rounded-lg flex items-center justify-center gap-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-red-400"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-[#DC2626]" />
                <span>Cancel Ride (Free for 2m)</span>
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
