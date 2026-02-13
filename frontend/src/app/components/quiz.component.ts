import { Component, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { TenantService } from '../services/tenant.service';
import { QuizService } from '../services/quiz.service';
import { BureauRefusComponent } from './bureau-refus.component';

@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [BureauRefusComponent],
  template: `
    <div class="page">
      <div class="container">
        <!-- Progress bar -->
        <div class="progress-bar">
          <div
            class="progress-bar-fill"
            [style.width.%]="quiz.progress()"
          ></div>
        </div>

        @if (!quiz.isComplete()) {
          <div class="bd-panel slide-in" [class.shake]="shaking()">
            <!-- Header -->
            <div class="cupidon">
              <div class="cupidon-avatar">🏹</div>
              <div class="cupidon-label">GUICHET N°7</div>
            </div>

            <span class="question-number">
              Question {{ quiz.currentIndex() + 1 }} / {{ quiz.questions().length }}
            </span>

            <!-- Speech bubble with question text -->
            <div class="speech-bubble">
              <p>{{ displayText() }}</p>
            </div>

            <!-- Buttons -->
            @if (quiz.isUltimate()) {
              <div class="btn-group">
                <button class="btn btn-yes" (click)="onYes()">
                  {{ quiz.ultimateLabels().label1 }}
                </button>
                <button class="btn btn-yes" (click)="onYes()">
                  {{ quiz.ultimateLabels().label2 }}
                </button>
              </div>
            } @else {
              <div class="btn-group">
                <button class="btn btn-yes" (click)="onYes()">Oui 💘</button>
                <button class="btn btn-no" (click)="onNo()">Non</button>
              </div>
            }
          </div>
        }

        <!-- Validation flash -->
        @if (showValid()) {
          <div class="overlay" style="pointer-events:none;">
            <div class="stamp stamp-valid pop-in">VALIDÉ ✅</div>
          </div>
        }

        <!-- Bureau des refus overlay -->
        @if (showBureau()) {
          <app-bureau-refus
            [level]="bureauLevel()"
            [message]="bureauMessage()"
            (closed)="onBureauClosed()"
          />
        }
      </div>
    </div>
  `,
  styles: `
    :host { display: contents; }
  `,
})
export class QuizComponent {
  private router = inject(Router);
  private tenant = inject(TenantService);
  quiz = inject(QuizService);

  showBureau = signal(false);
  bureauLevel = signal(1);
  bureauMessage = signal('');
  showValid = signal(false);
  shaking = signal(false);

  /** Replace {prenom} placeholder */
  displayText = computed(() =>
    this.quiz
      .currentText()
      .replace(/\{prenom\}/gi, this.tenant.displayName())
  );

  onYes(): void {
    this.flashValid();
    this.quiz.answerYes();

    if (this.quiz.isComplete()) {
      setTimeout(() => this.router.navigate(['/contract']), 400);
    }
  }

  onNo(): void {
    const level = this.quiz.answerNo();
    this.bureauLevel.set(level);
    this.bureauMessage.set(this.quiz.getBureauMessage(level));
    this.showBureau.set(true);
  }

  onBureauClosed(): void {
    this.showBureau.set(false);
    this.triggerShake();
  }

  private flashValid(): void {
    this.showValid.set(true);
    setTimeout(() => this.showValid.set(false), 350);
  }

  private triggerShake(): void {
    this.shaking.set(true);
    setTimeout(() => this.shaking.set(false), 450);
  }
}
