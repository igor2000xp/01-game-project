import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { describe, beforeEach, it, expect, vi } from 'vitest';
import { CategoryFormComponent } from './category-form.component';

describe('CategoryFormComponent', () => {
  let component: CategoryFormComponent;
  let fixture: ComponentFixture<CategoryFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CategoryFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('disables submit when category name is empty', () => {
    const submitButton = fixture.debugElement.query(By.css('button[type="submit"]'))
      .nativeElement as HTMLButtonElement;

    expect(submitButton.disabled).toBe(true);
    expect(component.isFormValid()).toBe(false);
  });

  it('emits submit with name when form is valid', () => {
    const submitSpy = vi.spyOn(component.submit, 'emit');
    const input = fixture.debugElement.query(By.css('#category-name'))
      .nativeElement as HTMLInputElement;

    input.value = 'Science';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    (fixture.debugElement.query(By.css('form')).nativeElement as HTMLFormElement).dispatchEvent(
      new Event('submit')
    );

    expect(submitSpy).toHaveBeenCalledWith({ name: 'Science' });
  });
});
