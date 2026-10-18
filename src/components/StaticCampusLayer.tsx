import React from 'react';
import { BuildingZone } from '../types';

interface StaticCampusLayerProps {
  showLabels: boolean;
  onZoneSelect: (zone: BuildingZone) => void;
}

export const StaticCampusLayer: React.FC<StaticCampusLayerProps> = React.memo(({ showLabels, onZoneSelect }) => {
  const handleZoneSelect = onZoneSelect;

  return (
    <>
              <defs>
                {/* Ganga River Gradient */}
                <linearGradient id="gangaRiverGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#1e3a8a" />
                  <stop offset="35%" stopColor="#0284c7" />
                  <stop offset="85%" stopColor="#0ea5e9" />
                  <stop offset="100%" stopColor="#38bdf8" />
                </linearGradient>

                {/* Campus Greenery Gradient */}
                <linearGradient id="campusLawnGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#166534" />
                  <stop offset="50%" stopColor="#15803d" />
                  <stop offset="100%" stopColor="#14532d" />
                </linearGradient>

                {/* Athletic Turf Gradient */}
                <radialGradient id="playgroundTurf" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#22c55e" />
                  <stop offset="60%" stopColor="#16a34a" />
                  <stop offset="100%" stopColor="#15803d" />
                </radialGradient>

                {/* Parking Bay Pattern */}
                <pattern id="parkingLines" width="20" height="14" patternUnits="userSpaceOnUse">
                  <line x1="0" y1="0" x2="0" y2="14" stroke="#94a3b8" strokeWidth="1" strokeDasharray="3 2" />
                  <rect x="2" y="2" width="16" height="10" rx="2" fill="#334155" opacity="0.7" />
                  {/* Car windshields */}
                  <rect x="5" y="4" width="4" height="6" rx="1" fill="#64748b" opacity="0.6" />
                </pattern>

                {/* Tree Symbol */}
                <g id="campusTree">
                  <circle cx="0" cy="0" r="10" fill="#14532d" opacity="0.8" />
                  <circle cx="0" cy="0" r="8.5" fill="#15803d" />
                  <circle cx="-2.5" cy="-2.5" r="4.5" fill="#22c55e" />
                  <circle cx="1.5" cy="1.5" r="2.5" fill="#166534" />
                </g>

                {/* Palm Tree Symbol */}
                <g id="palmTree">
                  <circle cx="0" cy="0" r="4" fill="#78350f" />
                  <path d="M0,0 Q-8,-10 -15,-6 Q-5,-4 0,0" fill="#15803d" />
                  <path d="M0,0 Q-3,-14 0,-18 Q3,-14 0,0" fill="#22c55e" />
                  <path d="M0,0 Q8,-10 15,-6 Q5,-4 0,0" fill="#15803d" />
                  <path d="M0,0 Q12,-3 16,5 Q8,2 0,0" fill="#16a34a" />
                  <path d="M0,0 Q-12,-3 -16,5 Q-8,2 0,0" fill="#16a34a" />
                </g>

                {/* River Wave Ripple */}
                <g id="riverWave">
                  <path d="M0,0 Q10,-3 20,0 T40,0" stroke="#bae6fd" strokeWidth="1.5" fill="none" opacity="0.6" />
                </g>

                {/* Traditional Boat */}
                <g id="gangaBoat">
                  <path d="M0,0 L18,0 L14,5 L4,5 Z" fill="#78350f" stroke="#451a03" strokeWidth="0.8" />
                  <line x1="9" y1="0" x2="9" y2="-8" stroke="#d97706" strokeWidth="1" />
                  <polygon points="9,-8 15,-4 9,-1" fill="#fef08a" opacity="0.9" />
                </g>

                
              </defs>

              {/* ======================================================== */}
              {/* 1. SURROUNDING GEOGRAPHY: GANGA RIVER & ASHOK RAJPATH     */}
              {/* ======================================================== */}

              {/* Base Canvas */}
              <rect width="720" height="1040" fill="#1e293b" />

              {/* Ganga River (West side, x: 0 to 125) */}
              <rect x="0" y="0" width="125" height="1040" fill="url(#gangaRiverGrad)" />

              {/* River Animated/Static Waves & Details */}
              <use href="#riverWave" x="20" y="80" />
              <use href="#riverWave" x="50" y="160" />
              <use href="#riverWave" x="15" y="280" />
              <use href="#riverWave" x="65" y="380" />
              <use href="#riverWave" x="25" y="510" />
              <use href="#riverWave" x="60" y="660" />
              <use href="#riverWave" x="20" y="820" />
              <use href="#riverWave" x="55" y="940" />

              {/* Boats on Ganga River */}
              <use href="#gangaBoat" x="45" y="230" />
              <use href="#gangaBoat" x="70" y="550" />
              <use href="#gangaBoat" x="35" y="880" />

              {/* Ganga River Label (vertical) */}
              <g transform="translate(32, 430) rotate(-90)">
                <text fill="#ffffff" textAnchor="middle" className="text-[15px] font-black tracking-widest drop-shadow-md">
                  Ganga River  ~~~
                </text>
              </g>


              {/* Gandhi Ghat Promenade & River Stairs (Middle West) */}
              <g 
                id="zone-gandhighat"
                onClick={() => handleZoneSelect('gandhi-ghat')}
                className="cursor-pointer transition-transform hover:opacity-95"
              >
                <rect x="105" y="440" width="28" height="420" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1" />
                {/* Ghat Stairs */}
                {Array.from({ length: 18 }).map((_, i) => (
                  <line key={i} x1="105" y1={450 + i * 22} x2="133" y2={450 + i * 22} stroke="#64748b" strokeWidth="1" />
                ))}
                <g transform="translate(118, 680) rotate(-90)">
                  <g>
                    <rect x="-42" y="-8.5" width="84" height="20" rx="5" fill="#000000" opacity="0.35" />
                    <rect x="-42" y="-10" width="84" height="20" rx="5" fill="#f8fafc" stroke="#64748b" strokeWidth="1" />
                    <text x="0" y="4" fill="#0f172a" textAnchor="middle" className="text-[10px] font-extrabold">
                      Gandhi Ghat
                    </text>
                  </g>
                </g>
              </g>

              {/* Ashok Rajpath (South Wide Highway across entire bottom) */}
              <g id="ashok-rajpath-road">
                <rect x="0" y="930" width="720" height="110" fill="#334155" stroke="#1e293b" strokeWidth="2" />
                {/* White dividing barrier and lane lines */}
                <line x1="0" y1="980" x2="720" y2="980" stroke="#f8fafc" strokeWidth="2.5" strokeDasharray="12 8" />
                {/* Road crossings */}
                <rect x="330" y="930" width="80" height="110" fill="#334155" />
                {Array.from({ length: 8 }).map((_, i) => (
                  <rect key={i} x={340 + i * 8} y="940" width="4" height="22" fill="#f8fafc" opacity="0.8" />
                ))}
                {/* Street trees along Ashok Rajpath */}
                {Array.from({ length: 12 }).map((_, i) => (
                  <use key={i} href="#campusTree" x={60 + i * 55} y="930" />
                ))}
                {/* Ashok Rajpath Label */}
                <g>
                    <rect x="310" y="996.5" width="120" height="24" rx="6" fill="#000000" opacity="0.35" />
                    <rect x="310" y="995" width="120" height="24" rx="6" fill="#0f172a" stroke="#475569" strokeWidth="1" />
                  <text x="370" y="1012" fill="#ffffff" textAnchor="middle" className="text-[12px] font-black tracking-wider">
                    Ashok Rajpath
                  </text>
                </g>
              </g>

              {/* ======================================================== */}
              {/* 2. CAMPUS BOUNDARY & GREEN GROUNDS                       */}
              {/* ======================================================== */}

              {/* Campus Grounds polygon */}
              <polygon
                points="132,80 695,80 695,920 132,920"
                fill="url(#campusLawnGrad)"
                stroke="#0f172a"
                strokeWidth="2"
              />

              {/* RED BOUNDARY WALL (as shown in map legend) */}
              <polyline
                points="132,80 695,80 695,850 685,850 685,920 132,920 132,80"
                fill="none"
                stroke="#dc2626"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* ======================================================== */}
              {/* 3. ROADS NETWORK                                         */}
              {/* ======================================================== */}

              {/* Common Road (horizontal beneath hostels) */}
              <rect x="135" y="130" width="555" height="24" fill="#64748b" stroke="#334155" strokeWidth="1.5" />
              <line x1="140" y1="142" x2="685" y2="142" stroke="#ffffff" strokeWidth="1.5" strokeDasharray="8 6" />
              <g>
                    <rect x="350" y="134.5" width="90" height="18" rx="4" fill="#000000" opacity="0.35" />
                    <rect x="350" y="133" width="90" height="18" rx="4" fill="#1e293b" opacity="0.85" />
                <text x="395" y="146" fill="#ffffff" textAnchor="middle" className="text-[10px] font-bold">
                  Common Road
                </text>
              </g>

              {/* Main Vertical Spine Road (Clear 28px central roadway flanked by sidewalks) */}
              <rect x="330" y="154" width="28" height="690" fill="#64748b" stroke="#334155" strokeWidth="1.5" />
              {/* White dashed center line */}
              <line x1="344" y1="154" x2="344" y2="844" stroke="#ffffff" strokeWidth="1.5" strokeDasharray="8 6" />

              {/* Concrete sidewalks with curb along both sides of Central Spine Road */}
              <line x1="329" y1="154" x2="329" y2="844" stroke="#94a3b8" strokeWidth="1.5" />
              <line x1="359" y1="154" x2="359" y2="844" stroke="#94a3b8" strokeWidth="1.5" />

              {/* Zebra Crosswalk between Main Building & Central Library */}
              <g id="crosswalk-main-library" opacity="0.85">
                <rect x="331" y="546" width="26" height="3" fill="#f8fafc" />
                <rect x="331" y="552" width="26" height="3" fill="#f8fafc" />
                <rect x="331" y="558" width="26" height="3" fill="#f8fafc" />
                <rect x="331" y="564" width="26" height="3" fill="#f8fafc" />
              </g>

              {/* Crosswalk between Nano Building & CSE Dept */}
              <g id="crosswalk-nano-cse" opacity="0.85">
                <rect x="331" y="196" width="26" height="3" fill="#f8fafc" />
                <rect x="331" y="202" width="26" height="3" fill="#f8fafc" />
                <rect x="331" y="208" width="26" height="3" fill="#f8fafc" />
              </g>

              {/* Road to Amphitheatre & Sports Pavilion */}
              <rect x="358" y="344" width="190" height="22" fill="#64748b" stroke="#334155" strokeWidth="1" />
              <line x1="358" y1="355" x2="548" y2="355" stroke="#ffffff" strokeWidth="1.5" strokeDasharray="6 4" />
              <g>
                <rect x="395" y="348" width="120" height="14" rx="3" fill="#1e293b" opacity="0.9" />
                <text x="455" y="358.5" fill="#f8fafc" textAnchor="middle" className="text-[7.5px] font-bold tracking-wide">
                  Road to Amphitheatre ➔
                </text>
              </g>
              <rect x="548" y="344" width="22" height="164" fill="#64748b" stroke="#334155" strokeWidth="1" />
              <rect x="358" y="494" width="212" height="22" fill="#64748b" stroke="#334155" strokeWidth="1" />

              {/* Crosswalk between Alaknanda Bhawan and Road to Amphitheatre */}
              <g id="crosswalk-alaknanda-amphi" opacity="0.85">
                <rect x="331" y="346" width="26" height="3" fill="#f8fafc" />
                <rect x="331" y="352" width="26" height="3" fill="#f8fafc" />
                <rect x="331" y="358" width="26" height="3" fill="#f8fafc" />
                <rect x="331" y="364" width="26" height="3" fill="#f8fafc" />
              </g>

              {/* Road to I.T. Lab & Civil Dept (Connecting from Main Central Spine Road to I.T. Lab) */}
              <rect x="218" y="432" width="113" height="22" fill="#64748b" stroke="#334155" strokeWidth="1" />
              <line x1="220" y1="443" x2="330" y2="443" stroke="#ffffff" strokeWidth="1.5" strokeDasharray="6 4" />
              <line x1="220" y1="432" x2="329" y2="432" stroke="#94a3b8" strokeWidth="1" />
              <line x1="220" y1="454" x2="329" y2="454" stroke="#94a3b8" strokeWidth="1" />
              <g>
                <rect x="228" y="436.5" width="94" height="13" rx="3" fill="#1e293b" opacity="0.9" />
                <text x="275" y="446" fill="#f8fafc" textAnchor="middle" className="text-[7px] font-bold tracking-wide">
                  Road to I.T. Lab ➔
                </text>
              </g>

              {/* Crosswalk on Main Road at I.T. Lab Road Junction */}
              <g id="crosswalk-itlab-main" opacity="0.85">
                <rect x="331" y="434" width="26" height="3" fill="#f8fafc" />
                <rect x="331" y="440" width="26" height="3" fill="#f8fafc" />
                <rect x="331" y="446" width="26" height="3" fill="#f8fafc" />
                <rect x="331" y="452" width="26" height="3" fill="#f8fafc" />
              </g>

              {/* Road leading to Parking */}
              <rect x="150" y="630" width="180" height="22" fill="#64748b" stroke="#334155" strokeWidth="1" />
              <line x1="150" y1="641" x2="330" y2="641" stroke="#ffffff" strokeWidth="1" strokeDasharray="6 4" />

              {/* Road leading towards southern boundary */}
              <rect x="330" y="830" width="28" height="85" fill="#64748b" stroke="#334155" strokeWidth="1.5" />
              <line x1="344" y1="830" x2="344" y2="915" stroke="#ffffff" strokeWidth="1.5" strokeDasharray="6 4" />

              {/* ======================================================== */}
              {/* 4. CAMPUS BUILDINGS & STRUCTURES                         */}
              {/* ======================================================== */}

              {/* 1. Hostels (Pink/Coral Toned Blocks) */}

              {/* Brahmaputra Hostel (Top Right) */}
              <g 
                id="zone-brahmaputra"
                onClick={() => handleZoneSelect('brahmaputra-hostel')}
                className="cursor-pointer transition-transform hover:opacity-95"
              >
                <rect x="420" y="10" width="115" height="52" rx="4" fill="#fda4af" stroke="#e11d48" strokeWidth="2" />
                <rect x="428" y="16" width="99" height="16" rx="2" fill="#f43f5e" opacity="0.3" />
                {showLabels && (
                  <g>
                    <rect x="428" y="21.5" width="100" height="19" rx="4" fill="#000000" opacity="0.35" />
                    <rect x="428" y="20" width="100" height="19" rx="4" fill="#1e40af" />
                    <text x="478" y="33" fill="#ffffff" textAnchor="middle" className="text-[9px] font-black">
                      Brahmaputra Hostel
                    </text>
                  </g>
                )}
              </g>

              {/* Kosi Hostel (Interchanged to West side along Common Road) */}
              <g 
                id="zone-kosi"
                onClick={() => handleZoneSelect('kosi-hostel')}
                className="cursor-pointer transition-transform hover:opacity-95"
              >
                <rect x="280" y="64" width="180" height="60" rx="5" fill="#fff1f2" stroke="#e11d48" strokeWidth="2.5" />
                <rect x="290" y="72" width="160" height="14" rx="2" fill="#fda4af" stroke="#f43f5e" strokeWidth="1" />
                <rect x="290" y="94" width="160" height="14" rx="2" fill="#fda4af" stroke="#f43f5e" strokeWidth="1" />
                <rect x="340" y="86" width="60" height="14" rx="2" fill="#16a34a" stroke="#15803d" strokeWidth="1" />
                {showLabels && (
                  <g>
                    <rect x="318" y="81.5" width="105" height="20" rx="4" fill="#000000" opacity="0.35" />
                    <rect x="318" y="80" width="105" height="20" rx="4" fill="#1e40af" stroke="#60a5fa" strokeWidth="1" />
                    <text x="370" y="94" fill="#ffffff" textAnchor="middle" className="text-[10px] font-black tracking-wide">
                      Kosi Hostel
                    </text>
                  </g>
                )}
              </g>

              {/* Connecting Courtyard Walkway between Kosi & Bhagmati */}
              <rect x="460" y="78" width="15" height="32" rx="2" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1" />

              {/* Bhagmati Hostel (Interchanged to East side along Common Road) */}
              <g 
                id="zone-bhagmati"
                onClick={() => handleZoneSelect('bhagmati-hostel')}
                className="cursor-pointer transition-transform hover:opacity-95"
              >
                <rect x="475" y="64" width="180" height="60" rx="5" fill="#ffe4e6" stroke="#e11d48" strokeWidth="2" />
                <rect x="485" y="72" width="160" height="14" rx="2" fill="#f43f5e" opacity="0.25" />
                <rect x="485" y="94" width="160" height="14" rx="2" fill="#f43f5e" opacity="0.25" />
                {showLabels && (
                  <g>
                    <rect x="512" y="81.5" width="105" height="20" rx="4" fill="#000000" opacity="0.35" />
                    <rect x="512" y="80" width="105" height="20" rx="4" fill="#1e40af" />
                    <text x="564" y="94" fill="#ffffff" textAnchor="middle" className="text-[10px] font-black">
                      Bhagmati Hostel
                    </text>
                  </g>
                )}
              </g>

              {/* Ganga Girls Hostel (West edge by river, rectangular block situated behind Alak Nanda Bhawan) */}
              <g 
                id="zone-gangagirls"
                onClick={() => handleZoneSelect('ganga-girls-hostel')}
                className="cursor-pointer transition-transform hover:opacity-95"
              >
                {/* Rectangular Hostel Block */}
                <rect x="142" y="168" width="94" height="106" rx="4" fill="#fbcfe8" stroke="#db2777" strokeWidth="2" />
                {/* Roof terrace pavilion */}
                <rect x="148" y="174" width="82" height="16" rx="2" fill="#ec4899" opacity="0.3" />
                {/* Inner courtyard / light well */}
                <rect x="156" y="202" width="66" height="42" rx="3" fill="#f472b6" opacity="0.25" />
                {/* Architectural balcony / floor lines */}
                <line x1="148" y1="254" x2="230" y2="254" stroke="#db2777" strokeWidth="1" strokeDasharray="4 3" />
                <line x1="148" y1="262" x2="230" y2="262" stroke="#db2777" strokeWidth="1" strokeDasharray="4 3" />
                {showLabels && (
                  <g>
                    <rect x="146" y="210.5" width="86" height="26" rx="4" fill="#000000" opacity="0.35" />
                    <rect x="146" y="209" width="86" height="26" rx="4" fill="#1e40af" />
                    <text x="189" y="221" fill="#ffffff" textAnchor="middle" className="text-[9px] font-black">
                      Ganga Girls Hostel
                    </text>
                    <text x="189" y="231" fill="#93c5fd" textAnchor="middle" className="text-[7.5px] font-bold">
                      Girls Residence
                    </text>
                  </g>
                )}
              </g>

              {/* Nano Building (Health Centre) - Made thinner */}
              <g 
                id="zone-nano"
                onClick={() => handleZoneSelect('nano-building')}
                className="cursor-pointer transition-transform hover:opacity-95"
              >
                <rect x="242" y="168" width="40" height="64" rx="4" fill="#fef3c7" stroke="#d97706" strokeWidth="2" />
                <rect x="246" y="174" width="32" height="12" rx="2" fill="#b45309" opacity="0.25" />
                {/* South exit pathway */}
                <rect x="256" y="230" width="12" height="6" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="0.8" />
                {showLabels && (
                  <g>
                    <rect x="238" y="185.5" width="48" height="27" rx="3" fill="#000000" opacity="0.35" />
                    <rect x="238" y="184" width="48" height="27" rx="3" fill="#1e40af" />
                    <text x="262" y="196" fill="#ffffff" textAnchor="middle" className="text-[7.5px] font-black">
                      Nano Bldg
                    </text>
                    <text x="262" y="206" fill="#93c5fd" textAnchor="middle" className="text-[6.5px] font-bold">
                      (Health)
                    </text>
                  </g>
                )}
              </g>

              {/* Pathway between Nano Building & CSE Dept */}
              <rect x="282" y="168" width="4" height="64" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="0.5" />

              {/* CSE DEPARTMENT - Same size as Nano Building, situated right beside it */}
              <g 
                id="zone-cse"
                onClick={() => handleZoneSelect('cse-dept')}
                className="cursor-pointer transition-transform hover:opacity-95"
              >
                <rect x="286" y="168" width="40" height="64" rx="4" fill="#dbeafe" stroke="#2563eb" strokeWidth="2" />
                <rect x="290" y="174" width="32" height="12" rx="2" fill="#1d4ed8" opacity="0.25" />
                {/* Computing lab / server bays */}
                <line x1="290" y1="216" x2="322" y2="216" stroke="#2563eb" strokeWidth="0.8" strokeDasharray="3 2" />
                {/* Portico steps opening onto Central Spine Road sidewalk */}
                <rect x="322" y="192" width="6" height="16" rx="1" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1" />
                {showLabels && (
                  <g>
                    <rect x="282" y="185.5" width="48" height="27" rx="3" fill="#000000" opacity="0.35" />
                    <rect x="282" y="184" width="48" height="27" rx="3" fill="#1e40af" />
                    <text x="306" y="196" fill="#ffffff" textAnchor="middle" className="text-[7.5px] font-black">
                      CSE DEPT
                    </text>
                    <text x="306" y="206" fill="#93c5fd" textAnchor="middle" className="text-[6.5px] font-bold">
                      (Tech Labs)
                    </text>
                  </g>
                )}
              </g>

              {/* BIG GAP: Open Green Campus Lawn & Pathway behind Central Workshop & Alak Nanda */}
              <g id="gap-nano-alaknanda">
                {/* Green quad lawn extending behind Central Workshop */}
                <rect x="140" y="278" width="184" height="10" fill="#15803d" opacity="0.35" />
                <rect x="240" y="234" width="84" height="54" rx="4" fill="#15803d" opacity="0.35" />
                {/* Connecting paved walkway from Nano Building down to Central Workshop */}
                <rect x="260" y="232" width="14" height="58" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="0.8" />
                {/* Connecting walkway from Ganga Girls Hostel south entrance */}
                <rect x="182" y="274" width="14" height="66" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="0.8" />
                {/* Cross-walkway between Ganga Girls and Nano Building */}
                <rect x="236" y="200" width="14" height="12" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="0.8" />
                {/* Campus decorative trees in the green quad */}
                <use href="#campusTree" x="295" y="258" />
                <use href="#campusTree" x="162" y="296" />
              </g>

              {/* CENTRAL WORKSHOP (Fabrication Labs) - Situated directly after/behind Alak Nanda Bhawan, slightly thicker block */}
              <g 
                id="zone-workshop"
                onClick={() => handleZoneSelect('central-workshop')}
                className="cursor-pointer transition-transform hover:opacity-95"
              >
                {/* Slightly thicker rectangular building body (44px height vs Alaknanda 28px) */}
                <rect x="196" y="290" width="128" height="44" rx="3" fill="#fca5a5" stroke="#dc2626" strokeWidth="2" />
                {/* Industrial sawtooth / pitched roof ridge lines */}
                <line x1="198" y1="302" x2="322" y2="302" stroke="#b91c1c" strokeWidth="1.2" strokeDasharray="6 3" />
                <line x1="198" y1="316" x2="322" y2="316" stroke="#b91c1c" strokeWidth="1.2" strokeDasharray="6 3" />
                <line x1="198" y1="328" x2="322" y2="328" stroke="#b91c1c" strokeWidth="1.2" strokeDasharray="6 3" />
                {/* Workshop structural bay dividers */}
                {Array.from({ length: 8 }).map((_, i) => (
                  <line
                    key={i}
                    x1={208 + i * 14}
                    y1="292"
                    x2={208 + i * 14}
                    y2="332"
                    stroke="#b91c1c"
                    strokeWidth="0.8"
                    opacity="0.35"
                  />
                ))}
                {/* Connecting breezeway / corridor to Alak Nanda Bhawan */}
                <rect x="252" y="334" width="16" height="8" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1" />
                {showLabels && (
                  <g>
                    <rect x="206" y="303.5" width="108" height="25" rx="4" fill="#000000" opacity="0.35" />
                    <rect x="206" y="302" width="108" height="25" rx="4" fill="#1e40af" />
                    <text x="260" y="314" fill="#ffffff" textAnchor="middle" className="text-[8.5px] font-black tracking-wide">
                      CENTRAL WORKSHOP
                    </text>
                    <text x="260" y="323" fill="#93c5fd" textAnchor="middle" className="text-[7px] font-bold">
                      Fabrication &amp; Labs Block
                    </text>
                  </g>
                )}
              </g>

              {/* ALAK NANDA BHAWAN - Thin rectangular building situated directly in front of the road going to Amphitheatre */}
              <g 
                id="zone-alaknanda"
                onClick={() => handleZoneSelect('alaknanda-bhawan')}
                className="cursor-pointer transition-transform hover:opacity-95"
              >
                {/* Thin rectangular building body */}
                <rect x="196" y="342" width="128" height="28" rx="3" fill="#f43f5e" stroke="#be123c" strokeWidth="2" />
                {/* Metallic central roof ridge line as seen in aerial photo */}
                <line x1="198" y1="356" x2="322" y2="356" stroke="#991b1b" strokeWidth="1.5" />
                <line x1="198" y1="356" x2="322" y2="356" stroke="#fecdd3" strokeWidth="0.8" opacity="0.9" />
                {/* Modular room / window bays along the thin rectangle */}
                {Array.from({ length: 8 }).map((_, i) => (
                  <line
                    key={i}
                    x1={208 + i * 14}
                    y1="344"
                    x2={208 + i * 14}
                    y2="368"
                    stroke="#991b1b"
                    strokeWidth="0.8"
                    opacity="0.4"
                  />
                ))}
                {/* Front entrance porch facing the Road to Amphitheatre */}
                <rect x="320" y="348" width="8" height="16" rx="1" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1" />
                {showLabels && (
                  <g>
                    <rect x="208" y="344.5" width="104" height="23" rx="4" fill="#000000" opacity="0.35" />
                    <rect x="208" y="343" width="104" height="23" rx="4" fill="#1e40af" />
                    <text x="260" y="358" fill="#ffffff" textAnchor="middle" className="text-[8.5px] font-black tracking-wide">
                      ALAK NANDA BHAWAN
                    </text>
                  </g>
                )}
              </g>

              {/* ATTACHED EAST ACADEMIC & CULTURAL COMPLEX: ECE DEPT + AUDITORIUM + CWRS (Conjoined Blocks, Shifted Down) */}
              
              {/* Foundation shadows */}
              <rect x="364" y="176" width="80" height="106" rx="4" fill="#0f172a" opacity="0.12" />
              <rect x="442" y="186" width="96" height="84" rx="4" fill="#0f172a" opacity="0.12" />
              <rect x="550" y="186" width="90" height="84" rx="4" fill="#0f172a" opacity="0.12" />

              {/* 1. ECE DEPARTMENT - Made longer (height 102 along Central Spine Road) and thinner (width 78, not thick) */}
              <g 
                id="zone-ece"
                onClick={() => handleZoneSelect('ece-dept')}
                className="cursor-pointer transition-transform hover:opacity-95"
              >
                {/* Elongated rectangular department block */}
                <rect x="366" y="178" width="78" height="102" rx="3" fill="#fef3c7" stroke="#d97706" strokeWidth="2" />
                {/* Microelectronics & VLSI wing (North wing) */}
                <rect x="372" y="184" width="66" height="14" rx="2" fill="#d97706" opacity="0.25" />
                {/* Portico steps opening onto Central Spine Road sidewalk */}
                <rect x="359" y="218" width="7" height="24" rx="1" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1" />
                {/* Interior courtyard garden */}
                <rect x="374" y="246" width="28" height="26" rx="2" fill="#15803d" />
                <use href="#campusTree" x="388" y="259" />
                {/* Electronics & Signal Processing research laboratory bays */}
                <line x1="406" y1="248" x2="438" y2="248" stroke="#d97706" strokeWidth="1" strokeDasharray="3 2" opacity="0.6" />
                <line x1="406" y1="256" x2="438" y2="256" stroke="#d97706" strokeWidth="1" strokeDasharray="3 2" opacity="0.6" />
                <line x1="406" y1="264" x2="438" y2="264" stroke="#d97706" strokeWidth="1" strokeDasharray="3 2" opacity="0.6" />
                {showLabels && (
                  <g>
                    <rect x="372" y="213.5" width="66" height="24" rx="3" fill="#000000" opacity="0.35" />
                    <rect x="372" y="212" width="66" height="24" rx="3" fill="#1e40af" />
                    <text x="405" y="223" fill="#ffffff" textAnchor="middle" className="text-[7.5px] font-black">
                      ECE DEPT
                    </text>
                    <text x="405" y="232" fill="#93c5fd" textAnchor="middle" className="text-[6.5px] font-bold">
                      (Electronics)
                    </text>
                  </g>
                )}
              </g>

              {/* Shared Architectural Joint Seam / Interconnected Corridor (ECE & Auditorium Attached) */}
              <rect x="442" y="194" width="4" height="68" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="0.8" />
              <line x1="444" y1="188" x2="444" y2="268" stroke="#475569" strokeWidth="1.5" strokeDasharray="3 2" />

              {/* 2. MAIN AUDITORIUM (Convocation Hall) - Attached to ECE on west, with gap to CWRS on east */}
              <g 
                id="zone-audi"
                onClick={() => handleZoneSelect('auditorium-cwrs')}
                className="cursor-pointer transition-transform hover:opacity-95"
              >
                <rect x="444" y="188" width="92" height="80" rx="3" fill="#e0e7ff" stroke="#4338ca" strokeWidth="2" />
                {/* Raised stage / backstage block */}
                <rect x="457" y="194" width="66" height="16" rx="2" fill="#3730a3" opacity="0.25" />
                {/* Tiered auditorium seating rows */}
                <line x1="458" y1="222" x2="522" y2="222" stroke="#4338ca" strokeWidth="1" strokeDasharray="4 2" />
                <line x1="458" y1="230" x2="522" y2="230" stroke="#4338ca" strokeWidth="1" strokeDasharray="4 2" />
                {/* South grand entrance portico facing lawn */}
                <rect x="475" y="268" width="30" height="6" rx="1" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1" />
                {showLabels && (
                  <g>
                    <rect x="453" y="214.5" width="74" height="25" rx="4" fill="#000000" opacity="0.35" />
                    <rect x="453" y="213" width="74" height="25" rx="4" fill="#1e40af" />
                    <text x="490" y="225" fill="#ffffff" textAnchor="middle" className="text-[8.5px] font-black">
                      AUDITORIUM
                    </text>
                    <text x="490" y="234" fill="#93c5fd" textAnchor="middle" className="text-[7px] font-bold">
                      Convocation Hall
                    </text>
                  </g>
                )}
              </g>

              {/* GAP BETWEEN AUDITORIUM AND CWRS (Landscaped Access Pathway & Walkway) */}
              <rect x="536" y="188" width="16" height="80" rx="2" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="0.8" />
              <line x1="544" y1="188" x2="544" y2="268" stroke="#94a3b8" strokeWidth="1" strokeDasharray="4 3" />

              {/* 3. CWRS BUILDING (Centre for Water Resources Studies) - Separated by gap beside Auditorium */}
              <g 
                id="zone-cwrs"
                onClick={() => handleZoneSelect('cwrs-building')}
                className="cursor-pointer transition-transform hover:opacity-95"
              >
                <rect x="552" y="188" width="86" height="80" rx="4" fill="#e0f2fe" stroke="#0284c7" strokeWidth="2" />
                {/* Water resources & hydrology testing wing */}
                <rect x="562" y="194" width="66" height="16" rx="2" fill="#0369a1" opacity="0.25" />
                {/* Research laboratory channels */}
                <line x1="563" y1="222" x2="627" y2="222" stroke="#0284c7" strokeWidth="1" strokeDasharray="4 2" />
                <line x1="563" y1="230" x2="627" y2="230" stroke="#0284c7" strokeWidth="1" strokeDasharray="4 2" />
                {/* South entrance portico */}
                <rect x="580" y="268" width="30" height="6" rx="1" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1" />
                {showLabels && (
                  <g>
                    <rect x="558" y="214.5" width="74" height="25" rx="4" fill="#000000" opacity="0.35" />
                    <rect x="558" y="213" width="74" height="25" rx="4" fill="#1e40af" />
                    <text x="595" y="225" fill="#ffffff" textAnchor="middle" className="text-[8.5px] font-black">
                      CWRS BUILDING
                    </text>
                    <text x="595" y="234" fill="#93c5fd" textAnchor="middle" className="text-[7px] font-bold">
                      Water Studies
                    </text>
                  </g>
                )}
              </g>

              {/* AMPHITHEATRE (OAT - Open Air Theatre) - Positioned in green quad, cleanly separated from road */}
              <g 
                id="zone-amphi"
                onClick={() => handleZoneSelect('amphitheatre')}
                className="cursor-pointer transition-transform hover:opacity-95"
              >
                {/* Amphitheatre seating tier semicircle */}
                <path
                  d="M451,286 A39,32 0 0,0 529,286 Z"
                  fill="#bbf7d0"
                  stroke="#16a34a"
                  strokeWidth="2"
                />
                {/* Stepped concentric seating tiers */}
                <path d="M459,286 A31,25 0 0,0 521,286" fill="none" stroke="#15803d" strokeWidth="1.5" />
                <path d="M467,286 A23,18 0 0,0 513,286" fill="none" stroke="#15803d" strokeWidth="1.5" />
                <path d="M475,286 A15,11 0 0,0 505,286" fill="none" stroke="#15803d" strokeWidth="1.5" />
                {/* Central circular performance stage */}
                <circle cx="490" cy="286" r="7" fill="#86efac" stroke="#15803d" strokeWidth="1.2" />

                {showLabels && (
                  <g>
                    <rect x="452" y="295.5" width="76" height="18" rx="4" fill="#000000" opacity="0.35" />
                    <rect x="452" y="294" width="76" height="18" rx="4" fill="#1e40af" />
                    <text x="490" y="306.5" fill="#ffffff" textAnchor="middle" className="text-[8px] font-black tracking-wider">
                      AMPHITHEATRE
                    </text>
                  </g>
                )}
              </g>

              {/* Approach walkway connecting Road to Amphitheatre (clean separation from road at y=344) */}
              <rect x="483" y="318" width="14" height="26" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="0.8" />
              {/* Green buffer lawn trees between Amphitheatre and Road */}
              <use href="#campusTree" x="446" y="328" />
              <use href="#campusTree" x="534" y="328" />

              {/* Alak Nanda Green Quad / Open Lawn (North of I.T. Lab) */}
              <g id="zone-north-quad" className="opacity-95">
                <rect x="146" y="370" width="74" height="38" rx="4" fill="#15803d" fillOpacity="0.18" stroke="#15803d" strokeWidth="1.2" strokeDasharray="4 3" />
                {/* Connecting walkway from Alak Nanda south porch down towards I.T. Lab */}
                <rect x="176" y="364" width="12" height="50" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="0.8" />
                <use href="#campusTree" x="160" y="388" />
                <use href="#campusTree" x="206" y="388" />
                <text x="183" y="401" fill="#166534" textAnchor="middle" className="text-[7.5px] font-bold tracking-wide">
                  Open Quad Lawn
                </text>
              </g>

              {/* Basketball Court */}
              <g 
                id="zone-basketball"
                onClick={() => handleZoneSelect('basketball-court')}
                className="cursor-pointer transition-transform hover:opacity-95"
              >
                <rect x="236" y="374" width="64" height="52" rx="4" fill="#0284c7" stroke="#0369a1" strokeWidth="2" />
                {/* Court Orange Key Lines */}
                <rect x="242" y="378" width="52" height="44" fill="#f97316" stroke="#ffffff" strokeWidth="1.2" />
                <circle cx="268" cy="400" r="8" fill="none" stroke="#ffffff" strokeWidth="1.2" />
                <line x1="242" y1="400" x2="294" y2="400" stroke="#ffffff" strokeWidth="1.2" />
                {/* Hoops */}
                <circle cx="268" cy="382" r="2.2" fill="#ffffff" />
                <circle cx="268" cy="418" r="2.2" fill="#ffffff" />
                {showLabels && (
                  <g>
                    <rect x="244" y="392.5" width="48" height="25" rx="4" fill="#000000" opacity="0.35" />
                    <rect x="244" y="391" width="48" height="25" rx="4" fill="#1e40af" />
                    <text x="268" y="403" fill="#ffffff" textAnchor="middle" className="text-[8px] font-black">
                      Basketball
                    </text>
                    <text x="268" y="412" fill="#ffffff" textAnchor="middle" className="text-[7px] font-black">
                      Court
                    </text>
                  </g>
                )}
              </g>

              {/* I.T. Lab (Enlarged Building Body with Clear Gap to Civil Dept) */}
              <g 
                id="zone-itlab"
                onClick={() => handleZoneSelect('it-lab')}
                className="cursor-pointer transition-transform hover:opacity-95"
              >
                {/* Building Main Body - Enlarged to width 74, height 60 */}
                <rect x="146" y="412" width="74" height="60" rx="4" fill="#fed7aa" stroke="#ea580c" strokeWidth="2" />
                {/* Lab architectural bays and window lines */}
                <line x1="150" y1="426" x2="216" y2="426" stroke="#c2410c" strokeWidth="0.8" strokeDasharray="4 2" opacity="0.6" />
                <line x1="150" y1="444" x2="216" y2="444" stroke="#c2410c" strokeWidth="0.8" strokeDasharray="4 2" opacity="0.6" />
                <line x1="150" y1="462" x2="216" y2="462" stroke="#c2410c" strokeWidth="0.8" strokeDasharray="4 2" opacity="0.6" />
                {/* East Portico Steps Opening directly onto Road to I.T. Lab */}
                <rect x="218" y="433" width="7" height="20" rx="1.5" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1" />
                {showLabels && (
                  <g>
                    <rect x="153" y="429.5" width="60" height="27" rx="4" fill="#000000" opacity="0.35" />
                    <rect x="153" y="428" width="60" height="27" rx="4" fill="#1e40af" stroke="#60a5fa" strokeWidth="0.8" />
                    <text x="183" y="441" fill="#ffffff" textAnchor="middle" className="text-[10px] font-black">
                      I.T. Lab
                    </text>
                    <text x="183" y="451" fill="#93c5fd" textAnchor="middle" className="text-[7.5px] font-bold">
                      Tech &amp; Computing
                    </text>
                  </g>
                )}
              </g>

              {/* Departmental Green Quad / Clear Gap Between I.T. Lab & Civil Dept */}
              <g id="gap-itlab-civil" className="opacity-95">
                <rect x="146" y="474" width="74" height="22" rx="3" fill="#15803d" fillOpacity="0.16" stroke="#15803d" strokeWidth="0.8" strokeDasharray="3 2" />
                {/* Paved inter-departmental connecting walkway */}
                <rect x="176" y="472" width="14" height="26" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="0.8" />
                {/* Landscaped shade trees in the gap */}
                <use href="#campusTree" x="158" y="485" />
                <use href="#campusTree" x="208" y="485" />
              </g>

              {/* Campus Garden Lawn (South of Road to I.T. Lab, North of Main Building) */}
              <g id="zone-mainbldg-north-garden" className="opacity-95">
                <rect x="224" y="458" width="94" height="52" rx="4" fill="#16a34a" fillOpacity="0.16" stroke="#15803d" strokeWidth="1.2" strokeDasharray="4 3" />
                <rect x="242" y="472" width="60" height="4" rx="1.5" fill="#94a3b8" />
                <rect x="242" y="494" width="60" height="4" rx="1.5" fill="#94a3b8" />
                <use href="#campusTree" x="238" y="484" />
                <use href="#campusTree" x="306" y="484" />
                <text x="272" y="486" fill="#166534" textAnchor="middle" className="text-[7.5px] font-bold tracking-wide">
                  Campus Garden Lawn
                </text>
              </g>

              {/* PLAY GROUND (Center Athletic Grounds) */}
              <g 
                id="zone-playground"
                onClick={() => handleZoneSelect('play-ground')}
                className="cursor-pointer transition-transform hover:opacity-95"
              >
                <rect x="360" y="374" width="134" height="120" rx="8" fill="url(#playgroundTurf)" stroke="#15803d" strokeWidth="2" />
                {/* Running track oval */}
                <ellipse cx="427" cy="434" rx="55" ry="46" fill="none" stroke="#86efac" strokeWidth="1.5" strokeDasharray="4 3" />
                {/* Cricket Pitch in center */}
                <rect x="422" y="420" width="10" height="28" fill="#d97706" rx="2" />
                {showLabels && (
                  <g>
                    <rect x="397" y="425.5" width="60" height="24" rx="4" fill="#000000" opacity="0.35" />
                    <rect x="397" y="424" width="60" height="24" rx="4" fill="#1e40af" />
                    <text x="427" y="437" fill="#ffffff" textAnchor="middle" className="text-[9px] font-black">
                      PLAY
                    </text>
                    <text x="427" y="445" fill="#ffffff" textAnchor="middle" className="text-[8px] font-black">
                      GROUND
                    </text>
                  </g>
                )}
              </g>

              {/* SAC BUILDING */}
              <g 
                id="zone-sac"
                onClick={() => handleZoneSelect('sac-building')}
                className="cursor-pointer transition-transform hover:opacity-95"
              >
                <rect x="515" y="380" width="70" height="88" rx="5" fill="#fef3c7" stroke="#d97706" strokeWidth="2" />
                {showLabels && (
                  <g>
                    <rect x="522" y="409.5" width="56" height="28" rx="4" fill="#000000" opacity="0.35" />
                    <rect x="522" y="408" width="56" height="28" rx="4" fill="#1e40af" />
                    <text x="550" y="422" fill="#ffffff" textAnchor="middle" className="text-[9px] font-black">
                      SAC
                    </text>
                    <text x="550" y="432" fill="#ffffff" textAnchor="middle" className="text-[8px] font-black">
                      BUILDING
                    </text>
                  </g>
                )}
              </g>

              {/* Main Gate (Internal) - The Campus Main Gate */}
              <g 
                id="zone-maingate-internal"
                onClick={() => handleZoneSelect('main-gate-internal')}
                className="cursor-pointer transition-transform hover:opacity-95"
              >
                <rect x="515" y="472" width="70" height="24" rx="4" fill="#dbeafe" stroke="#2563eb" strokeWidth="2" />
                {/* Gate Pillars & Checkpoint */}
                <rect x="517" y="474" width="6" height="20" rx="1" fill="#1e3a8a" />
                <rect x="577" y="474" width="6" height="20" rx="1" fill="#1e3a8a" />
                <line x1="523" y1="484" x2="577" y2="484" stroke="#ef4444" strokeWidth="2" strokeDasharray="5 3" />
                {showLabels && (
                  <g>
                    <rect x="502" y="474.5" width="96" height="22" rx="4" fill="#000000" opacity="0.35" />
                    <rect x="502" y="473" width="96" height="22" rx="4" fill="#1e3a8a" stroke="#60a5fa" strokeWidth="1" />
                    <text x="550" y="488" fill="#ffffff" textAnchor="middle" className="text-[8.5px] font-black">
                      Main Gate (Internal)
                    </text>
                  </g>
                )}
              </g>

              {/* Civil Dept. */}
              <g 
                id="zone-civil"
                onClick={() => handleZoneSelect('civil-dept')}
                className="cursor-pointer transition-transform hover:opacity-95"
              >
                <rect x="152" y="498" width="64" height="88" rx="4" fill="#fed7aa" stroke="#ea580c" strokeWidth="2" />
                {showLabels && (
                  <g>
                    <rect x="158" y="525.5" width="52" height="26" rx="4" fill="#000000" opacity="0.35" />
                    <rect x="158" y="524" width="52" height="26" rx="4" fill="#1e40af" />
                    <text x="184" y="538" fill="#ffffff" textAnchor="middle" className="text-[9px] font-black">
                      Civil
                    </text>
                    <text x="184" y="547" fill="#ffffff" textAnchor="middle" className="text-[8.5px] font-black">
                      Dept.
                    </text>
                  </g>
                )}
              </g>

              {/* Main Building (Historic colonnade & plaza) - West of central road */}
              <g 
                id="zone-mainbuilding"
                onClick={() => handleZoneSelect('main-building')}
                className="cursor-pointer transition-transform hover:opacity-95"
              >
                <rect x="222" y="514" width="100" height="84" rx="5" fill="#fef3c7" stroke="#b45309" strokeWidth="2.5" />
                {/* Colonnade / Porch Entrance pathway leading east toward central road */}
                <rect x="316" y="546" width="14" height="20" rx="1" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1" />
                {/* Front Portico & Fountain Lawn */}
                <circle cx="272" cy="574" r="13" fill="#0284c7" stroke="#38bdf8" strokeWidth="1.5" />
                <circle cx="272" cy="574" r="4.5" fill="#ffffff" />
                {/* Surrounding palm trees */}
                <use href="#palmTree" x="248" y="574" />
                <use href="#palmTree" x="296" y="574" />
                {showLabels && (
                  <g>
                    <rect x="238" y="535.5" width="68" height="22" rx="4" fill="#000000" opacity="0.35" />
                    <rect x="238" y="534" width="68" height="22" rx="4" fill="#1e40af" />
                    <text x="272" y="549" fill="#ffffff" textAnchor="middle" className="text-[9.5px] font-black">
                      Main Building
                    </text>
                  </g>
                )}
              </g>

              {/* Central Library (with prominent dome) - East of central road */}
              <g 
                id="zone-library"
                onClick={() => handleZoneSelect('central-library')}
                className="cursor-pointer transition-transform hover:opacity-95"
              >
                <rect x="372" y="516" width="104" height="88" rx="5" fill="#fef3c7" stroke="#b45309" strokeWidth="2.5" />
                {/* Entrance path from central road sidewalk */}
                <rect x="358" y="550" width="16" height="18" rx="1" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1" />
                {/* Circular Dome */}
                <circle cx="424" cy="528" r="12" fill="#d97706" stroke="#78350f" strokeWidth="1.5" />
                {showLabels && (
                  <g>
                    <rect x="391" y="541.5" width="66" height="26" rx="4" fill="#000000" opacity="0.35" />
                    <rect x="391" y="540" width="66" height="26" rx="4" fill="#1e40af" />
                    <text x="424" y="553" fill="#ffffff" textAnchor="middle" className="text-[9px] font-black">
                      Central
                    </text>
                    <text x="424" y="562" fill="#ffffff" textAnchor="middle" className="text-[9px] font-black">
                      Library
                    </text>
                  </g>
                )}
              </g>

              {/* Indian Bank (ATM) */}
              <g 
                id="zone-bank"
                onClick={() => handleZoneSelect('indian-bank-atm')}
                className="cursor-pointer transition-transform hover:opacity-95"
              >
                <rect x="488" y="532" width="50" height="58" rx="4" fill="#e0f2fe" stroke="#0284c7" strokeWidth="2" />
                {showLabels && (
                  <g>
                    <rect x="490" y="545.5" width="46" height="26" rx="4" fill="#000000" opacity="0.35" />
                    <rect x="490" y="544" width="46" height="26" rx="4" fill="#1e40af" />
                    <text x="513" y="555" fill="#ffffff" textAnchor="middle" className="text-[7.5px] font-black">
                      Indian Bank
                    </text>
                    <text x="513" y="566" fill="#93c5fd" textAnchor="middle" className="text-[7.5px] font-bold">
                      (ATM)
                    </text>
                  </g>
                )}
              </g>

              {/* Cafeteria */}
              <g 
                id="zone-cafeteria"
                onClick={() => handleZoneSelect('cafeteria')}
                className="cursor-pointer transition-transform hover:opacity-95"
              >
                <rect x="548" y="516" width="70" height="102" rx="4" fill="#ffe4e6" stroke="#f43f5e" strokeWidth="2" />
                {showLabels && (
                  <g>
                    <rect x="558" y="551.5" width="50" height="20" rx="4" fill="#000000" opacity="0.35" />
                    <rect x="558" y="550" width="50" height="20" rx="4" fill="#1e40af" />
                    <text x="583" y="564" fill="#ffffff" textAnchor="middle" className="text-[9px] font-black">
                      Cafeteria
                    </text>
                  </g>
                )}
              </g>

              {/* Stationery */}
              <g 
                id="zone-stationery"
                onClick={() => handleZoneSelect('stationery')}
                className="cursor-pointer transition-transform hover:opacity-95"
              >
                <rect x="376" y="622" width="96" height="58" rx="4" fill="#e0f2fe" stroke="#0284c7" strokeWidth="2" />
                {showLabels && (
                  <g>
                    <rect x="394" y="640.5" width="60" height="20" rx="4" fill="#000000" opacity="0.35" />
                    <rect x="394" y="639" width="60" height="20" rx="4" fill="#1e40af" />
                    <text x="424" y="653" fill="#ffffff" textAnchor="middle" className="text-[9.5px] font-black">
                      Stationery
                    </text>
                  </g>
                )}
              </g>

              {/* Shop 2 */}
              <g 
                id="zone-shop2"
                onClick={() => handleZoneSelect('shop-2')}
                className="cursor-pointer transition-transform hover:opacity-95"
              >
                <rect x="548" y="632" width="70" height="58" rx="4" fill="#dcfce7" stroke="#16a34a" strokeWidth="2" />
                {showLabels && (
                  <g>
                    <rect x="561" y="649.5" width="44" height="20" rx="4" fill="#000000" opacity="0.35" />
                    <rect x="561" y="648" width="44" height="20" rx="4" fill="#1e40af" />
                    <text x="583" y="662" fill="#ffffff" textAnchor="middle" className="text-[9.5px] font-black">
                      Shop 2
                    </text>
                  </g>
                )}
              </g>

              {/* Parking area (Large unified parking lot on west, clear of central road) */}
              <g 
                id="zone-parking"
                onClick={() => handleZoneSelect('parking-area')}
                className="cursor-pointer transition-transform hover:opacity-95"
              >
                <rect x="142" y="658" width="180" height="182" rx="6" fill="#1e293b" stroke="#475569" strokeWidth="2" />
                {/* Parking lot bays pattern */}
                <rect x="148" y="666" width="168" height="166" fill="url(#parkingLines)" />
                {/* Tree avenues */}
                <use href="#campusTree" x="175" y="700" />
                <use href="#campusTree" x="175" y="750" />
                <use href="#campusTree" x="175" y="800" />
                <use href="#campusTree" x="235" y="700" />
                <use href="#campusTree" x="235" y="750" />
                <use href="#campusTree" x="235" y="800" />
                {showLabels && (
                  <g>
                    <rect x="196" y="729.5" width="72" height="24" rx="4" fill="#000000" opacity="0.35" />
                    <rect x="196" y="728" width="72" height="24" rx="4" fill="#1e40af" />
                    <text x="232" y="744" fill="#ffffff" textAnchor="middle" className="text-[10px] font-black">
                      Parking area
                    </text>
                  </g>
                )}
              </g>

              {/* Pathway connecting Central Road sidewalk to Physics & Chemistry Lab */}
              <rect x="358" y="732" width="18" height="16" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1" />
              <rect x="358" y="812" width="18" height="16" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1" />

              {/* Paved Avenue between Chemistry Lab and Kosi Ext */}
              <rect x="520" y="705" width="18" height="188" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1" />
              <line x1="529" y1="710" x2="529" y2="888" stroke="#94a3b8" strokeWidth="1" strokeDasharray="6 4" />

              {/* INCUBATION CENTRE (formerly Physics Department) */}
              <g 
                id="zone-physics"
                onClick={() => handleZoneSelect('physics-dept')}
                className="cursor-pointer transition-transform hover:opacity-95"
              >
                <rect x="376" y="708" width="144" height="64" rx="4" fill="#fed7aa" stroke="#ea580c" strokeWidth="2" />
                <rect x="384" y="715" width="128" height="12" rx="2" fill="#c2410c" opacity="0.25" />
                {showLabels && (
                  <g>
                    <rect x="396" y="725.5" width="104" height="26" rx="4" fill="#000000" opacity="0.35" />
                    <rect x="396" y="724" width="104" height="26" rx="4" fill="#1e40af" />
                    <text x="448" y="736" fill="#ffffff" textAnchor="middle" className="text-[9px] font-black">
                      INCUBATION
                    </text>
                    <text x="448" y="746" fill="#ffffff" textAnchor="middle" className="text-[8.5px] font-black">
                      CENTRE
                    </text>
                  </g>
                )}
              </g>

              {/* CHEMISTRY DEPARTMENT (LAB) - Situated beside Kosi Ext */}
              <g 
                id="zone-chem"
                onClick={() => handleZoneSelect('chemistry-dept')}
                className="cursor-pointer transition-transform hover:opacity-95"
              >
                <rect x="376" y="784" width="144" height="74" rx="4" fill="#fed7aa" stroke="#ea580c" strokeWidth="2" />
                <rect x="384" y="791" width="128" height="12" rx="2" fill="#c2410c" opacity="0.25" />
                {/* Chemistry Lab benches & fume vents representation */}
                <circle cx="396" cy="840" r="4" fill="#ea580c" opacity="0.3" />
                <circle cx="410" cy="840" r="4" fill="#ea580c" opacity="0.3" />
                <circle cx="486" cy="840" r="4" fill="#ea580c" opacity="0.3" />
                <circle cx="500" cy="840" r="4" fill="#ea580c" opacity="0.3" />
                {showLabels && (
                  <g>
                    <rect x="392" y="801.5" width="112" height="32" rx="4" fill="#000000" opacity="0.35" />
                    <rect x="392" y="800" width="112" height="32" rx="4" fill="#1e40af" stroke="#60a5fa" strokeWidth="1" />
                    <text x="448" y="813" fill="#ffffff" textAnchor="middle" className="text-[9px] font-black">
                      CHEMISTRY LAB
                    </text>
                    <text x="448" y="825" fill="#93c5fd" textAnchor="middle" className="text-[7.5px] font-bold">
                      Beside Kosi Ext ➔
                    </text>
                  </g>
                )}
              </g>

              {/* KOSI EXTENSION HOSTEL (Residential Block beside Chemistry Lab) */}
              <g 
                id="zone-kosi-ext"
                onClick={() => handleZoneSelect('kosi-ext')}
                className="cursor-pointer transition-transform hover:opacity-95"
              >
                {/* Main Hostel structural block */}
                <rect x="540" y="706" width="144" height="186" rx="6" fill="#fff1f2" stroke="#e11d48" strokeWidth="2.5" />

                {/* North Residential Wing */}
                <rect x="546" y="712" width="132" height="24" rx="3" fill="#fda4af" stroke="#f43f5e" strokeWidth="1" />
                {/* East Residential Wing along eastern boundary */}
                <rect x="642" y="736" width="36" height="122" rx="3" fill="#fda4af" stroke="#f43f5e" strokeWidth="1" />
                {/* West Living & Entrance Wing facing Chemistry Lab */}
                <rect x="546" y="736" width="36" height="122" rx="3" fill="#fda4af" stroke="#f43f5e" strokeWidth="1" />
                {/* South Wing along boundary wall */}
                <rect x="546" y="858" width="132" height="28" rx="3" fill="#fecdd3" stroke="#f43f5e" strokeWidth="1" />

                {/* Inner Quadrangle & Hostel Lawn */}
                <rect x="584" y="738" width="56" height="118" rx="4" fill="#16a34a" stroke="#15803d" strokeWidth="1" />
                {/* Quadrangle walkways & trees */}
                <line x1="612" y1="738" x2="612" y2="856" stroke="#e2e8f0" strokeWidth="1.5" strokeDasharray="3 2" />
                <line x1="584" y1="797" x2="640" y2="797" stroke="#e2e8f0" strokeWidth="1.5" strokeDasharray="3 2" />
                <use href="#campusTree" x="597" y="765" />
                <use href="#campusTree" x="625" y="825" />

                {/* Entrance Porch Gate facing West Avenue */}
                <rect x="540" y="784" width="8" height="24" rx="2" fill="#1e3a8a" />

                {showLabels && (
                  <>
                    <g>
                    <rect x="548" y="716.5" width="128" height="22" rx="4" fill="#000000" opacity="0.35" />
                    <rect x="548" y="715" width="128" height="22" rx="4" fill="#be123c" stroke="#fecdd3" strokeWidth="1" />
                      <text x="612" y="730" fill="#ffffff" textAnchor="middle" className="text-[9.5px] font-black tracking-wide">
                        KOSI EXTENSION
                      </text>
                    </g>
                    <g>
                    <rect x="550" y="829.5" width="124" height="24" rx="4" fill="#000000" opacity="0.35" />
                    <rect x="550" y="828" width="124" height="24" rx="4" fill="#1e3a8a" stroke="#60a5fa" strokeWidth="1" />
                      <text x="612" y="841" fill="#ffffff" textAnchor="middle" className="text-[8.5px] font-black">
                        KOSI EXT HOSTEL
                      </text>
                      <text x="612" y="850" fill="#93c5fd" textAnchor="middle" className="text-[7px] font-bold">
                        Student Residential Wing
                      </text>
                    </g>
                  </>
                )}
              </g>

              {/* Eastern Campus Boundary Wall (Running alongside Kosi Ext & Chem Lab) */}
              <g id="east-campus-boundary-wall">
                {/* Brick Boundary Wall Structure along East Edge */}
                <rect x="686" y="700" width="12" height="224" rx="2" fill="#b91c1c" stroke="#7f1d1d" strokeWidth="1.5" />
                {/* Boundary Wall pillars */}
                {Array.from({ length: 7 }).map((_, i) => (
                  <rect key={i} x="684" y={710 + i * 32} width="16" height="6" rx="1.5" fill="#7f1d1d" />
                ))}
                {showLabels && (
                  <g transform="translate(685, 785) rotate(90)">
                    <rect x="-42" y="-10.5" width="84" height="18" rx="3" fill="#000000" opacity="0.35" />
                    <rect x="-42" y="-12" width="84" height="18" rx="3" fill="#991b1b" stroke="#fca5a5" strokeWidth="1" />
                    <text x="0" y="0" fill="#ffffff" textAnchor="middle" className="text-[7.5px] font-black tracking-widest">
                      BOUNDARY WALL
                    </text>
                  </g>
                )}
              </g>

              {/* Campus Southern Boundary Wall along Ashok Rajpath */}
              <g id="ashok-rajpath-boundary-wall">
                {/* Brick/Stone Boundary Wall Structure */}
                <rect x="132" y="912" width="554" height="14" fill="#b91c1c" stroke="#7f1d1d" strokeWidth="1.5" />
                {/* Boundary Wall pillars at intervals */}
                {Array.from({ length: 14 }).map((_, i) => (
                  <rect key={i} x={140 + i * 40} y="908" width="8" height="22" rx="1.5" fill="#7f1d1d" />
                ))}
                {showLabels && (
                  <>
                    <g>
                    <rect x="250" y="889.5" width="100" height="18" rx="4" fill="#000000" opacity="0.35" />
                    <rect x="250" y="888" width="100" height="18" rx="4" fill="#991b1b" stroke="#fca5a5" strokeWidth="1" />
                      <text x="300" y="900" fill="#ffffff" textAnchor="middle" className="text-[8px] font-extrabold tracking-wider">
                        Boundary Wall
                      </text>
                    </g>
                  </>
                )}
              </g>

              {/* ======================================================== */}
              {/* 5. OFFICIAL NIT PATNA HEADER BADGE & LEGEND             */}
              {/* ======================================================== */}

              {/* Top Right: NIT PATNA Seal & Compass */}
              <g transform="translate(540, 10)">
                    <rect x="0" y="1.5" width="168" height="56" rx="8" fill="#000000" opacity="0.35" />
                    <rect x="0" y="0" width="168" height="56" rx="8" fill="#1e3a8a" stroke="#60a5fa" strokeWidth="1.5" />
                {/* NIT Seal Emblem */}
                <circle cx="28" cy="28" r="18" fill="#ffffff" />
                <circle cx="28" cy="28" r="15" fill="#1e3a8a" />
                <text x="28" y="32" fill="#ffffff" textAnchor="middle" className="text-[13px] font-black">
                  NIT
                </text>
                <text x="56" y="24" fill="#ffffff" className="text-[13px] font-black tracking-wider">
                  NIT PATNA
                </text>
                <text x="56" y="40" fill="#93c5fd" className="text-[9.5px] font-extrabold tracking-widest">
                  MAIN CAMPUS
                </text>
              </g>

              {/* North Arrow Indicator */}
              <g transform="translate(680, 85)">
                <circle cx="0" cy="1.5" r="16" fill="#000000" opacity="0.35" />
                <circle cx="0" cy="0" r="16" fill="#0f172a" stroke="#cbd5e1" strokeWidth="1" />
                {/* Compass Needle pointing up */}
                <polygon points="0,-12 4,0 0,-3 -4,0" fill="#ef4444" />
                <polygon points="0,12 4,0 0,3 -4,0" fill="#94a3b8" />
                <text x="0" y="-14" fill="#f8fafc" textAnchor="middle" className="text-[10px] font-black">
                  N
                </text>
              </g>

              {/* Map Legend Box (situated cleanly in open lawn area) */}
              <g transform="translate(615, 155)">
                    <rect x="0" y="1.5" width="95" height="96" rx="6" fill="#000000" opacity="0.35" />
                    <rect x="0" y="0" width="95" height="96" rx="6" fill="#0f172a" opacity="0.92" stroke="#334155" strokeWidth="1" />
                
                {/* Item 1: Main Buildings */}
                <rect x="8" y="8" width="14" height="8" rx="2" fill="#fef3c7" stroke="#b45309" strokeWidth="1" />
                <text x="26" y="15" fill="#e2e8f0" className="text-[7.5px] font-bold">
                  Main Buildings
                </text>

                {/* Item 2: Departments */}
                <rect x="8" y="22" width="14" height="8" rx="2" fill="#fed7aa" stroke="#ea580c" strokeWidth="1" />
                <text x="26" y="29" fill="#e2e8f0" className="text-[7.5px] font-bold">
                  Departments
                </text>

                {/* Item 3: Hostels */}
                <rect x="8" y="36" width="14" height="8" rx="2" fill="#fbcfe8" stroke="#e11d48" strokeWidth="1" />
                <text x="26" y="43" fill="#e2e8f0" className="text-[7.5px] font-bold">
                  Hostels
                </text>

                {/* Item 4: Roads */}
                <rect x="8" y="50" width="14" height="8" rx="2" fill="#64748b" stroke="#334155" strokeWidth="1" />
                <text x="26" y="57" fill="#e2e8f0" className="text-[7.5px] font-bold">
                  Roads
                </text>

                {/* Item 5: Green Area */}
                <rect x="8" y="64" width="14" height="8" rx="2" fill="#15803d" stroke="#16a34a" strokeWidth="1" />
                <text x="26" y="71" fill="#e2e8f0" className="text-[7.5px] font-bold">
                  Green Area
                </text>

                {/* Item 6: Boundary Wall */}
                <line x1="8" y1="84" x2="22" y2="84" stroke="#dc2626" strokeWidth="2.5" />
                <text x="26" y="87" fill="#fca5a5" className="text-[7.5px] font-bold">
                  Boundary Wall
                </text>
              </g>
    </>
  );
});

StaticCampusLayer.displayName = 'StaticCampusLayer';
