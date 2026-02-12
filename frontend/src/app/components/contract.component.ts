import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TenantService } from '../services/tenant.service';
import { ApiService, ContractData } from '../services/api.service';

@Component({
  selector: 'app-contract',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="page">
      <div class="container">
        <div class="bd-panel fade-in">
          <!-- Header -->
          <div class="cupidon">
            <div class="cupidon-avatar">📋</div>
            <div class="cupidon-label">GUICHET N°7</div>
          </div>

          <h2 class="text-center mb-16">
            Contrat Officiel de Saint-Valentin
          </h2>

          <!-- Intro bubble -->
          <div class="speech-bubble">
            <p>
              Parfait. Pour finaliser le dossier, merci de compléter les
              champs suivants.<br />
              <span class="detail"
                >(Ceci est très sérieux, donc… légèrement ridicule.)</span
              >
            </p>
          </div>

          <!-- Form -->
          <div class="form-section">
            <label for="name">Nom du/de la signataire</label>
            <input
              id="name"
              type="text"
              [(ngModel)]="form.name"
              [placeholder]="tenant.displayName()"
            />

            <label for="nickname">Surnom (optionnel)</label>
            <input
              id="nickname"
              type="text"
              [(ngModel)]="form.nickname"
              placeholder="Mon petit chou…"
            />

            <label>Niveau de romantisme : {{ form.romanticLevel }} / 5</label>
            <input
              type="range"
              min="1"
              max="5"
              step="1"
              [(ngModel)]="form.romanticLevel"
            />
            <div class="range-labels">
              <span>1 – Timide</span>
              <span>5 – Flamboyant</span>
            </div>

            <label>Clauses bonus</label>
            <div class="checkbox-group">
              <label>
                <input type="checkbox" [(ngModel)]="form.bonusCompliment" />
                J'accepte un compliment gratuit
              </label>
              <label>
                <input type="checkbox" [(ngModel)]="form.bonusSurprise" />
                J'accepte une surprise (modérée)
              </label>
              <label>
                <input type="checkbox" [(ngModel)]="form.bonusDate" />
                J'accepte un mini date
              </label>
            </div>

            <label>Tampon officiel</label>
            <div class="radio-group">
              @for (option of stampOptions; track option) {
                <label>
                  <input
                    type="radio"
                    name="stamp"
                    [value]="option"
                    [(ngModel)]="form.stamp"
                  />
                  {{ option }}
                </label>
              }
            </div>
          </div>

          <button class="btn btn-primary mt-24" (click)="submit()">
            Passer à la signature ✍️
          </button>
        </div>
      </div>
    </div>
  `,
  styles: `
    .form-section {
      margin-top: 16px;
    }
    .detail {
      font-size: 0.9rem;
      color: var(--pink-500);
    }
    .range-labels {
      display: flex;
      justify-content: space-between;
      font-size: 0.8rem;
      color: var(--pink-500);
      margin-top: 4px;
    }
  `,
})
export class ContractComponent {
  tenant = inject(TenantService);
  private api = inject(ApiService);
  private router = inject(Router);

  stampOptions = ['APPROUVÉ 💘', 'VALIDÉ ✅', 'CUPIDON OK 🏹'];

  form: ContractData = {
    name: this.tenant.displayName(),
    nickname: '',
    romanticLevel: 3,
    bonusCompliment: true,
    bonusSurprise: false,
    bonusDate: false,
    stamp: this.stampOptions[0],
  };

  submit(): void {
    this.api.setContract({ ...this.form });
    this.router.navigate(['/sign']);
  }
}
