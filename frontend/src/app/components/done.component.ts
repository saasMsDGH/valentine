import { Component, inject, OnInit, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
            <div class="stamp stamp-valid big-stamp">VALID\u00C9</div>
          </div>

          <!-- Cupidon -->
          <div class="cupidon">
            <div class="cupidon-avatar">\uD83C\uDFF9</div>
            <div class="cupidon-label">GUICHET N\u00B07 \u2014 DOSSIER FINALIS\u00C9</div>
          </div>

          <div class="speech-bubble">
            <p>
              Dossier finalis\u00E9 \u2705<br /><br />
              <strong>{{ tenant.displayName() }}</strong
              >, vous \u00EAtes officiellement ma Valentine.<br /><br />
              Bienvenue dans l'\u00E9quipe.<br />
              <span class="detail"
                >(Caf\u00E9 et bisous non contractuels mais probables.)</span
              >
            </p>
          </div>

          <!-- Contract summary -->
          @if (api.contractData(); as contract) {
            <div class="contract-summary mt-16">
              <h2 class="text-center">R\u00E9capitulatif</h2>
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

          <!-- PDF Download -->
          <!-- @if (api.submissionId()) {
            <button class="btn btn-primary mt-24" (click)="downloadPdf()">
              T\u00E9l\u00E9charger le certificat PDF \uD83D\uDCC4
            </button>
          } -->

          <!-- Photos gallery -->
          @if (photos().length > 0) {
            <div class="photos-section mt-24">
              <h3 class="text-center">Nos souvenirs \uD83D\uDCF7</h3>
              <div class="photos-grid">
                @for (photo of photos(); track $index) {
                  <div class="photo-item pop-in">
                    <img [src]="photo" alt="Photo souvenir" />
                  </div>
                }
              </div>
            </div>
          }

          <!-- Surprise -->
          @if (!showSurprise()) {
            <button
              class="btn btn-primary mt-24"
              (click)="showSurprise.set(true)"
            >
              Voir la surprise \uD83C\uDF81
            </button>
          } @else {
            <div class="surprise-box mt-24 pop-in">
              <div class="surprise-emoji">\uD83D\uDC9D</div>
              <p class="surprise-text">
                {{ tenant.displayName() }},<br />
                tu es la plus belle chose qui me soit arriv\u00E9e.<br />
                Merci d'exister. Merci d'\u00EAtre toi.<br /><br />
                Joyeuse Saint-Valentin \uD83D\uDC98
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
    .photos-section h3 {
      font-family: var(--font-heading);
      letter-spacing: 1px;
      margin-bottom: 12px;
    }
    .photos-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
      gap: 10px;
    }
    .photo-item {
      border: var(--border);
      border-radius: var(--radius);
      overflow: hidden;
      box-shadow: var(--shadow-sm);
    }
    .photo-item img {
      width: 100%;
      height: auto;
      display: block;
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
  private http = inject(HttpClient);

  showSurprise = signal(false);
  hearts = signal<Heart[]>([]);
  photos = signal<string[]>([]);

  ngOnInit(): void {
    this.generateHearts();
    this.loadPhotos();
  }

  romanticStars(level: number): string {
    return '\uD83D\uDC97'.repeat(level) + '\uD83E\uDD0D'.repeat(5 - level);
  }

  downloadPdf(): void {
    const id = this.api.submissionId();
    if (!id) return;
    window.open(`/api/submission/${id}/pdf`, '_blank');
  }

  private loadPhotos(): void {
    this.http
      .get<{ tenant: string; questions: unknown[]; photos: string[] }>('/api/config')
      .subscribe({
        next: (config) => {
          if (config.photos?.length) {
            this.photos.set(config.photos);
          }
        },
        error: () => {
          /* no config = no photos */
        },
      });
  }

  private generateHearts(): void {
    const emojis = ['\uD83D\uDC95', '\uD83D\uDC96', '\uD83D\uDC98', '\u2764\uFE0F', '\uD83D\uDC97', '\uD83C\uDF39', '\u2728'];
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
