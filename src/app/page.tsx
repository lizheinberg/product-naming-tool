"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import Image from "next/image";
import { decisionTreeQuestions } from "@/lib/questions";
import { getOutcome, type DecisionOutcome } from "@/lib/outcomes";

declare global {
  interface Window {
    plausible?: (
      event: string,
      options?: { props?: Record<string, string | number> }
    ) => void;
  }
}

function trackEvent(
  event: string,
  props?: Record<string, string | number>
) {
  if (typeof window !== "undefined" && window.plausible) {
    window.plausible(event, props ? { props } : undefined);
  }
}

// ─── Shared UI Components ──────────────────────────────────────

function PrequelLogo() {
  return (
    <a
      href="https://www.prequel.agency"
      target="_blank"
      rel="noopener noreferrer"
      style={{ display: "inline-block" }}
    >
      <Image
        src="/prequel-logo.svg"
        alt="Prequel"
        width={120}
        height={33}
        priority
      />
    </a>
  );
}

function Header() {
  return (
    <header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 48,
        paddingBottom: 24,
        borderBottom: "1px solid var(--border)",
      }}
    >
      <PrequelLogo />
      <span
        style={{
          fontSize: 13,
          fontWeight: 500,
          color: "var(--text-secondary)",
          letterSpacing: "0.04em",
        }}
      >
        Platform Brand Architecture and Naming Assessment
      </span>
    </header>
  );
}

function Footer({ full = false }: { full?: boolean }) {
  return (
    <footer
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        marginTop: 56,
        paddingTop: 20,
        borderTop: "1px solid var(--border)",
      }}
    >
      <Image
        src="/prequel-logo.svg"
        alt="Prequel"
        width={80}
        height={22}
      />
      {full && (
        <span
          style={{
            fontSize: 12,
            color: "var(--text-secondary)",
          }}
        >
          — strategic naming &amp; brand architecture
        </span>
      )}
    </footer>
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
        height: 2,
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
        color: "#EEEEE1",
        border: "none",
        padding: "14px 36px",
        fontSize: 15,
        fontWeight: 500,
        fontFamily: "var(--font-sans)",
        borderRadius: 100,
        cursor: disabled ? "not-allowed" : "pointer",
        transition: "all 0.2s",
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
        padding: "10px 24px",
        fontSize: 14,
        fontFamily: "var(--font-sans)",
        borderRadius: 100,
        cursor: "pointer",
        transition: "all 0.2s",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.borderColor =
          "var(--border-strong)";
        (e.currentTarget as HTMLButtonElement).style.color = "var(--text)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.borderColor =
          "var(--border)";
        (e.currentTarget as HTMLButtonElement).style.color =
          "var(--text-secondary)";
      }}
    >
      {children}
    </button>
  );
}

// ─── Screen Components ─────────────────────────────────────────

