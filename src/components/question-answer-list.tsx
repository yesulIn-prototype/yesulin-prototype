type QuestionAnswer = {
  id: string;
  question: string;
};

export function QuestionAnswerList({
  questions,
  answers,
}: {
  questions: QuestionAnswer[];
  answers: Record<string, string>;
}) {
  return (
    <dl className="space-y-3">
      {questions.map((question, index) => {
        const answer = answers[question.id];

        return (
          <div
            key={question.id}
            className="overflow-hidden rounded-xl border border-border bg-secondary/30"
          >
            <dt className="flex items-start gap-3 p-4">
              <span className="inline-flex h-6 min-w-6 shrink-0 items-center justify-center rounded-md bg-primary text-[11px] font-bold text-primary-foreground">
                Q
              </span>
              <span className="min-w-0">
                <span className="block text-[11px] font-semibold text-muted-foreground">
                  질문 {index + 1}
                </span>
                <span className="mt-1 block text-sm font-semibold leading-6 text-foreground">
                  {question.question}
                </span>
              </span>
            </dt>
            <dd className="flex items-start gap-3 border-t border-border bg-card p-4">
              <span className="inline-flex h-6 min-w-6 shrink-0 items-center justify-center rounded-md bg-gold text-[11px] font-bold text-gold-foreground">
                A
              </span>
              <span className="min-w-0">
                <span className="block text-[11px] font-semibold text-muted-foreground">답변</span>
                <span
                  className={`mt-1 block whitespace-pre-wrap text-sm leading-6 ${
                    answer ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {answer || "미응답"}
                </span>
              </span>
            </dd>
          </div>
        );
      })}
    </dl>
  );
}
