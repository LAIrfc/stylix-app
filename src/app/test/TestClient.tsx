"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useAuth } from "@/lib/auth/AuthContext";
import {
  evaluateJmti,
  jmtiBasis,
  jmtiQuestions,
  storeIdentityAnswers,
  zodiacLabels,
  zodiacSigns,
  type IdentityAnswers,
  type JmtiDimension,
  type ZodiacSign,
} from "@/lib/identity/engine";
import type { OccasionTag, StyleTag } from "@/lib/types/product";

type AnswerChoice = "A" | "B";

const steps: { dimension: JmtiDimension; label: string; title: string; note: string }[] = [
  { dimension: "LO", label: "理性 / 情绪", title: "你买珠宝时更看重价值，还是心动？", note: "第 1-8 题，判断 L 理性保值或 O 情绪审美。" },
  { dimension: "MT", label: "日常 / 仪式", title: "你的珠宝更像日常护身符，还是重要时刻的开场？", note: "第 9-15 题，判断 M 日常常戴或 T 仪式佩戴。" },
  { dimension: "AS", label: "小众 / 经典", title: "你更偏向设计师感，还是经得起时间的经典？", note: "第 16-22 题，判断 A 小众设计或 S 经典大众。" },
  { dimension: "DG", label: "低调 / 亮眼", title: "你希望光芒被慢慢发现，还是一眼被看见？", note: "第 23-30 题，判断 D 低调内敛或 G 亮眼吸睛。" },
];

const occasions: { value: OccasionTag; label: string }[] = [
  { value: "work", label: "工作通勤" },
  { value: "black-tie", label: "正式晚宴" },
  { value: "wedding guest", label: "婚礼宾客" },
  { value: "date night", label: "约会夜晚" },
  { value: "casual brunch", label: "周末聚会" },
  { value: "holiday gift", label: "节日送礼" },
];

const styles: { value: StyleTag; label: string }[] = [
  { value: "classic", label: "经典" },
  { value: "bold", label: "强存在感" },
  { value: "celestial", label: "星月灵感" },
  { value: "romantic", label: "浪漫柔和" },
  { value: "minimal", label: "极简" },
  { value: "elegant", label: "精致优雅" },
];

function OptionButton({ active, children, onClick }: { active: boolean; children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={"border px-4 py-3 text-left transition-colors " + (active ? "border-gold bg-gold/10 text-gold" : "border-ivory/12 bg-ivory/[0.03] text-ivory/62 hover:border-gold/35 hover:text-ivory")}
    >
      {children}
    </button>
  );
}

