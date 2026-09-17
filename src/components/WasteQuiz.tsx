import React, { useState } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  Award, 
  RotateCcw, 
  ArrowRight, 
  Sparkles,
  Leaf,
  Recycle,
  Zap,
  AlertTriangle
} from 'lucide-react';

interface QuizQuestion {
  id: number;
  scenario: string;
  context: string;
  options: {
    text: string;
    isCorrect: boolean;
    explanation: string;
  }[];
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    scenario: 'You just finished drinking hot masala chai from a paper cup with wet tea dregs at the bottom.',
    context: 'At SAC Canteen or Cafeteria',
    options: [
      {
        text: 'Toss the entire cup with leftover liquid straight into the Blue (Dry) bin.',
        isCorrect: false,
        explanation: 'Liquid residue soaks adjacent clean paper and ruins entire recycling batches.',
      },
      {
        text: 'Pour liquid & tea dregs into the Green (Wet) bin, then place the dry cup into Blue (Dry) bin.',
        isCorrect: true,
        explanation: 'Spot on! Segregating organic tea dregs allows the dry paper cup to be cleanly baled and pulped.',
      },
      {
        text: 'Throw the whole cup into the campus vermicomposting pit.',
        isCorrect: false,
        explanation: 'Paper cups often contain a thin polyethylene water-resistant liner that will not compost organically.',
      },
      {
        text: 'Drop it in the nearest E-Waste box.',
        isCorrect: false,
        explanation: 'E-Waste bins are strictly reserved for electronics, batteries, and wires.',
      },
    ],
  },
  {
    id: 2,
    scenario: 'Your wireless mouse died during exam revision. Where do the depleted AAA alkaline batteries belong?',
    context: 'At Central Library or Hostel Room',
    options: [
      {
        text: 'Drop inside the E-Waste & Safe Drop Box in Computer Science / IT Lab.',
        isCorrect: true,
        explanation: 'Correct! Heavy metals like zinc, manganese, and lithium require specialized hazardous e-waste extraction.',
      },
      {
        text: 'Toss into the Green (Wet) bin since it is small.',
        isCorrect: false,
        explanation: 'Severe hazard! Battery acids leak and poison organic soil compost with heavy metals.',
      },
      {
        text: 'Crush them and put in the Blue (Dry) bin.',
        isCorrect: false,
        explanation: 'Never crush batteries! Damaged casings can cause short-circuit sparks and fire hazards.',
      },
      {
        text: 'Bury them in the campus botanical garden.',
        isCorrect: false,
        explanation: 'Chemical leaching from buried batteries poisons campus groundwater.',
      },
    ],
  },
  {
    id: 3,
    scenario: 'A pizza delivery arrived at your hostel. The lid is clean cardboard, but the base is soaked with grease and cheese.',
    context: 'At Kosi / Brahmaputra Hostel',
    options: [
      {
        text: 'Throw the entire grease-stained box into Blue (Dry) paper recycling.',
        isCorrect: false,
        explanation: 'Oil cannot be separated from paper pulp during normal recycling, rejecting the entire load.',
      },
      {
        text: 'Tear off the clean lid for Blue (Dry) bin; compost the grease-soaked base in Green (Wet) bin.',
        isCorrect: true,
        explanation: 'Master segregator move! Unsoiled cardboard is 100% recyclable, while food-soaked cardboard breaks down in compost.',
      },
      {
        text: 'Wash the greasy box with detergent and put in Blue bin.',
        isCorrect: false,
        explanation: 'Wetted cardboard breaks down prematurely and cannot be recycled.',
      },
      {
        text: 'Burn the box behind the sports complex.',
        isCorrect: false,
        explanation: 'Open burning produces toxic dioxins and violates National Green Tribunal (NGT) rules.',
      },
    ],
  },
  {
    id: 4,
    scenario: 'You finished hostel mess lunch, with rice & dal remnants on your thali and an empty mineral water bottle.',
    context: 'At Hostel Mess Dining Hall',
    options: [
      {
        text: 'Dump both food waste and plastic bottle together into the Green bin.',
        isCorrect: false,
        explanation: 'Plastic in the green bin destroys vermicomposting equipment and harms earthworms.',
      },
      {
        text: 'Shake food clean into Green (Wet) bin; crush & deposit plastic bottle in Blue (Dry) bin.',
        isCorrect: true,
        explanation: 'Excellent! Food scraps feed the campus soil pit, and crushed PET bottles are baled for fabric recycling.',
      },
      {
        text: 'Leave plate un-scraped on the tray washing station table.',
        isCorrect: false,
        explanation: 'Food residue clogs mess drainage lines and wastes manpower.',
      },
      {
        text: 'Put both into Blue bin.',
        isCorrect: false,
        explanation: 'Wet dal and rice spoil paper and plastic dry recyclables.',
      },
    ],
  },
  {
    id: 5,
    scenario: 'You have used adhesive medical bandages and a disposable fever mask to dispose of safely.',
    context: 'Hostel Infirmary or Health Wing',
    options: [
      {
        text: 'Throw loosely into the classroom Blue (Dry) paper bin.',
        isCorrect: false,
        explanation: 'Exposes waste-pickers and sanitation workers to biological infections.',
      },
      {
        text: 'Toss into the garden Green (Wet) bin.',
        isCorrect: false,
        explanation: 'Synthetic bandages and polypropylene masks do not decompose organically.',
      },
      {
        text: 'Wrap securely in newspaper, mark with a red X, and deposit in Health Centre / Red marked bin.',
        isCorrect: true,
        explanation: 'Spot on! Biomedical waste protocols mandate secure wrapping and clear labeling for hazardous incineration.',
      },
      {
        text: 'Flush down the hostel toilet drain.',
        isCorrect: false,
        explanation: 'Synthetic bandages do not dissolve and cause severe campus pipeline blockages.',
      },
    ],
  },
];

