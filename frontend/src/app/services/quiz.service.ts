import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { QUESTIONS, Question, QuestionVariant } from '../data/questions';

@Injectable({ providedIn: 'root' })
export class QuizService {
  private http = inject(HttpClient);

  readonly questions = signal<Question[]>(QUESTIONS);
  private initialized = false;

  readonly currentIndex = signal(0);
  readonly answers = signal<boolean[]>([]);
  readonly nonCounters = signal<number[]>(new Array(QUESTIONS.length).fill(0));

  readonly currentQuestion = computed(() => this.questions()[this.currentIndex()]);

  readonly currentVariantIndex = computed(() => {
    const counters = this.nonCounters();
    const idx = this.currentIndex();
    const count = counters[idx];
    if (count >= 3) return 3;
    return count;
  });

  readonly currentText = computed(() => {
    const q = this.currentQuestion();
    const vi = this.currentVariantIndex();
    return q.variants[vi].text;
  });

  readonly isUltimate = computed(() => this.currentVariantIndex() >= 3);

  readonly ultimateLabels = computed(() => {
    const q = this.currentQuestion();
    const v = q.variants[3];
    return { label1: v.yesLabel1, label2: v.yesLabel2 };
  });

  readonly progress = computed(() => (this.currentIndex() / this.questions().length) * 100);

  loadCustomQuestions(): void {
    if (this.initialized) return;
    this.initialized = true;

    this.http
      .get<{ questions: any[] }>('/api/config/questions')
      .subscribe({
        next: (data) => {
          if (data.questions?.length) {
            const merged = QUESTIONS.map((defaultQ) => {
              const override = data.questions.find((o: any) => o.id === defaultQ.id);
              if (!override) return defaultQ;
              return {
                ...defaultQ,
                variants: defaultQ.variants.map((v, i) => ({
                  text: override.variants?.[i]?.text || v.text,
                  yesLabel1: override.variants?.[i]?.yesLabel1 || v.yesLabel1,
                  yesLabel2: override.variants?.[i]?.yesLabel2 || v.yesLabel2,
                })) as [QuestionVariant, QuestionVariant, QuestionVariant, QuestionVariant],
                bureauMessages: defaultQ.bureauMessages.map(
                  (m, i) => override.bureauMessages?.[i] || m
                ) as [string, string, string],
              };
            });
            this.questions.set(merged);
          }
        },
        error: () => {
          /* no custom config, use defaults */
        },
      });
  }

  answerYes(): void {
    this.answers.update((a) => [...a, true]);
    this.currentIndex.update((i) => i + 1);
  }

  answerNo(): number {
    const idx = this.currentIndex();
    this.nonCounters.update((c) => {
      const copy = [...c];
      copy[idx]++;
      return copy;
    });
    return this.nonCounters()[idx];
  }

  getBureauMessage(level: number): string {
    const q = this.currentQuestion();
    const msgIdx = Math.min(level - 1, q.bureauMessages.length - 1);
    return q.bureauMessages[msgIdx];
  }

  isComplete(): boolean {
    return this.answers().length >= this.questions().length;
  }

  reset(): void {
    this.currentIndex.set(0);
    this.answers.set([]);
    this.nonCounters.set(new Array(this.questions().length).fill(0));
  }
}
