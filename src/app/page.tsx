"use client";

import { useState, useEffect, useCallback } from "react";
import {
  decisionTreeQuestions,
  brainstormQuestions,
  type BrainstormQuestion,
} from "@/lib/questions";
import { getOutcome, type Outcome } from "@/lib/outcomes";

// ─── Shared UI Components ──────────────────────────────────────

function Footer({ full = false }: { full?: boolean }) {
  return (
    <p
      style={{
        fontSize: 12,
        color: "var(--text-secondary)",
        marginTop: 48,
        borderTop: "1px solid var(--border)",
        paddingTop: 16,
      }}
    >
      Powered by <span style={{ fontWeight: 600 }}>Prequel</span>
      {full && " — a strategic naming shop"}
    </p>
  );
}

function ProgressBar({
  progress,
  color = "var(--accent)",
}: {
  progress: number;
  color?: string;
}) {
  return (
    <div
      style={{
        height: 3,
        background: "var(--border)",
        borderRadius: 2,
        marginBottom: 48,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          height: "100%",
          background: color,
          borderRadius: 2,
          width: `${progress}%`,
          transition: "width 0.5s ease",
        }}
      />
    </div>
  );
}

function PrimaryButton({
  children,
  onClick,
  disabled = false,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={disabled ? undefined : onClick}
      style={{
        background: "var(--accent)",
        color: "#fff",
        border: "none",
        padding: "14px 32px",
        fontSize: 16,
        fontWeight: 500,
        borderRadius: 8,
        cursor: disabled ? "not-allowed" : "pointer",
        transition: "background 0.2s",
        letterSpacing: "0.01em",
        opacity: disabled ? 0.4 : 1,
      }}
      onMouseEnter={(e) => {
        if (!disabled)
          (e.target as HTMLButtonElement).style.background =
            "var(--accent-hover)";
      }}
      onMouseLeave={(e) => {
        (e.target as HTMLButtonElement).style.background = "var(--accent)";
      }}
    >
      {children}
    </button>
  );
}

function SecondaryButton({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        background: "transparent",
        color: "var(--text-secondary)",
        border: "1px solid var(--border)",
        padding: "10px 20px",
        fontSize: 14,
        borderRadius: 8,
        cursor: "pointer",
        transition: "all 0.2s",
      }}
    >
      {children}
    </button>
  );
}

// ─── Screen Components ─────────────────────────────────────────

function WelcomeScreen({ onStart }: { onStart: () => void }) {
  return (
    <div className="animate-fade-in" style={{ maxWidth: 560, margin: "80px auto 0" }}>
      <p
        style={{
          fontSize: 13,
          textTransform: "uppercase",
          letterSpacing: "0.12em",
          color: "var(--text-secondary)",
          marginBottom: 16,
          fontWeight: 500,
        }}
      >
        Product Naming Tool
      </p>
      <h1
        style={{
          fontSize: 40,
          fontWeight: 700,
          lineHeight: 1.15,
          marginBottom: 20,
          letterSpacing: "-0.02em",
        }}
      >
        What kind of name does your product need?
      </h1>
      <p
        style={{
          fontSize: 18,
          lineHeight: 1.6,
          color: "var(--text-secondary)",
          marginBottom: 40,
        }}
      >
        Answer a few questions about your product, and we&apos;ll tell you what
        type of name it needs and how much work is involved. Takes about 2
        minutes.
      </p>
      <PrimaryButton onClick={onStart}>Get started</PrimaryButton>
      <Footer full />
    </div>
  );
}

