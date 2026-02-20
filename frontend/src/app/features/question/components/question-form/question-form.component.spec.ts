import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { describe, beforeEach, it, expect, vi } from 'vitest';
import { QuestionFormComponent } from './question-form.component';

describe('QuestionFormComponent', () => {
  let component: QuestionFormComponent;
  let fixture: ComponentFixture<QuestionFormComponent>;

  const setTextAreaValue = (selector: string, value: string): void => {
    const input = fixture.debugElement.query(By.css(selector)).nativeElement as HTMLTextAreaElement;
    input.value = value;
    input.dispatchEvent(new Event('input'));
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuestionFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(QuestionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('keeps submit disabled until required fields are filled', () => {
    const submitButton = fixture.debugElement.query(By.css('button[type="submit"]'))
      .nativeElement as HTMLButtonElement;
    expect(submitButton.disabled).toBe(true);

    setTextAreaValue('#question-text', 'What is 2 + 2?');
    setTextAreaValue('#question-answer', '4');
    fixture.detectChanges();

    expect(component.isFormValid()).toBe(true);
  });

  it('emits submit with form payload when valid form is submitted', () => {
    const submitSpy = vi.spyOn(component.submit, 'emit');
    setTextAreaValue('#question-text', 'Capital of France?');
    setTextAreaValue('#question-answer', 'Paris');
    fixture.detectChanges();

    component.onSubmit();

    expect(submitSpy).toHaveBeenCalledWith(
      expect.objectContaining({ text: 'Capital of France?', answer: 'Paris' })
    );
  });

  it('does not emit submit when required fields are empty', () => {
    const submitSpy = vi.spyOn(component.submit, 'emit');

    component.onSubmit();

    expect(submitSpy).not.toHaveBeenCalled();
  });
});
