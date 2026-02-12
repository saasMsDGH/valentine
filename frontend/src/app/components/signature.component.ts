import {
  Component,
  inject,
  signal,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TenantService } from '../services/tenant.service';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-signature',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="page">
      <div class="container">
        <div class="bd-panel fade-in">
          <!-- Header -->
          <div class="cupidon">
            <div class="cupidon-avatar">✍️</div>
            <div class="cupidon-label">GUICHET N°7 — SIGNATURE</div>
          </div>

          <div class="speech-bubble">
            <p>Pour finaliser, votre signature s'il vous plaît !</p>
          </div>

          <!-- Canvas signature -->
          <label>Signez ici (doigt ou souris) :</label>
          <div class="canvas-wrapper">
            <canvas
              #signatureCanvas
              width="380"
              height="180"
              (mousedown)="startDraw($event)"
              (mousemove)="draw($event)"
              (mouseup)="stopDraw()"
              (mouseleave)="stopDraw()"
              (touchstart)="startDrawTouch($event)"
              (touchmove)="drawTouch($event)"
              (touchend)="stopDraw()"
            ></canvas>
          </div>
          <button
            class="btn btn-no mt-12"
            style="width:100%"
            (click)="clearCanvas()"
          >
            Effacer
          </button>

          <!-- Text alternative -->
          <label class="mt-16">Ou signez en texte :</label>
          <input
            type="text"
            [(ngModel)]="textSignature"
            [placeholder]="'/s/ ' + tenant.displayName()"
          />

          <!-- Stamp animation preview -->
          @if (api.contractData(); as contract) {
            <div class="stamp-preview mt-20 text-center">
              <div class="stamp pop-in">{{ contract.stamp }}</div>
            </div>
          }

          <!-- Submit -->
          <button
            class="btn btn-primary mt-24"
            (click)="submit()"
            [disabled]="submitting()"
          >
            @if (submitting()) {
              Envoi en cours…
            } @else {
              Valider la signature ✍️
            }
          </button>

          @if (error()) {
            <p class="error mt-12">{{ error() }}</p>
          }
        </div>
      </div>
    </div>
  `,
  styles: `
    .stamp-preview {
      margin-top: 16px;
    }
    .error {
      color: var(--red-600);
      text-align: center;
      font-size: 0.9rem;
    }
    button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  `,
})
export class SignatureComponent implements AfterViewInit {
  tenant = inject(TenantService);
  api = inject(ApiService);
  private router = inject(Router);

  @ViewChild('signatureCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  textSignature = '';
  submitting = signal(false);
  error = signal('');

  private ctx!: CanvasRenderingContext2D;
  private isDrawing = false;
  private lastX = 0;
  private lastY = 0;
  private hasDrawn = false;

  ngAfterViewInit(): void {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d')!;
    this.ctx.strokeStyle = '#2b2d42';
    this.ctx.lineWidth = 2.5;
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';
  }

  /* ─── Mouse events ─── */
  startDraw(e: MouseEvent): void {
    this.isDrawing = true;
    const pos = this.getMousePos(e);
    this.lastX = pos.x;
    this.lastY = pos.y;
  }

  draw(e: MouseEvent): void {
    if (!this.isDrawing) return;
    const pos = this.getMousePos(e);
    this.drawLine(this.lastX, this.lastY, pos.x, pos.y);
    this.lastX = pos.x;
    this.lastY = pos.y;
    this.hasDrawn = true;
  }

  stopDraw(): void {
    this.isDrawing = false;
  }

  /* ─── Touch events ─── */
  startDrawTouch(e: TouchEvent): void {
    e.preventDefault();
    const pos = this.getTouchPos(e);
    this.isDrawing = true;
    this.lastX = pos.x;
    this.lastY = pos.y;
  }

  drawTouch(e: TouchEvent): void {
    e.preventDefault();
    if (!this.isDrawing) return;
    const pos = this.getTouchPos(e);
    this.drawLine(this.lastX, this.lastY, pos.x, pos.y);
    this.lastX = pos.x;
    this.lastY = pos.y;
    this.hasDrawn = true;
  }

  /* ─── Helpers ─── */
  private drawLine(x1: number, y1: number, x2: number, y2: number): void {
    this.ctx.beginPath();
    this.ctx.moveTo(x1, y1);
    this.ctx.lineTo(x2, y2);
    this.ctx.stroke();
  }

  private getMousePos(e: MouseEvent) {
    const rect = this.canvasRef.nativeElement.getBoundingClientRect();
    const scaleX = this.canvasRef.nativeElement.width / rect.width;
    const scaleY = this.canvasRef.nativeElement.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  }

  private getTouchPos(e: TouchEvent) {
    const touch = e.touches[0];
    const rect = this.canvasRef.nativeElement.getBoundingClientRect();
    const scaleX = this.canvasRef.nativeElement.width / rect.width;
    const scaleY = this.canvasRef.nativeElement.height / rect.height;
    return {
      x: (touch.clientX - rect.left) * scaleX,
      y: (touch.clientY - rect.top) * scaleY,
    };
  }

  clearCanvas(): void {
    const canvas = this.canvasRef.nativeElement;
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);
    this.hasDrawn = false;
  }

  /* ─── Submit ─── */
  submit(): void {
    this.error.set('');

    let signatureValue = '';

    if (this.hasDrawn) {
      signatureValue = this.canvasRef.nativeElement.toDataURL('image/png');
    } else if (this.textSignature.trim()) {
      signatureValue = `text:${this.textSignature.trim()}`;
    } else {
      this.error.set('Veuillez signer (dessin ou texte) avant de valider.');
      return;
    }

    this.api.setSignature(signatureValue);
    this.submitting.set(true);

    this.api.submit().subscribe({
      next: () => {
        this.api.submitted.set(true);
        this.router.navigate(['/done']);
      },
      error: () => {
        this.submitting.set(false);
        this.error.set(
          'Erreur lors de l\'envoi. Pas de panique, Cupidon réessaie…'
        );
      },
    });
  }
}
