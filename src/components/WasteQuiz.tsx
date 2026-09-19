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
    <div className="bg-white rounded-lg p-5 sm:p-7 border border-stone-200 shadow-2xs space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[10px] font-bold bg-stone-100 text-stone-800 border border-stone-200 mb-1.5 font-mono-code uppercase tracking-wider">
            <Sparkles className="w-3 h-3 text-[#134E3A]" />
            <span>Interactive Protocol Assessment</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-stone-900 font-editorial">
            Campus Segregation Competency Evaluation
          </h3>
          <p className="text-xs text-stone-500">
            Real campus situations: test your judgment against Swachh Bharat Mission and CPWD environmental norms.
          </p>
        </div>

        {!quizCompleted && (
          <div className="flex items-center gap-2 self-start sm:self-auto bg-stone-50 px-3 py-1 rounded border border-stone-200 font-mono-code">
            <span className="text-xs text-stone-500">Item</span>
            <span className="text-xs font-bold text-[#134E3A]">
              {currentIndex + 1}
            </span>
            <span className="text-xs text-stone-400">/ {QUIZ_QUESTIONS.length}</span>
          </div>
        )}
      </div>

      {!quizCompleted ? (
        <div className="space-y-5">
          {/* Progress bar */}
          <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden border border-stone-200">
            <div
              className="bg-[#134E3A] h-full transition-all duration-300"
              style={{ width: `${((currentIndex + (isAnswered ? 1 : 0)) / QUIZ_QUESTIONS.length) * 100}%` }}
            />
          </div>

          {/* Scenario Card */}
          <div className="p-4 sm:p-5 rounded bg-stone-900 text-stone-100 border border-stone-800 shadow-2xs space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 font-mono-code block">
              Case Study &bull; {currentQ.context}
            </span>
            <h4 className="text-base sm:text-lg font-bold font-editorial text-white leading-snug">
              &ldquo;{currentQ.scenario}&rdquo;
            </h4>
            <p className="text-xs text-stone-400">
              Select the compliant waste management protocol:
            </p>
          </div>

          {/* Options */}
          <div className="space-y-2">
            {currentQ.options.map((option, idx) => {
              const isSelected = selectedOption === idx;
              let btnStyle = 'bg-stone-50 hover:bg-stone-100 border-stone-200 text-stone-800';

              if (isAnswered) {
                if (option.isCorrect) {
                  btnStyle = 'bg-emerald-50/70 border-[#134E3A] text-stone-900 font-semibold shadow-2xs';
                } else if (isSelected) {
                  btnStyle = 'bg-rose-50 border-rose-300 text-rose-950 font-medium';
                } else {
                  btnStyle = 'bg-stone-50/40 border-stone-200 text-stone-400 opacity-60';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  disabled={isAnswered}
                  className={`w-full text-left p-3.5 rounded border transition-colors text-xs sm:text-sm font-medium flex items-start gap-3 cursor-pointer ${btnStyle}`}
                >
                  <span className="w-5 h-5 rounded bg-white border border-stone-300 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 font-mono-code text-stone-700">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <div className="flex-1">
                    <span>{option.text}</span>
                    {isAnswered && (option.isCorrect || isSelected) && (
                      <div className="mt-2 pt-2 border-t border-stone-200/60 text-xs font-normal">
                        <span className="font-semibold block mb-0.5 text-stone-900 font-editorial">
                          {option.isCorrect ? 'Institutional Rationalization:' : 'Regulatory Conflict:'}
                        </span>
                        <span className="text-stone-700">{option.explanation}</span>
                      </div>
                    )}
                  </div>
                  {isAnswered && option.isCorrect && (
                    <CheckCircle2 className="w-4 h-4 text-[#134E3A] shrink-0 mt-0.5" />
                  )}
                  {isAnswered && isSelected && !option.isCorrect && (
                    <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Next button */}
          {isAnswered && (
            <div className="flex items-center justify-between pt-2 border-t border-stone-100">
              <span className="text-xs font-medium text-stone-500 font-mono-code">
                {currentQ.options[selectedOption!].isCorrect ? (
                  <span className="text-[#134E3A] font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Correct Assessment (+1)
                  </span>
                ) : (
                  <span className="text-rose-700 font-semibold flex items-center gap-1">
                    <XCircle className="w-3.5 h-3.5" /> Non-Compliant Selection
                  </span>
                )}
              </span>

              <button
                onClick={handleNext}
                className="px-4 py-1.5 rounded bg-[#134E3A] hover:bg-[#0F3E2E] text-white text-xs font-semibold shadow-2xs flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <span>{currentIndex < QUIZ_QUESTIONS.length - 1 ? 'Proceed to Next Case' : 'View Final Evaluation'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Completion screen */
        <div className="py-6 px-4 text-center space-y-4 animate-in fade-in duration-150">
          <div className="w-12 h-12 rounded bg-amber-50 text-amber-800 border border-amber-200 mx-auto flex items-center justify-center">
            <Award className="w-7 h-7" />
          </div>

          <div className="space-y-1">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-900 border border-emerald-200 font-mono-code">
              <Sparkles className="w-3 h-3 text-[#134E3A]" />
              Assessment Complete
            </span>
            <h4 className="text-2xl font-bold text-stone-900 font-editorial mt-2">
              Score: {score} / {QUIZ_QUESTIONS.length}
            </h4>
            <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto leading-relaxed">
              {score === 5
                ? 'Distinguished! Full compliance with Swachh Bharat campus protocols and municipal standards.'
                : score >= 3
                ? 'Proficient! You exhibit a strong grasp of campus waste streams and appropriate disposal channels.'
                : 'Review Recommended! Familiarize yourself with the waste classification guidelines provided below.'}
            </p>
          </div>

          {/* Quick summary metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-w-md mx-auto text-xs">
            <div className="p-2.5 rounded bg-stone-50 border border-stone-200">
              <span className="text-[10px] uppercase font-bold text-stone-500 block font-mono-code">Accuracy</span>
              <span className="text-base font-bold text-stone-900 font-editorial">{Math.round((score / QUIZ_QUESTIONS.length) * 100)}%</span>
            </div>
            <div className="p-2.5 rounded bg-stone-50 border border-stone-200">
              <span className="text-[10px] uppercase font-bold text-stone-500 block font-mono-code">Proficiency</span>
              <span className="text-base font-bold text-[#134E3A] font-editorial">
                {score >= 4 ? 'Exemplary' : score >= 3 ? 'Compliant' : 'Foundational'}
              </span>
            </div>
            <div className="p-2.5 rounded bg-stone-50 border border-stone-200 col-span-2 sm:col-span-1">
              <span className="text-[10px] uppercase font-bold text-stone-500 block font-mono-code">Credits</span>
              <span className="text-base font-bold text-stone-900 font-editorial">+50 SBM Pts</span>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2">
            <button
              onClick={handleRestart}
              className="px-4 py-1.5 rounded bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-medium flex items-center justify-center gap-1.5 cursor-pointer transition-colors border border-stone-200"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retake Evaluation</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
