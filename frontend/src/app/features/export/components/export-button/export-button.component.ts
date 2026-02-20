import { Component, output, signal } from '@angular/core';
import { ExportFormat } from '../../models/export.model';

@Component({
  selector: 'app-export-button',
  standalone: true,
  templateUrl: './export-button.component.html',
  styleUrl: './export-button.component.css',
})
export class ExportButtonComponent {
  export = output<ExportFormat>();

  isDropdownOpen = signal(false);

  readonly formats: { value: ExportFormat; label: string }[] = [
    { value: 'csv', label: 'CSV' },
    { value: 'json', label: 'JSON' },
  ];

  toggleDropdown(): void {
    this.isDropdownOpen.update((open: boolean) => !open);
  }

  onExport(format: ExportFormat): void {
    this.export.emit(format);
    this.isDropdownOpen.set(false);
  }

  closeDropdown(): void {
    this.isDropdownOpen.set(false);
  }
}