export const WasteQuiz: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const currentQ = QUIZ_QUESTIONS[currentIndex];

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);

    if (currentQ.options[idx].isCorrect) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < QUIZ_QUESTIONS.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setQuizCompleted(true);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setQuizCompleted(false);
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 mb-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Interactive Knowledge Check</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 font-['Outfit',sans-serif]">
            Campus Waste Segregation Challenge
          </h3>
          <p className="text-xs text-slate-500">
            Real campus situations: test your judgment on proper dustbin disposal under Swachh Bharat Mission guidelines.
          </p>
        </div>

        {!quizCompleted && (
          <div className="flex items-center gap-2 self-start sm:self-auto bg-slate-50 px-3.5 py-1.5 rounded-2xl border border-slate-200">
            <span className="text-xs font-bold text-slate-500">Question</span>
            <span className="text-sm font-black text-emerald-600">
              {currentIndex + 1}
            </span>
            <span className="text-xs text-slate-400">/ {QUIZ_QUESTIONS.length}</span>
          </div>
        )}
      </div>

      {!quizCompleted ? (
        <div className="space-y-6">
          {/* Progress bar */}
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-emerald-500 h-full transition-all duration-300 rounded-full"
              style={{ width: `${((currentIndex + (isAnswered ? 1 : 0)) / QUIZ_QUESTIONS.length) * 100}%` }}
            />
          </div>

          {/* Scenario Card */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-md space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
              📍 Scenario • {currentQ.context}
            </span>
            <h4 className="text-base sm:text-lg font-bold font-['Outfit',sans-serif] leading-snug">
              "{currentQ.scenario}"
            </h4>
            <p className="text-xs text-slate-300">
              What is the correct dustbin disposal method?
            </p>
          </div>

          {/* Options */}
          <div className="space-y-2.5">
            {currentQ.options.map((option, idx) => {
              const isSelected = selectedOption === idx;
              let btnStyle = 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800';

              if (isAnswered) {
                if (option.isCorrect) {
                  btnStyle = 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold shadow-xs';
                } else if (isSelected) {
                  btnStyle = 'bg-rose-50 border-rose-400 text-rose-950';
                } else {
                  btnStyle = 'bg-slate-50/50 border-slate-100 text-slate-400 opacity-60';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  disabled={isAnswered}
                  className={`w-full text-left p-4 rounded-2xl border-2 transition-all text-xs sm:text-sm font-medium flex items-start gap-3 cursor-pointer ${btnStyle}`}
                >
                  <span className="w-6 h-6 rounded-full bg-white border border-slate-200 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 shadow-2xs">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <div className="flex-1">
                    <span>{option.text}</span>
                    {isAnswered && (option.isCorrect || isSelected) && (
                      <div className="mt-2 pt-2 border-t border-current/10 text-xs font-normal">
                        <span className="font-bold block mb-0.5">
                          {option.isCorrect ? '✅ Why this is right:' : '❌ Why this is incorrect:'}
                        </span>
                        <span>{option.explanation}</span>
                      </div>
                    )}
                  </div>
                  {isAnswered && option.isCorrect && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  )}
                  {isAnswered && isSelected && !option.isCorrect && (
                    <XCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Next button */}
          {isAnswered && (
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs font-semibold text-slate-500">
                {currentQ.options[selectedOption!].isCorrect ? (
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Correct Answer! (+1 pt)
                  </span>
                ) : (
                  <span className="text-rose-600 font-bold flex items-center gap-1">
                    <XCircle className="w-4 h-4" /> Review the tip above
                  </span>
                )}
              </span>

              <button
                onClick={handleNext}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-emerald-600/20 flex items-center gap-2 cursor-pointer transition-all"
              >
                <span>{currentIndex < QUIZ_QUESTIONS.length - 1 ? 'Next Scenario' : 'View Results'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Completion screen */
        <div className="py-8 px-4 text-center space-y-5 animate-in fade-in zoom-in-95 duration-200">
          <div className="w-16 h-16 rounded-3xl bg-amber-100 text-amber-600 mx-auto flex items-center justify-center shadow-md shadow-amber-500/10">
            <Award className="w-9 h-9" />
          </div>

          <div className="space-y-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              Quiz Completed!
            </span>
            <h4 className="text-2xl font-black text-slate-900 font-['Outfit',sans-serif] mt-2">
              Your Score: {score} out of {QUIZ_QUESTIONS.length}
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
              {score === 5
                ? '🌟 Flawless! You are a certified Swachh Campus Champion. You understand every nuance of dry, wet, and e-waste segregation.'
                : score >= 3
                ? '👏 Great job! You have solid segregation habits and know where campus waste belongs. Keep leading by example!'
                : '💡 Good effort! Review the waste catalog cards below to sharpen your dry vs. wet knowledge.'}
            </p>
          </div>

          {/* Quick summary metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-md mx-auto text-xs">
            <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200">
              <span className="text-[10px] uppercase font-bold text-emerald-700 block">Accuracy</span>
              <span className="text-lg font-black text-emerald-950">{Math.round((score / QUIZ_QUESTIONS.length) * 100)}%</span>
            </div>
            <div className="p-3 rounded-2xl bg-sky-50 border border-sky-200">
              <span className="text-[10px] uppercase font-bold text-sky-700 block">Status</span>
              <span className="text-lg font-black text-sky-950">
                {score >= 4 ? 'Champion' : score >= 3 ? 'Practitioner' : 'Learner'}
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 col-span-2 sm:col-span-1">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Impact</span>
              <span className="text-lg font-black text-slate-900">+50 Pts</span>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={handleRestart}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retry Challenge</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
