import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TenantService } from '../services/tenant.service';

@Component({
  selector: 'app-landing',
  standalone: true,
  template: `
    <div class="page">
      <div class="container">
        <div class="bd-panel pop-in">
          <!-- Cupidon header -->
          <div class="cupidon">
            <div class="cupidon-avatar">🏹</div>
            <div class="cupidon-label">GUICHET N°7 — ADMINISTRATION DU CUPIDON</div>
          </div>

          <!-- Speech bubble -->
          <div class="speech-bubble">
            <p>
              Bonjour <strong>{{ tenant.displayName() }}</strong>.<br><br>
              Votre présence est requise pour l'ouverture d'un dossier
              Saint-Valentin.<br><br>
              <span class="detail">
                Durée : ~ 60 secondes.<br>
                Risque : sourire involontaire.
              </span>
            </p>
          </div>

          <!-- Cupidon character -->
          <div class="cupidon-illustration">
            <div class="cupidon-body">🤵</div>
            <div class="cupidon-props">💘 📋</div>
          </div>

          <!-- CTA -->
          <button class="btn btn-primary mt-20" (click)="start()">
            Ouvrir le dossier 💘
          </button>
        </div>
      </div>
    </div>
  `,
  styles: `
    .cupidon-illustration {
      text-align: center;
      margin: 12px 0 4px;
    }
    .cupidon-body {
      font-size: 64px;
      line-height: 1;
    }
    .cupidon-props {
      font-size: 24px;
      margin-top: 4px;
    }
    .detail {
      font-size: 0.9rem;
      color: var(--pink-500);
    }
  `,
})
export class LandingComponent {
  tenant = inject(TenantService);
  private router = inject(Router);

  start(): void {
    this.router.navigate(['/quiz']);
  }
}
