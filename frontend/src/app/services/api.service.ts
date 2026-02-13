import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TenantService } from './tenant.service';
import { QuizService } from './quiz.service';

export interface ContractData {
  name: string;
  nickname: string;
  romanticLevel: number;
  bonusCompliment: boolean;
  bonusSurprise: boolean;
  bonusDate: boolean;
  stamp: string;
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);
  private tenant = inject(TenantService);
  private quiz = inject(QuizService);

  readonly contractData = signal<ContractData | null>(null);
  readonly signatureData = signal<string>('');
  readonly submitted = signal(false);
  readonly submissionId = signal<string>('');

  setContract(data: ContractData): void {
    this.contractData.set(data);
  }

  setSignature(data: string): void {
    this.signatureData.set(data);
  }

  setSubmissionId(id: string): void {
    this.submissionId.set(id);
  }

  submit() {
    const payload = {
      tenant: this.tenant.tenant(),
      answers: this.quiz.answers(),
      contract: this.contractData(),
      signature: this.signatureData(),
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
    };
    return this.http.post<{ success: boolean; id: string }>(
      '/api/submit',
      payload
    );
  }
}
