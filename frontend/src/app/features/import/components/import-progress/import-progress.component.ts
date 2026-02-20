import { Component, input, computed } from '@angular/core';
import { ImportProgress, ImportError } from '../../models/import.model';

@Component({
  selector: 'app-import-progress',
  standalone: true,
  templateUrl: './import-progress.component.html',
  styleUrl: './import-progress.component.css',
})
export class ImportProgressComponent {
  progress = input.required<ImportProgress>();

  readonly progressPercent = computed(() => {
    const total = this.progress().total;
    const processed = this.progress().processed;
    return total > 0 ? Math.round((processed / total) * 100) : 0;
  });

  readonly isComplete = computed(() => {
    return this.progress().status === 'completed' || this.progress().status === 'failed';
  });

  readonly statusText = computed(() => {
    const status = this.progress().status;
    const statusMap: Record<ImportProgress['status'], string> = {
      pending: 'Pending',
      processing: 'Processing...',
      completed: 'Completed',
      failed: 'Failed',
    };
    return statusMap[status];
  });

  readonly statusClass = computed(() => {
    const status = this.progress().status;
    return `status-${status}`;
  });

  readonly hasErrors = computed(() => {
    return this.progress().errors.length > 0;
  });

  trackError(index: number, error: ImportError): string {
    return `${index}-${error.message}`;
  }
}
