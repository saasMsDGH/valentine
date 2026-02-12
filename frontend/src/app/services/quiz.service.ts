import { Injectable, signal, computed } from '@angular/core';
import { QUESTIONS, Question } from '../data/questions';

@Injectable({ providedIn: 'root' })
export class QuizService {
  readonly questions: Question[] = QUESTIONS;
  readonly currentIndex = signal(0);
  readonly answers = signal<boolean[]>([]);
  readonly nonCounters = signal<number[]>(new Array(QUESTIONS.length).fill(0));

  readonly currentQuestion = computed(() => this.questions[this.currentIndex()]);

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

  readonly progress = computed(() => (this.currentIndex() / this.questions.length) * 100);

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
    return this.answers().length >= this.questions.length;
  }

  reset(): void {
    this.currentIndex.set(0);
    this.answers.set([]);
    this.nonCounters.set(new Array(QUESTIONS.length).fill(0));
  }
}
