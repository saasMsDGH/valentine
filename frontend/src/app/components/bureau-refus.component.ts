import { Component, input, output, OnInit } from '@angular/core';

@Component({
  selector: 'app-bureau-refus',
  standalone: true,
  template: `
    <div class="overlay" (click)="dismiss()">
      <div class="overlay-content pop-in">
        <div class="bureau-header">BUREAU DES REFUS</div>
        <div class="bureau-level">Niveau {{ level() }}</div>

        <div class="stamp stamp-refus">REFUS TEMPORAIRE</div>

        <p class="bureau-message">{{ message() }}</p>

        <div class="bureau-paperasse">📄📋🗂️</div>
      </div>
    </div>
  `,
  styles: `
    .bureau-header {
      font-family: var(--font-heading);
      font-size: 1.6rem;
      letter-spacing: 3px;
      color: var(--pink-100);
      margin-bottom: 4px;
    }
    .bureau-level {
      font-family: var(--font-heading);
      font-size: 0.9rem;
      color: var(--pink-200);
      letter-spacing: 2px;
      margin-bottom: 24px;
    }
    .bureau-message {
      margin-top: 24px;
      font-size: 1.15rem;
      color: var(--white);
      max-width: 320px;
      line-height: 1.5;
    }
    .bureau-paperasse {
      margin-top: 20px;
      font-size: 2rem;
      animation: shake 0.5s ease-in-out 0.6s;
    }
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      20% { transform: translateX(-6px); }
      40% { transform: translateX(6px); }
      60% { transform: translateX(-4px); }
      80% { transform: translateX(4px); }
    }
  `,
})
export class BureauRefusComponent implements OnInit {
  level = input.required<number>();
  message = input.required<string>();
  closed = output<void>();

  ngOnInit(): void {
    setTimeout(() => this.dismiss(), 1800);
  }

  dismiss(): void {
    this.closed.emit();
  }
}
