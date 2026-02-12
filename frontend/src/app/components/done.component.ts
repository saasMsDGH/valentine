import { Component, inject, OnInit, signal } from '@angular/core';
import { TenantService } from '../services/tenant.service';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-done',
  standalone: true,
  template: `
    <div class="page">
      <div class="container">
        <!-- Floating hearts background -->
        @for (heart of hearts(); track $index) {
          <div
            class="floating-heart"
            [style.left.%]="heart.left"
            [style.animationDuration.s]="heart.duration"
            [style.animationDelay.s]="heart.delay"
            [style.fontSize.px]="heart.size"
          >
            {{ heart.emoji }}
          </div>
        }

        <div class="bd-panel pop-in result-card">
          <!-- Big stamp -->
          <div class="text-center mb-16">
            <div class="stamp stamp-valid big-stamp">VALIDÉ</div>
          </div>

          <!-- Cupidon -->
          <div class="cupidon">
            <div class="cupidon-avatar">🏹</div>
            <div class="cupidon-label">GUICHET N°7 — DOSSIER FINALISÉ</div>
          </div>

          <div class="speech-bubble">
            <p>
              Dossier finalisé ✅<br /><br />
              <strong>{{ tenant.displayName() }}</strong
              >, vous êtes officiellement ma Valentine.<br /><br />
              Bienvenue dans l'équipe.<br />
              <span class="detail"
                >(Café et bisous non contractuels mais probables.)</span
              >
            </p>
          </div>

          <!-- Contract summary -->
          @if (api.contractData(); as contract) {
            <div class="contract-summary mt-16">
              <h2 class="text-center">Récapitulatif</h2>
              <div class="summary-item">
                <span class="summary-label">Signataire :</span>
                {{ contract.name }}
                @if (contract.nickname) {
                  <span class="nickname">({{ contract.nickname }})</span>
                }
              </div>
              <div class="summary-item">
                <span class="summary-label">Romantisme :</span>
                {{ romanticStars(contract.romanticLevel) }}
              </div>
              <div class="summary-item">
                <span class="summary-label">Tampon :</span>
                {{ contract.stamp }}
              </div>
            </div>
          }

          <!-- Surprise -->
          @if (!showSurprise()) {
            <button
              class="btn btn-primary mt-24"
              (click)="showSurprise.set(true)"
            >
              Voir la surprise 🎁
            </button>
          } @else {
            <div class="surprise-box mt-24 pop-in">
              <div class="surprise-emoji">💝</div>
              <p class="surprise-text">
                {{ tenant.displayName() }},<br />
                tu es la plus belle chose qui me soit arrivée.<br />
                Merci d'exister. Merci d'être toi.<br /><br />
                Joyeuse Saint-Valentin 💘
              </p>
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: `
    .result-card {
      position: relative;
      z-index: 2;
    }
    .big-stamp {
      font-size: 2.5rem;
      padding: 12px 32px;
    }
    .detail {
      font-size: 0.9rem;
      color: var(--pink-500);
    }
    .contract-summary {
      background: var(--pink-50);
      border: 2px dashed var(--dark);
      border-radius: var(--radius);
      padding: 16px;
    }
    .summary-item {
      margin-top: 8px;
      font-size: 1rem;
    }
    .summary-label {
      font-family: var(--font-heading);
      letter-spacing: 0.5px;
    }
    .nickname {
      color: var(--pink-500);
      font-style: italic;
    }
    .surprise-box {
      background: linear-gradient(135deg, var(--pink-100), var(--pink-200));
      border: var(--border);
      border-radius: var(--radius-lg);
      padding: 24px;
      text-align: center;
      box-shadow: var(--shadow);
    }
    .surprise-emoji {
      font-size: 56px;
      margin-bottom: 12px;
    }
    .surprise-text {
      font-size: 1.15rem;
      line-height: 1.6;
    }
    .floating-heart {
      position: fixed;
      bottom: -40px;
      z-index: 1;
      pointer-events: none;
      animation: float-heart linear forwards;
    }
    @keyframes float-heart {
      0% {
        transform: translateY(0) rotate(0deg);
        opacity: 1;
      }
      100% {
        transform: translateY(-110vh) rotate(45deg);
        opacity: 0;
      }
    }
  `,
})
export class DoneComponent implements OnInit {
  tenant = inject(TenantService);
  api = inject(ApiService);
  showSurprise = signal(false);
  hearts = signal<Heart[]>([]);

  ngOnInit(): void {
    this.generateHearts();
  }

  romanticStars(level: number): string {
    return '💗'.repeat(level) + '🤍'.repeat(5 - level);
  }

  private generateHearts(): void {
    const emojis = ['💕', '💖', '💘', '❤️', '💗', '🌹', '✨'];
    const result: Heart[] = [];
    for (let i = 0; i < 15; i++) {
      result.push({
        left: Math.random() * 100,
        duration: 3 + Math.random() * 4,
        delay: Math.random() * 5,
        size: 16 + Math.random() * 24,
        emoji: emojis[Math.floor(Math.random() * emojis.length)],
      });
    }
    this.hearts.set(result);
  }
}

interface Heart {
  left: number;
  duration: number;
  delay: number;
  size: number;
  emoji: string;
}