function WelcomeScreen({ onStart }: { onStart: () => void }) {
  return (
    <div
      className="animate-fade-in"
      style={{ maxWidth: 560, margin: "40px auto 0" }}
    >
      <h1
        style={{
          fontFamily: "var(--font-serif)",
          fontSize: 44,
          fontWeight: 400,
          lineHeight: 1.15,
          marginBottom: 24,
          letterSpacing: "-0.01em",
        }}
      >
        We&apos;d appreciate your input.
      </h1>
      <div
        style={{
          fontSize: 16,
          lineHeight: 1.7,
          color: "var(--text-secondary)",
          marginBottom: 40,
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        <p>
          This is a beta version of a decision tool created by the strategic
          naming agency{" "}
          <a
            href="https://www.prequel.agency/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "var(--accent)", textDecoration: "none", fontWeight: 500 }}
          >
            Prequel
          </a>
          .
        </p>
        <p>
          In just a few minutes, we&apos;ll take you from &ldquo;How should we
          organize the platform brands? Should we keep the anchor as the
          Holdco name? And do I need a new name for this Holdco?&rdquo; to
          &ldquo;I understand the factors I should be considering and the
          next steps I should take&rdquo; &mdash;
          or at least, that&apos;s our goal!
        </p>
        <p>
          The assessment tool focuses on objective criteria, e.g. brand
          alignment, trademark status, etc. It is worth noting that more
          subjective factors such as &ldquo;we just don&apos;t like any of the
          portco names&rdquo; or &ldquo;elevating one portco brand as the holdco
          brand might create friction with the other
          founders/employees&rdquo; are not insignificant and should be
          considered as part of the overall brand strategy.
        </p>
        <p>
          We are currently seeking feedback to help us make this tool more
          useful for professionals in your field. (Just follow the link at
          the end.)
        </p>
        <p>Thank you for your time and input!</p>
      </div>
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
        <h2
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: 30,
            fontWeight: 400,
            marginBottom: 8,
            lineHeight: 1.25,
          }}
        >
          {currentQ.question}
        </h2>
        <div
          style={{
            fontSize: 15,
            color: "var(--text-secondary)",
            marginBottom: 32,
            lineHeight: 1.6,
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          {currentQ.subtext.split("\n\n").map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>

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
                  "var(--card-hover)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.borderColor =
                  "var(--border)";
                (e.currentTarget as HTMLButtonElement).style.background =
                  "var(--card)";
              }}
            >
              <span
                style={{
                  fontSize: 16,
                  fontWeight: 500,
                  color: "var(--text)",
                }}
              >
                {opt.label}
              </span>
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

function buildShareLink(answers: Record<string, string>): string {
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(answers)) params.set(k, v);
  const origin =
    typeof window !== "undefined"
      ? window.location.origin
      : "https://holdco.prequel.agency";
  return `${origin}/?${params.toString()}`;
}

function buildSummaryText(outcome: DecisionOutcome): string {
  const lines: string[] = [];
  lines.push("Platform Brand Architecture and Naming Assessment");
  lines.push("");
  lines.push(`RECOMMENDATION: ${outcome.nameRecommendation}`);
  lines.push(outcome.nameDescription);
  lines.push("");
  lines.push(`ARCHITECTURE: ${outcome.architectureRecommendation}`);
  lines.push(outcome.architectureDescription);
  if (outcome.considerations.length > 0) {
    lines.push("");
    lines.push("KEY CONSIDERATIONS:");
    for (const c of outcome.considerations) lines.push(`• ${c}`);
  }
  lines.push("");
  lines.push("NEXT STEPS:");
  lines.push(outcome.investmentDescription);
  lines.push("");
  lines.push("—");
  lines.push("Take the assessment: https://holdco.prequel.agency");
  return lines.join("\n");
}

function ShareMenu({
  answers,
  outcome,
}: {
  answers: Record<string, string>;
  outcome: DecisionOutcome;
}) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState<"link" | "summary" | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open]);

  const doCopy = async (kind: "link" | "summary") => {
    const text =
      kind === "link" ? buildShareLink(answers) : buildSummaryText(outcome);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(kind);
      trackEvent(kind === "link" ? "Link Copied" : "Summary Copied");
      setTimeout(() => {
        setCopied(null);
        setOpen(false);
      }, 1200);
    } catch {
      // Clipboard API not available — no-op
    }
  };

  return (
    <div ref={menuRef} style={{ position: "relative" }}>
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          background: "transparent",
          color: "var(--text-secondary)",
          border: "1px solid var(--border)",
          padding: "10px 24px",
          fontSize: 14,
          fontFamily: "var(--font-sans)",
          borderRadius: 100,
          cursor: "pointer",
          transition: "all 0.2s",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.borderColor =
            "var(--border-strong)";
          (e.currentTarget as HTMLButtonElement).style.color = "var(--text)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.borderColor =
            "var(--border)";
          (e.currentTarget as HTMLButtonElement).style.color =
            "var(--text-secondary)";
        }}
      >
        Share
      </button>
      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            left: 0,
            background: "var(--card-bg)",
            border: "1px solid var(--border)",
            borderRadius: 12,
            padding: 6,
            minWidth: 180,
            boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
            zIndex: 10,
          }}
        >
          <button
            onClick={() => doCopy("link")}
            style={{
              display: "block",
              width: "100%",
              textAlign: "left",
              background: "transparent",
              border: "none",
              padding: "10px 14px",
              fontSize: 14,
              fontFamily: "var(--font-sans)",
              color: "var(--text)",
              borderRadius: 8,
              cursor: "pointer",
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.background =
                "var(--hover-bg, rgba(0,0,0,0.04))")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.background =
                "transparent")
            }
          >
            {copied === "link" ? "✓ Copied!" : "Copy link"}
          </button>
          <button
            onClick={() => doCopy("summary")}
            style={{
              display: "block",
              width: "100%",
              textAlign: "left",
              background: "transparent",
              border: "none",
              padding: "10px 14px",
              fontSize: 14,
              fontFamily: "var(--font-sans)",
              color: "var(--text)",
              borderRadius: 8,
              cursor: "pointer",
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.background =
                "var(--hover-bg, rgba(0,0,0,0.04))")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.background =
                "transparent")
            }
          >
            {copied === "summary" ? "✓ Copied!" : "Copy summary"}
          </button>
        </div>
      )}
    </div>
  );
}

