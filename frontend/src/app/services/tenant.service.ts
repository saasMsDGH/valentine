import { Injectable, signal, computed } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TenantService {
  readonly tenant = signal(this.extractTenant());

  readonly displayName = computed(() => {
    const t = this.tenant();
    return t.charAt(0).toUpperCase() + t.slice(1);
  });

  private extractTenant(): string {
    const host = window.location.hostname;
    if (host === 'localhost' || host === '127.0.0.1') return 'demo';
    const firstLabel = host.split('.')[0].toLowerCase();
    return firstLabel || 'demo';
  }
}