export function TestClient() {
  const router = useRouter();
  const { user, register } = useAuth();
  const [step, setStep] = useState(0);
  const [responses, setResponses] = useState<Record<number, AnswerChoice>>({});
  const [zodiac, setZodiac] = useState<ZodiacSign>("Pisces");
  const [occasion, setOccasion] = useState<OccasionTag>("date night");
  const [style, setStyle] = useState<StyleTag>("elegant");
  const [budgetMax, setBudgetMax] = useState(500);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);

  const activeStep = steps[step];
  const activeQuestions = useMemo(
    () => jmtiQuestions.filter((question) => question.dimension === activeStep.dimension),
    [activeStep.dimension],
  );
  const answeredInStep = activeQuestions.filter((question) => responses[question.id]).length;
  const stepComplete = answeredInStep === activeQuestions.length;
  const needsRegistration = step === 0 && stepComplete && !user;
  const answeredTotal = Object.keys(responses).length;

  function choose(questionId: number, answer: AnswerChoice) {
    setResponses((current) => ({ ...current, [questionId]: answer }));
  }

  async function createProfile(e: React.FormEvent) {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError(null);
    const result = await register(email, password, name || "Stylix Member");
    setAuthLoading(false);
    if (!result.ok) {
      setAuthError("请输入有效邮箱，并设置至少 6 位密码。");
      return;
    }
    setStep(1);
  }

  function nextStep() {
    if (!stepComplete) return;
    if (step < steps.length - 1) setStep((value) => value + 1);
  }

  function finish() {
    if (answeredTotal !== jmtiQuestions.length) return;
    const result = evaluateJmti(responses);
    const answers: IdentityAnswers = {
      jmtiCode: result.code,
      jmtiScores: result.scores,
      matchPercent: result.matchPercent,
      zodiac,
      occasion,
      style,
      budgetMax,
      email: user?.email ?? email,
      name: user?.name ?? name,
    };
    storeIdentityAnswers(answers);
    router.push("/result");
  }

  return (
    <div className="min-h-screen bg-ink-deep pt-16">
      <div className="mx-auto max-w-7xl px-6 py-14 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-[340px_1fr]">
          <aside className="border border-ivory/10 bg-ink-soft/25 p-6 lg:sticky lg:top-24 lg:h-fit">
            <p className="text-[10px] uppercase tracking-[0.4em] text-gold/70">JMTI 珠宝人格测试</p>
            <h1 className="mt-4 font-serif text-4xl leading-tight text-ivory">生成你的今日珠宝身份。</h1>
            <div className="mt-8 space-y-4">
              {steps.map((item, index) => (
                <button key={item.dimension} type="button" onClick={() => setStep(index)} className="flex w-full items-center gap-3 text-left">
                  <span className={"flex h-7 w-7 items-center justify-center border text-[10px] " + (step >= index ? "border-gold text-gold" : "border-ivory/15 text-ivory/30")}>{index + 1}</span>
                  <span className={step >= index ? "text-sm text-ivory" : "text-sm text-ivory/35"}>{item.label}</span>
                </button>
              ))}
            </div>
            <div className="mt-8 border-t border-ivory/10 pt-6">
              <p className="text-[10px] uppercase tracking-[0.32em] text-gold/70">测试依据</p>
              <div className="mt-4 space-y-3 text-xs leading-6 text-ivory/55">
                {jmtiBasis.map((item) => (
                  <p key={item}>{item}</p>
                ))}
              </div>
            </div>
          </aside>

          <main className="min-h-[620px] border border-ivory/10 bg-ink-soft/20 p-6 sm:p-8 lg:p-10">
            <section>
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.35em] text-gold/70">Part {step + 1}</p>
                  <h2 className="mt-3 font-serif text-3xl text-ivory">{activeStep.title}</h2>
                  <p className="mt-3 max-w-2xl text-sm leading-7 text-ivory/55">{activeStep.note}</p>
                </div>
                <p className="text-sm text-ivory/45">{answeredInStep} / {activeQuestions.length}</p>
              </div>

              <div className="mt-8 grid gap-4">
                {activeQuestions.map((question) => (
                  <article key={question.id} className="border border-ivory/10 bg-ink-deep/35 p-4">
                    <p className="text-sm leading-6 text-ivory">{question.id}. {question.prompt}</p>
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      <OptionButton active={responses[question.id] === "A"} onClick={() => choose(question.id, "A")}>
                        <p className="text-xs text-current/45">A</p>
                        <p className="mt-1 text-sm leading-6">{question.optionA.text}</p>
                      </OptionButton>
                      <OptionButton active={responses[question.id] === "B"} onClick={() => choose(question.id, "B")}>
                        <p className="text-xs text-current/45">B</p>
                        <p className="mt-1 text-sm leading-6">{question.optionB.text}</p>
                      </OptionButton>
                    </div>
                  </article>
                ))}
              </div>

              {needsRegistration && (
                <form onSubmit={createProfile} className="mt-10 max-w-xl border border-gold/20 bg-gold/5 p-6">
                  <p className="text-[10px] uppercase tracking-[0.35em] text-gold/70">保存身份档案</p>
                  <h3 className="mt-2 font-serif text-2xl text-ivory">注册后继续完成 JMTI 测试。</h3>
                  <p className="mt-3 text-sm leading-6 text-ivory/55">档案会保存你的测试结果、预算和推荐记录，后续可用于每日邮件推荐。</p>
                  <div className="mt-5 grid gap-3">
                    <input value={name} onChange={(e) => setName(e.target.value)} placeholder="昵称" className="border border-ivory/12 bg-ink-deep px-4 py-3 text-sm text-ivory outline-none focus:border-gold/50" />
                    <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required placeholder="邮箱" className="border border-ivory/12 bg-ink-deep px-4 py-3 text-sm text-ivory outline-none focus:border-gold/50" />
                    <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" minLength={6} required placeholder="密码" className="border border-ivory/12 bg-ink-deep px-4 py-3 text-sm text-ivory outline-none focus:border-gold/50" />
                  </div>
                  {authError && <p className="mt-3 text-xs text-red-400">{authError}</p>}
                  <button disabled={authLoading} className="mt-5 bg-gold px-7 py-3 text-[11px] uppercase tracking-[0.23em] text-ink-deep disabled:opacity-50">
                    {authLoading ? "创建中..." : "创建档案"}
                  </button>
                </form>
              )}

              {!needsRegistration && step < steps.length - 1 && (
                <button type="button" disabled={!stepComplete} onClick={nextStep} className="mt-8 bg-gold px-8 py-4 text-[11px] uppercase tracking-[0.25em] text-ink-deep disabled:opacity-40">
                  继续下一部分
                </button>
              )}

              {step === steps.length - 1 && (
                <div className="mt-10 border-t border-ivory/10 pt-8">
                  <p className="text-[10px] uppercase tracking-[0.32em] text-gold/70">补充推荐条件</p>
                  <div className="mt-6 grid gap-8 xl:grid-cols-2">
                    <div>
                      <p className="mb-3 text-[10px] uppercase tracking-[0.28em] text-ivory/40">星座</p>
                      <div className="grid gap-3 sm:grid-cols-3">
                        {zodiacSigns.map((sign) => (
                          <OptionButton key={sign} active={zodiac === sign} onClick={() => setZodiac(sign)}>{zodiacLabels[sign]}</OptionButton>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="mb-3 text-[10px] uppercase tracking-[0.28em] text-ivory/40">今天的场景</p>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {occasions.map((item) => (
                          <OptionButton key={item.value} active={occasion === item.value} onClick={() => setOccasion(item.value)}>{item.label}</OptionButton>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="mb-3 text-[10px] uppercase tracking-[0.28em] text-ivory/40">偏好风格</p>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {styles.map((item) => (
                          <OptionButton key={item.value} active={style === item.value} onClick={() => setStyle(item.value)}>{item.label}</OptionButton>
                        ))}
                      </div>
                    </div>
                    <div className="border border-ivory/10 p-5">
                      <div className="flex justify-between gap-4">
                        <p className="text-[10px] uppercase tracking-[0.28em] text-ivory/40">价格筛选</p>
                        <p className="font-serif text-xl text-gold">{"$" + budgetMax}</p>
                      </div>
                      <input type="range" min={150} max={2500} step={25} value={budgetMax} onChange={(e) => setBudgetMax(Number(e.target.value))} className="mt-5 w-full accent-[#C9A962]" />
                    </div>
                  </div>
                  <button type="button" disabled={!stepComplete} onClick={finish} className="mt-8 bg-gold px-8 py-4 text-[11px] uppercase tracking-[0.25em] text-ink-deep disabled:opacity-40">
                    生成今日身份卡
                  </button>
                </div>
              )}
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}
