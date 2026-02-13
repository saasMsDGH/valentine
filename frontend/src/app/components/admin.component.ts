import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { TenantService } from '../services/tenant.service';
import { QUESTIONS } from '../data/questions';

interface VariantEdit {
  text: string;
  yesLabel1?: string;
  yesLabel2?: string;
}

interface QuestionEdit {
  id: string;
  variants: VariantEdit[];
  bureauMessages: string[];
}

interface TenantConfig {
  tenant: string;
  questions: QuestionEdit[];
  photos: string[];
}

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="page" style="justify-content: flex-start; padding-top: 24px;">
      <div class="container" style="max-width: 680px;">
        <div class="bd-panel fade-in">
          <!-- Header -->
          <div class="cupidon">
            <div class="cupidon-avatar">\u2699\uFE0F</div>
            <div class="cupidon-label">ADMIN \u2014 {{ tenant.displayName() }}</div>
          </div>

          @if (loading()) {
            <div class="text-center" style="padding: 32px 0;">
              <p>Chargement de la configuration...</p>
            </div>
          } @else {
            <!-- Tabs -->
            <div class="admin-tabs">
              <button
                class="admin-tab"
                [class.active]="activeTab() === 'questions'"
                (click)="activeTab.set('questions')"
              >
                \uD83D\uDCCB Questions
              </button>
              <button
                class="admin-tab"
                [class.active]="activeTab() === 'photos'"
                (click)="activeTab.set('photos')"
              >
                \uD83D\uDCF7 Photos
              </button>
            </div>

            <!-- Questions tab -->
            @if (activeTab() === 'questions') {
              <div class="admin-section">
                <div class="speech-bubble" style="margin-bottom: 16px;">
                  <p style="font-size: 0.9rem;">
                    Modifiez le texte des questions. Utilisez <code>{{'{'}}prenom{{'}'}}</code>
                    pour ins\u00E9rer le pr\u00E9nom du destinataire.
                  </p>
                </div>

                @for (q of editableQuestions(); track q.id; let i = $index) {
                  <details class="question-editor">
                    <summary>Q{{ i + 1 }} \u2014 {{ q.id }}</summary>
                    <div class="question-fields">
                      @for (v of q.variants; track $index; let vi = $index) {
                        <label class="field-label">Variante {{ vi + 1 }} :</label>
                        <textarea
                          rows="2"
                          [(ngModel)]="v.text"
                          class="admin-textarea"
                        ></textarea>
                        @if (vi === 3) {
                          <div class="inline-fields">
                            <div>
                              <label class="field-label">Label Oui 1 :</label>
                              <input type="text" [(ngModel)]="v.yesLabel1" />
                            </div>
                            <div>
                              <label class="field-label">Label Oui 2 :</label>
                              <input type="text" [(ngModel)]="v.yesLabel2" />
                            </div>
                          </div>
                        }
                      }
                      <div style="margin-top: 12px; padding-top: 8px; border-top: 1px dashed var(--pink-200);">
                        @for (msg of q.bureauMessages; track $index; let mi = $index) {
                          <label class="field-label">Bureau refus niv. {{ mi + 1 }} :</label>
                          <textarea
                            rows="2"
                            [(ngModel)]="q.bureauMessages[mi]"
                            class="admin-textarea"
                          ></textarea>
                        }
                      </div>
                    </div>
                  </details>
                }
              </div>
            }

            <!-- Photos tab -->
            @if (activeTab() === 'photos') {
              <div class="admin-section">
                <div class="speech-bubble" style="margin-bottom: 16px;">
                  <p style="font-size: 0.9rem;">
                    Ajoutez des photos qui s'afficheront sur la page finale
                    et dans le certificat PDF.
                  </p>
                </div>

                <label class="upload-zone">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    (change)="onPhotosSelected($event)"
                    style="display: none;"
                  />
                  <div class="upload-content">
                    <span style="font-size: 32px;">\uD83D\uDCF7</span>
                    <span>Cliquer pour ajouter des photos</span>
                  </div>
                </label>

                @if (editablePhotos().length > 0) {
                  <div class="photos-admin-grid mt-16">
                    @for (photo of editablePhotos(); track $index; let pi = $index) {
                      <div class="photo-admin-item">
                        <img [src]="photo" alt="Photo {{ pi + 1 }}" />
                        <button class="photo-delete-btn" (click)="removePhoto(pi)">
                          \u2715
                        </button>
                      </div>
                    }
                  </div>
                } @else {
                  <p class="text-center" style="color: var(--pink-400); margin-top: 16px;">
                    Aucune photo pour le moment.
                  </p>
                }
              </div>
            }

            <!-- Save button -->
            <button
              class="btn btn-primary mt-24"
              (click)="save()"
              [disabled]="saving()"
              style="width: 100%;"
            >
              @if (saving()) {
                Sauvegarde en cours...
              } @else {
                Sauvegarder la configuration \u2705
              }
            </button>

            @if (saveMessage()) {
              <p
                class="text-center mt-12"
                [style.color]="saveError() ? 'var(--red-600)' : 'var(--pink-500)'"
              >
                {{ saveMessage() }}
              </p>
            }
          }
        </div>
      </div>
    </div>
  `,
  styles: `
    .admin-tabs {
      display: flex;
      gap: 8px;
      margin-bottom: 20px;
    }
    .admin-tab {
      flex: 1;
      padding: 10px;
      font-family: var(--font-heading);
      font-size: 1rem;
      letter-spacing: 1px;
      border: var(--border);
      border-radius: var(--radius);
      cursor: pointer;
      background: var(--white);
      transition: background 0.15s;
    }
    .admin-tab.active {
      background: var(--pink-100);
    }
    .admin-section {
      margin-top: 8px;
    }
    .question-editor {
      margin-bottom: 10px;
      border: var(--border);
      border-radius: var(--radius);
      padding: 12px;
      background: var(--white);
    }
    .question-editor[open] {
      background: var(--pink-50);
    }
    .question-editor summary {
      font-family: var(--font-heading);
      font-size: 1rem;
      cursor: pointer;
      letter-spacing: 0.5px;
    }
    .question-fields {
      margin-top: 12px;
    }
    .field-label {
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--pink-500);
      display: block;
      margin-top: 8px;
      margin-bottom: 2px;
    }
    .admin-textarea {
      width: 100%;
      padding: 8px 12px;
      font-family: var(--font-body);
      font-size: 0.95rem;
      border: var(--border);
      border-radius: var(--radius);
      resize: vertical;
      min-height: 44px;
    }
    .inline-fields {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
    }
    .upload-zone {
      display: block;
      border: 2px dashed var(--pink-300);
      border-radius: var(--radius);
      padding: 24px;
      text-align: center;
      cursor: pointer;
      transition: background 0.15s;
    }
    .upload-zone:hover {
      background: var(--pink-50);
    }
    .upload-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      font-family: var(--font-body);
      color: var(--pink-400);
    }
    .photos-admin-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
      gap: 10px;
    }
    .photo-admin-item {
      position: relative;
      border: var(--border);
      border-radius: var(--radius);
      overflow: hidden;
    }
    .photo-admin-item img {
      width: 100%;
      height: 120px;
      object-fit: cover;
      display: block;
    }
    .photo-delete-btn {
      position: absolute;
      top: 4px;
      right: 4px;
      width: 26px;
      height: 26px;
      min-height: auto;
      padding: 0;
      border-radius: 50%;
      background: var(--red-600);
      color: white;
      border: none;
      font-size: 14px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    }
  `,
})
export class AdminComponent implements OnInit {
  tenant = inject(TenantService);
  private http = inject(HttpClient);

  loading = signal(true);
  saving = signal(false);
  saveMessage = signal('');
  saveError = signal(false);
  activeTab = signal<'questions' | 'photos'>('questions');

  editableQuestions = signal<QuestionEdit[]>([]);
  editablePhotos = signal<string[]>([]);

  ngOnInit(): void {
    this.loadConfig();
  }

  private loadConfig(): void {
    this.http.get<TenantConfig>('/api/config').subscribe({
      next: (config) => {
        this.editableQuestions.set(this.mergeQuestions(config.questions || []));
        this.editablePhotos.set(config.photos || []);
        this.loading.set(false);
      },
      error: () => {
        this.editableQuestions.set(this.mergeQuestions([]));
        this.editablePhotos.set([]);
        this.loading.set(false);
      },
    });
  }

  private mergeQuestions(overrides: QuestionEdit[]): QuestionEdit[] {
    return QUESTIONS.map((defaultQ) => {
      const override = overrides.find((o) => o.id === defaultQ.id);
      return {
        id: defaultQ.id,
        variants: defaultQ.variants.map((v, i) => ({
          text: override?.variants?.[i]?.text || v.text,
          yesLabel1: override?.variants?.[i]?.yesLabel1 || v.yesLabel1,
          yesLabel2: override?.variants?.[i]?.yesLabel2 || v.yesLabel2,
        })),
        bureauMessages: defaultQ.bureauMessages.map(
          (m, i) => override?.bureauMessages?.[i] || m
        ),
      };
    });
  }

  onPhotosSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;
    Array.from(input.files).forEach((file) => this.resizeAndAddPhoto(file));
    input.value = '';
  }

  private resizeAndAddPhoto(file: File): void {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const MAX_SIZE = 800;
        let w = img.width;
        let h = img.height;
        if (w > MAX_SIZE || h > MAX_SIZE) {
          const ratio = Math.min(MAX_SIZE / w, MAX_SIZE / h);
          w = Math.round(w * ratio);
          h = Math.round(h * ratio);
        }
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(img, 0, 0, w, h);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        this.editablePhotos.update((p) => [...p, dataUrl]);
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  removePhoto(index: number): void {
    this.editablePhotos.update((p) => p.filter((_, i) => i !== index));
  }

  save(): void {
    this.saving.set(true);
    this.saveMessage.set('');
    this.saveError.set(false);

    const payload = {
      questions: this.editableQuestions(),
      photos: this.editablePhotos(),
    };

    this.http.put('/api/config', payload).subscribe({
      next: () => {
        this.saving.set(false);
        this.saveMessage.set('Configuration sauvegard\u00E9e !');
      },
      error: () => {
        this.saving.set(false);
        this.saveError.set(true);
        this.saveMessage.set('Erreur lors de la sauvegarde.');
      },
    });
  }
}
