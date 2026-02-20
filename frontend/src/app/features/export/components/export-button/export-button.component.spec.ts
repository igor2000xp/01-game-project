import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { describe, beforeEach, it, expect, vi } from 'vitest';
import { ExportButtonComponent } from './export-button.component';

describe('ExportButtonComponent', () => {
  let component: ExportButtonComponent;
  let fixture: ComponentFixture<ExportButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExportButtonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ExportButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('opens format dropdown when export button is clicked', () => {
    const button = fixture.debugElement.query(By.css('[data-cy="export-button"]'))
      .nativeElement as HTMLButtonElement;

    button.click();
    fixture.detectChanges();

    expect(component.isDropdownOpen()).toBe(true);
    expect(fixture.debugElement.query(By.css('[data-cy="format-option"]'))).toBeTruthy();
  });

  it('emits selected export format and closes dropdown', () => {
    const exportSpy = vi.spyOn(component.export, 'emit');
    component.isDropdownOpen.set(true);
    fixture.detectChanges();

    const options = fixture.debugElement.queryAll(By.css('[data-cy="format-option"]'));
    (options[0].nativeElement as HTMLButtonElement).click();
    fixture.detectChanges();

    expect(exportSpy).toHaveBeenCalledWith('csv');
    expect(component.isDropdownOpen()).toBe(false);
  });
});