function QuizScreen({
  answers,
  onAnswer,
  onBack,
}: {
  answers: Record<string, string>;
  onAnswer: (questionId: string, value: string) => void;
  onBack: () => void;
}) {
  const [animating, setAnimating] = useState(false);

  const applicableQuestions = decisionTreeQuestions.filter(
    (q) => !q.condition || q.condition(answers)
  );

  // Find the first unanswered question
  const currentIdx = applicableQuestions.findIndex(
    (q) => !answers.hasOwnProperty(q.id)
  );
  const currentQ = applicableQuestions[currentIdx];
  const totalQuestions = applicableQuestions.length;
  const progress = (currentIdx / totalQuestions) * 100;

  const handleSelect = (value: string) => {
    if (!currentQ || animating) return;
    setAnimating(true);
    setTimeout(() => {
      onAnswer(currentQ.id, value);
      setAnimating(false);
    }, 250);
  };

  if (!currentQ) return null;

  return (
    <>
      <ProgressBar progress={progress} />
      <div className={animating ? "animate-out" : "animate-slide-in"}>
        <p
          style={{
            fontSize: 13,
            color: "var(--text-secondary)",
            marginBottom: 8,
            fontWeight: 500,
          }}
        >
          Question {currentIdx + 1} of {totalQuestions}
        </p>
        <h2
          style={{
            fontSize: 28,
            fontWeight: 600,
            marginBottom: 8,
            letterSpacing: "-0.01em",
          }}
        >
          {currentQ.question}
        </h2>
        <p
          style={{
            fontSize: 15,
            color: "var(--text-secondary)",
            marginBottom: 32,
            lineHeight: 1.5,
          }}
        >
          {currentQ.subtext}
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {currentQ.options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => handleSelect(opt.value)}
              style={{
                background: "var(--card)",
                border: "1.5px solid var(--border)",
                borderRadius: 10,
                padding: "18px 22px",
                textAlign: "left",
                cursor: "pointer",
                transition: "all 0.2s",
                display: "flex",
                flexDirection: "column",
                gap: 4,
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.borderColor =
                  "var(--accent)";
                (e.currentTarget as HTMLButtonElement).style.background =
                  "#FDFCFB";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.borderColor =
                  "var(--border)";
                (e.currentTarget as HTMLButtonElement).style.background =
                  "var(--card)";
              }}
            >
              <span style={{ fontSize: 16, fontWeight: 500 }}>{opt.label}</span>
              <span
                style={{
                  fontSize: 14,
                  color: "var(--text-secondary)",
                  lineHeight: 1.4,
                }}
              >
                {opt.description}
              </span>
            </button>
          ))}
        </div>

        {currentIdx > 0 && (
          <div style={{ marginTop: 24 }}>
            <SecondaryButton onClick={onBack}>&larr; Back</SecondaryButton>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}

function ResultsScreen({
  outcome,
  onBrainstorm,
  onRestart,
}: {
  outcome: Outcome;
  onBrainstorm: () => void;
  onRestart: () => void;
}) {
  const investmentColor =
    outcome.investmentLevel === "High"
      ? "var(--high)"
      : outcome.investmentLevel.includes("Moderate")
        ? "var(--warning)"
        : "var(--success)";
  const investmentBg =
    outcome.investmentLevel === "High"
      ? "var(--high-bg)"
      : outcome.investmentLevel.includes("Moderate")
        ? "var(--warning-bg)"
        : "var(--success-bg)";

  return (
    <div className="animate-fade-in">
      <p
        style={{
          fontSize: 13,
          textTransform: "uppercase",
          letterSpacing: "0.12em",
          color: "var(--text-secondary)",
          marginBottom: 16,
          fontWeight: 500,
        }}
      >
        Your Result
      </p>
      <h1
        style={{
          fontSize: 36,
          fontWeight: 700,
          marginBottom: 8,
          letterSpacing: "-0.02em",
        }}
      >
        {outcome.nameType}
      </h1>
      <p
        style={{
          fontSize: 17,
          color: "var(--text-secondary)",
          lineHeight: 1.6,
          marginBottom: 32,
        }}
      >
        {outcome.nameTypeDetail}
      </p>

      {/* Cards grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 16,
          marginBottom: 24,
        }}
      >
        <div
          style={{
            background: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: 10,
            padding: 20,
          }}
        >
          <p
            style={{
              fontSize: 11,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: "var(--text-secondary)",
              marginBottom: 8,
              fontWeight: 600,
            }}
          >
            Name Architecture
          </p>
          <p style={{ fontSize: 18, fontWeight: 600 }}>
            {outcome.architecture}
          </p>
        </div>
        <div
          style={{
            background: investmentBg,
            border: "1px solid var(--border)",
            borderRadius: 10,
            padding: 20,
          }}
        >
          <p
            style={{
              fontSize: 11,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: "var(--text-secondary)",
              marginBottom: 8,
              fontWeight: 600,
            }}
          >
            Investment Level
          </p>
          <p style={{ fontSize: 18, fontWeight: 600, color: investmentColor }}>
            {outcome.investmentLevel}
          </p>
        </div>
      </div>

      {/* Detail cards */}
      <div
        style={{
          background: "var(--card)",
          border: "1px solid var(--border)",
          borderRadius: 10,
          padding: 20,
          marginBottom: 16,
        }}
      >
        <p
          style={{
            fontSize: 11,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            color: "var(--text-secondary)",
            marginBottom: 8,
            fontWeight: 600,
          }}
        >
          What This Involves
        </p>
        <p style={{ fontSize: 15, lineHeight: 1.6 }}>
          {outcome.investmentDetail}
        </p>
      </div>

      {outcome.examples && (
        <div
          style={{
            background: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: 10,
            padding: 20,
            marginBottom: 16,
          }}
        >
          <p
            style={{
              fontSize: 11,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: "var(--text-secondary)",
              marginBottom: 8,
              fontWeight: 600,
            }}
          >
            Real-World Examples
          </p>
          <p style={{ fontSize: 15, lineHeight: 1.6 }}>{outcome.examples}</p>
        </div>
      )}

      {outcome.disclaimer && (
        <div
          style={{
            background: "var(--warning-bg)",
            border: "1px solid rgba(196, 169, 125, 0.25)",
            borderRadius: 10,
            padding: 20,
            marginBottom: 24,
          }}
        >
          <p
            style={{
              fontSize: 14,
              lineHeight: 1.6,
              color: "var(--warning)",
              fontWeight: 500,
            }}
          >
            &#9888; {outcome.disclaimer}
          </p>
        </div>
      )}

      <div style={{ display: "flex", gap: 12, marginTop: 32 }}>
        {outcome.needsBrainstorm && (
          <PrimaryButton onClick={onBrainstorm}>
            Brainstorm names &rarr;
          </PrimaryButton>
        )}
        <SecondaryButton onClick={onRestart}>Start over</SecondaryButton>
      </div>
      <Footer full />
    </div>
  );
}

function BrainstormScreen({
  brainstormAnswers,
  onUpdate,
  onComplete,
  onBack,
  selectedChips,
  onChipToggle,
}: {
  brainstormAnswers: Record<string, string | string[]>;
  onUpdate: (id: string, value: string | string[]) => void;
  onComplete: () => void;
  onBack: () => void;
  selectedChips: string[];
  onChipToggle: (chip: string) => void;
}) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [animating, setAnimating] = useState(false);

  const bq = brainstormQuestions[currentIdx];
  const progress = (currentIdx / brainstormQuestions.length) * 100;
  const currentValue =
    (brainstormAnswers[bq.id] as string) || "";
  const isChips = bq.type === "chips";
  const canProceed =
    bq.optional ||
    (isChips ? selectedChips.length > 0 : currentValue.trim().length > 0);

  const handleNext = () => {
    if (!canProceed) return;
    if (isChips) {
      onUpdate(bq.id, selectedChips);
    }
    if (currentIdx < brainstormQuestions.length - 1) {
      setAnimating(true);
      setTimeout(() => {
        setCurrentIdx(currentIdx + 1);
        setAnimating(false);
      }, 200);
    } else {
      onComplete();
    }
  };

  const handleBack = () => {
    if (currentIdx > 0) {
      setAnimating(true);
      setTimeout(() => {
        setCurrentIdx(currentIdx - 1);
        setAnimating(false);
      }, 200);
    } else {
      onBack();
    }
  };

  return (
    <>
      <ProgressBar progress={progress} color="var(--highlight-strong)" />
      <div className={animating ? "animate-out" : "animate-slide-in"}>
        <p
          style={{
            fontSize: 13,
            color: "var(--text-secondary)",
            marginBottom: 4,
            fontWeight: 500,
          }}
        >
          Name Brainstorm — Question {currentIdx + 1} of{" "}
          {brainstormQuestions.length}
        </p>
        <h2
          style={{
            fontSize: 26,
            fontWeight: 600,
            marginBottom: 8,
            letterSpacing: "-0.01em",
          }}
        >
          {bq.question}
        </h2>
        <p
          style={{
            fontSize: 15,
            color: "var(--text-secondary)",
            marginBottom: 24,
            lineHeight: 1.5,
          }}
        >
          {bq.subtext}
          {bq.optional && (
            <span style={{ fontStyle: "italic" }}> (Optional)</span>
          )}
        </p>

        {/* Input types */}
        {bq.type === "textarea" && (
          <textarea
            value={currentValue}
            onChange={(e) => onUpdate(bq.id, e.target.value)}
            placeholder={bq.placeholder}
            style={{
              width: "100%",
              minHeight: 120,
              padding: "14px 16px",
              fontSize: 15,
              border: "1.5px solid var(--border)",
              borderRadius: 10,
              fontFamily: "inherit",
              resize: "vertical",
              outline: "none",
              lineHeight: 1.5,
              background: "var(--card)",
              boxSizing: "border-box",
            }}
          />
        )}

        {bq.type === "text" && (
          <input
            type="text"
            value={currentValue}
            onChange={(e) => onUpdate(bq.id, e.target.value)}
            placeholder={bq.placeholder}
            style={{
              width: "100%",
              padding: "14px 16px",
              fontSize: 15,
              border: "1.5px solid var(--border)",
              borderRadius: 10,
              fontFamily: "inherit",
              outline: "none",
              background: "var(--card)",
              boxSizing: "border-box",
            }}
          />
        )}

        {bq.type === "chips" && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {(bq.options as string[]).map((chip) => {
              const selected = selectedChips.includes(chip);
              return (
                <button
                  key={chip}
                  onClick={() => onChipToggle(chip)}
                  style={{
                    padding: "10px 18px",
                    fontSize: 14,
                    borderRadius: 24,
                    border: `1.5px solid ${selected ? "var(--accent)" : "var(--border)"}`,
                    background: selected ? "var(--accent)" : "var(--card)",
                    color: selected ? "#fff" : "var(--text)",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    fontWeight: selected ? 500 : 400,
                  }}
                >
                  {chip}
                </button>
              );
            })}
            <p
              style={{
                width: "100%",
                fontSize: 13,
                color: "var(--text-secondary)",
                marginTop: 4,
              }}
            >
              {selectedChips.length}/3 selected
            </p>
          </div>
        )}

        {bq.type === "select" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {(bq.options as { label: string; value: string }[]).map((opt) => (
              <button
                key={opt.value}
                onClick={() => onUpdate(bq.id, opt.value)}
                style={{
                  background:
                    currentValue === opt.value ? "#F5F0EA" : "var(--card)",
                  border: `1.5px solid ${currentValue === opt.value ? "var(--accent)" : "var(--border)"}`,
                  borderRadius: 10,
                  padding: "14px 18px",
                  textAlign: "left",
                  cursor: "pointer",
                  fontSize: 15,
                  transition: "all 0.2s",
                  fontWeight: currentValue === opt.value ? 500 : 400,
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}

        <div style={{ display: "flex", gap: 12, marginTop: 32 }}>
          <PrimaryButton onClick={handleNext} disabled={!canProceed}>
            {currentIdx === brainstormQuestions.length - 1
              ? "Generate brief"
              : "Next \u2192"}
          </PrimaryButton>
          <SecondaryButton onClick={handleBack}>
            &larr; Back
          </SecondaryButton>
        </div>
      </div>
      <Footer />
    </>
  );
}

function BriefScreen({
  outcome,
  brainstormAnswers,
  selectedChips,
  onRestart,
}: {
  outcome: Outcome;
  brainstormAnswers: Record<string, string | string[]>;
  selectedChips: string[];
  onRestart: () => void;
}) {
  const ba = brainstormAnswers;
  const toneList = selectedChips.join(", ");
  const intlMap: Record<string, string> = {
    english: "English-speaking markets",
    global: "Global",
    specific: "Specific regions",
  };

  const briefItems = [
    { label: "Product Description", value: ba.product_description },
    { label: "Target Audience", value: ba.target_audience },
    { label: "Key Differentiator", value: ba.differentiator },
    { label: "Category", value: ba.category },
    { label: "Parent Brand", value: ba.parent_brand_name },
    { label: "Desired Tone", value: toneList },
    { label: "Themes to Explore", value: ba.explore_themes },
    { label: "Themes to Avoid", value: ba.avoid_themes },
    {
      label: "International Scope",
      value: intlMap[(ba.international as string) || ""] || "",
    },
  ].filter(
    (item) =>
      item.value &&
      typeof item.value === "string" &&
      item.value.trim() !== ""
  );

  return (
    <div className="animate-fade-in">
      <p
        style={{
          fontSize: 13,
          textTransform: "uppercase",
          letterSpacing: "0.12em",
          color: "var(--text-secondary)",
          marginBottom: 16,
          fontWeight: 500,
        }}
      >
        Your Naming Brief
      </p>
      <h1
        style={{
          fontSize: 32,
          fontWeight: 700,
          marginBottom: 8,
          letterSpacing: "-0.02em",
        }}
      >
        Here&apos;s what we&apos;re working with.
      </h1>
      <p
        style={{
          fontSize: 16,
          color: "var(--text-secondary)",
          lineHeight: 1.6,
          marginBottom: 32,
        }}
      >
        This is the strategic brief for your naming project. In the full
        version, this is where AI-powered name generation kicks in.
      </p>

      {/* Summary card */}
      <div
        style={{
          background: "var(--card)",
          border: "1px solid var(--border)",
          borderRadius: 12,
          padding: 28,
          marginBottom: 16,
        }}
      >
        <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 20 }}>
          Naming Brief Summary
        </h3>

        <div
          style={{
            background: "#F8F6F3",
            borderRadius: 8,
            padding: 16,
            marginBottom: 20,
          }}
        >
          <p
            style={{
              fontSize: 12,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: "var(--text-secondary)",
              fontWeight: 600,
              marginBottom: 4,
            }}
          >
            Recommended Name Type
          </p>
          <p style={{ fontSize: 16, fontWeight: 600 }}>{outcome.nameType}</p>
          <p
            style={{
              fontSize: 13,
              color: "var(--text-secondary)",
              marginTop: 2,
            }}
          >
            Investment: {outcome.investmentLevel}
          </p>
        </div>

        {briefItems.map((item) => (
          <div
            key={item.label}
            style={{
              marginBottom: 16,
              paddingBottom: 16,
              borderBottom: "1px solid var(--border)",
            }}
          >
            <p
              style={{
                fontSize: 12,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: "var(--text-secondary)",
                fontWeight: 600,
                marginBottom: 4,
              }}
            >
              {item.label}
            </p>
            <p style={{ fontSize: 15, lineHeight: 1.5 }}>
              {item.value as string}
            </p>
          </div>
        ))}
      </div>

      {/* Coming soon placeholder */}
      <div
        style={{
          background:
            "linear-gradient(135deg, rgba(232,221,208,0.25), rgba(196,169,125,0.13))",
          border: "1.5px dashed var(--highlight-strong)",
          borderRadius: 12,
          padding: 28,
          textAlign: "center",
          marginBottom: 32,
        }}
      >
        <p style={{ fontSize: 20, fontWeight: 600, marginBottom: 8 }}>
          Name generation coming soon
        </p>
        <p
          style={{
            fontSize: 15,
            color: "var(--text-secondary)",
            lineHeight: 1.5,
            maxWidth: 440,
            margin: "0 auto",
          }}
        >
          In the full version, this is where AI-powered name brainstorming
          happens — generating options based on your brief, with initial
          trademark viability screening.
        </p>
      </div>

      <SecondaryButton onClick={onRestart}>Start over</SecondaryButton>
      <Footer full />
    </div>
  );
}

// ─── Main App ──────────────────────────────────────────────────

type Screen = "welcome" | "quiz" | "results" | "brainstorm" | "brief";

export default function Home() {
  const [screen, setScreen] = useState<Screen>("welcome");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [brainstormAnswers, setBrainstormAnswers] = useState<
    Record<string, string | string[]>
  >({});
  const [selectedChips, setSelectedChips] = useState<string[]>([]);
  const [outcome, setOutcome] = useState<Outcome | null>(null);

  // Track the ordered list of answered question IDs so we can step back
  const [answerHistory, setAnswerHistory] = useState<string[]>([]);

  const handleQuizAnswer = useCallback(
    (questionId: string, value: string) => {
      const newAnswers = { ...answers, [questionId]: value };
      setAnswers(newAnswers);
      setAnswerHistory((prev) => [...prev, questionId]);

      // Check if all applicable questions are answered
      const applicable = decisionTreeQuestions.filter(
        (q) => !q.condition || q.condition(newAnswers)
      );
      const allAnswered = applicable.every((q) =>
        newAnswers.hasOwnProperty(q.id)
      );

      if (allAnswered) {
        const result = getOutcome(newAnswers);
        setOutcome(result);
        setScreen("results");
      }
    },
    [answers]
  );

  const handleQuizBack = useCallback(() => {
    if (answerHistory.length === 0) return;
    const newHistory = [...answerHistory];
    const lastId = newHistory.pop()!;
    const newAnswers = { ...answers };
    delete newAnswers[lastId];
    setAnswers(newAnswers);
    setAnswerHistory(newHistory);
  }, [answers, answerHistory]);

  const handleBrainstormUpdate = useCallback(
    (id: string, value: string | string[]) => {
      setBrainstormAnswers((prev) => ({ ...prev, [id]: value }));
    },
    []
  );

  const handleChipToggle = useCallback(
    (chip: string) => {
      setSelectedChips((prev) =>
        prev.includes(chip)
          ? prev.filter((c) => c !== chip)
          : prev.length < 3
            ? [...prev, chip]
            : prev
      );
    },
    []
  );

  const restart = useCallback(() => {
    setScreen("welcome");
    setAnswers({});
    setBrainstormAnswers({});
    setSelectedChips([]);
    setOutcome(null);
    setAnswerHistory([]);
  }, []);

  return (
    <div
      style={{
        maxWidth: 720,
        margin: "0 auto",
        padding: "40px 24px",
        minHeight: "100vh",
      }}
    >
      {screen === "welcome" && (
        <WelcomeScreen onStart={() => setScreen("quiz")} />
      )}

      {screen === "quiz" && (
        <QuizScreen
          answers={answers}
          onAnswer={handleQuizAnswer}
          onBack={handleQuizBack}
        />
      )}

      {screen === "results" && outcome && (
        <ResultsScreen
          outcome={outcome}
          onBrainstorm={() => setScreen("brainstorm")}
          onRestart={restart}
        />
      )}

      {screen === "brainstorm" && outcome && (
        <BrainstormScreen
          brainstormAnswers={brainstormAnswers}
          onUpdate={handleBrainstormUpdate}
          onComplete={() => setScreen("brief")}
          onBack={() => setScreen("results")}
          selectedChips={selectedChips}
          onChipToggle={handleChipToggle}
        />
      )}

      {screen === "brief" && outcome && (
        <BriefScreen
          outcome={outcome}
          brainstormAnswers={brainstormAnswers}
          selectedChips={selectedChips}
          onRestart={restart}
        />
      )}
    </div>
  );
}