function ResultsScreen({
  outcome,
  answers,
  onRestart,
  onBack,
}: {
  outcome: DecisionOutcome;
  answers: Record<string, string>;
  onRestart: () => void;
  onBack: () => void;
}) {
  return (
    <div className="animate-fade-in">
      <p
        style={{
          fontSize: 13,
          textTransform: "uppercase",
          letterSpacing: "0.12em",
          color: "var(--accent)",
          marginBottom: 16,
          fontWeight: 600,
        }}
      >
        Your Recommendation
      </p>

      <h1
        style={{
          fontFamily: "var(--font-serif)",
          fontSize: 36,
          fontWeight: 400,
          marginBottom: 12,
          lineHeight: 1.2,
        }}
      >
        {outcome.nameRecommendation}
      </h1>
      <p
        style={{
          fontSize: 16,
          color: "var(--text-secondary)",
          lineHeight: 1.7,
          marginBottom: 36,
        }}
      >
        {outcome.nameDescription}
      </p>

      {/* Architecture Recommendation */}
      <div style={{ marginBottom: 16 }}>
        <p
          style={{
            fontSize: 11,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            color: "var(--text-secondary)",
            marginBottom: 12,
            fontWeight: 600,
          }}
        >
          Architecture
        </p>
        <div
          style={{
            background: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: 10,
            padding: "20px 24px",
          }}
        >
          <p
            style={{
              fontSize: 18,
              fontWeight: 600,
              marginBottom: 8,
              color: "var(--text)",
            }}
          >
            {outcome.architectureRecommendation}
          </p>
          <p
            style={{
              fontSize: 15,
              color: "var(--text-secondary)",
              lineHeight: 1.6,
            }}
          >
            {outcome.architectureDescription}
          </p>
        </div>
      </div>

      {/* Key Considerations */}
      {outcome.considerations.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <p
            style={{
              fontSize: 11,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: "var(--text-secondary)",
              marginBottom: 12,
              fontWeight: 600,
            }}
          >
            Key Considerations
          </p>
          <div
            style={{
              background: "var(--card)",
              border: "1px solid var(--border)",
              borderRadius: 10,
              padding: 24,
            }}
          >
            <ul
              style={{
                paddingLeft: 20,
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              {outcome.considerations.map((item, i) => (
                <li
                  key={i}
                  style={{
                    fontSize: 15,
                    lineHeight: 1.6,
                    color: "var(--text-secondary)",
                  }}
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Next Steps */}
      <div style={{ marginBottom: 24 }}>
        <p
          style={{
            fontSize: 11,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            color: "var(--text-secondary)",
            marginBottom: 12,
            fontWeight: 600,
          }}
        >
          Next Steps
        </p>
        <div
          style={{
            background: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: 10,
            padding: "20px 24px",
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          {outcome.investmentDescription.split("\n\n").map((para, i) => (
            <p
              key={i}
              style={{
                fontSize: 15,
                color: "var(--text-secondary)",
                lineHeight: 1.6,
              }}
            >
              {para}
            </p>
          ))}
        </div>
      </div>

      {/* CTA to Prequel */}
      <div
        style={{
          background: "var(--card)",
          border: "1px solid var(--border)",
          borderRadius: 12,
          padding: 28,
          textAlign: "center",
          marginBottom: 24,
        }}
      >
        <div
          style={{
            width: 44,
            height: 44,
            background: "var(--accent-light)",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 14px",
            fontSize: 20,
            color: "var(--accent)",
          }}
        >
          &#10022;
        </div>
        <h3
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: 20,
            fontWeight: 500,
            marginBottom: 10,
          }}
        >
          Have suggestions to help us improve this tool?
        </h3>
        <p
          style={{
            fontSize: 15,
            color: "var(--text-secondary)",
            lineHeight: 1.6,
            maxWidth: 440,
            margin: "0 auto",
          }}
        >
          <a
            href="https://www.prequel.agency/#contact"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "var(--accent)",
              textDecoration: "none",
              fontWeight: 500,
            }}
          >
            Get in touch &rarr;
          </a>
        </p>
      </div>

      <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
        <SecondaryButton onClick={onBack}>&larr; Back</SecondaryButton>
        <SecondaryButton onClick={onRestart}>Start over</SecondaryButton>
        <ShareMenu answers={answers} outcome={outcome} />
      </div>
      <Footer full />
    </div>
  );
}

// ─── Main App ──────────────────────────────────────────────────

type Screen = "welcome" | "quiz" | "results";

export default function Home() {
  const [screen, setScreen] = useState<Screen>("welcome");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [outcome, setOutcome] = useState<DecisionOutcome | null>(null);
  const [answerHistory, setAnswerHistory] = useState<string[]>([]);
  const quizStartTimeRef = useRef<number | null>(null);

  // If the page loads with answer query params, jump straight to the
  // matching results so shared links work.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const parsed: Record<string, string> = {};
    for (const q of decisionTreeQuestions) {
      const v = params.get(q.id);
      if (v && q.options.some((o) => o.value === v)) {
        parsed[q.id] = v;
      }
    }
    if (Object.keys(parsed).length === 0) return;

    const applicable = decisionTreeQuestions.filter(
      (q) => !q.condition || q.condition(parsed)
    );
    const allAnswered = applicable.every((q) => parsed.hasOwnProperty(q.id));
    if (!allAnswered) return;

    setAnswers(parsed);
    setAnswerHistory(applicable.map((q) => q.id));
    setOutcome(getOutcome(parsed));
    setScreen("results");
    trackEvent("Shared Result Viewed");
  }, []);

  const handleQuizAnswer = useCallback(
    (questionId: string, value: string) => {
      const newAnswers = { ...answers, [questionId]: value };
      setAnswers(newAnswers);
      setAnswerHistory((prev) => [...prev, questionId]);

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

        const durationSeconds = quizStartTimeRef.current
          ? Math.round((Date.now() - quizStartTimeRef.current) / 1000)
          : 0;
        trackEvent("Outcome Reached", {
          name_recommendation: result.nameRecommendation,
          architecture: result.architectureRecommendation,
          role: newAnswers.architecture_model ?? "unknown",
          duration_seconds: durationSeconds,
        });
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

  const restart = useCallback(() => {
    trackEvent("Restart");
    setScreen("welcome");
    setAnswers({});
    setOutcome(null);
    setAnswerHistory([]);
    quizStartTimeRef.current = null;
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
      <Header />

      {screen === "welcome" && (
        <WelcomeScreen
          onStart={() => {
            trackEvent("Quiz Started");
            quizStartTimeRef.current = Date.now();
            setScreen("quiz");
          }}
        />
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
          answers={answers}
          onRestart={restart}
          onBack={() => {
            if (answerHistory.length === 0) return;
            trackEvent("Back From Results");
            const newHistory = [...answerHistory];
            const lastId = newHistory.pop()!;
            const newAnswers = { ...answers };
            delete newAnswers[lastId];
            setAnswers(newAnswers);
            setAnswerHistory(newHistory);
            setScreen("quiz");
            setOutcome(null);
          }}
        />
      )}
    </div>
  );
}
