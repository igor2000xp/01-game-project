import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { describe, beforeEach, it, expect, vi } from 'vitest';
import { QuestionFormComponent } from './question-form.component';

describe('QuestionFormComponent', () => {
  let component: QuestionFormComponent;
  let fixture: ComponentFixture<QuestionFormComponent>;

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

    const textInput = fixture.debugElement.query(By.css('#question-text'))
      .nativeElement as HTMLTextAreaElement;
    const answerInput = fixture.debugElement.query(By.css('#question-answer'))
      .nativeElement as HTMLTextAreaElement;

    textInput.value = 'What is 2 + 2?';
    textInput.dispatchEvent(new Event('input'));
    answerInput.value = '4';
    answerInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(component.isFormValid()).toBe(true);
  });

  it('emits submit with form payload when valid form is submitted', () => {
    const submitSpy = vi.spyOn(component.submit, 'emit');
    const textInput = fixture.debugElement.query(By.css('#question-text'))
      .nativeElement as HTMLTextAreaElement;
    const answerInput = fixture.debugElement.query(By.css('#question-answer'))
      .nativeElement as HTMLTextAreaElement;

    textInput.value = 'Capital of France?';
    textInput.dispatchEvent(new Event('input'));
    answerInput.value = 'Paris';
    answerInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    (fixture.debugElement.query(By.css('form')).nativeElement as HTMLFormElement).dispatchEvent(
      new Event('submit')
    );

    expect(submitSpy).toHaveBeenCalledWith(
      expect.objectContaining({ text: 'Capital of France?', answer: 'Paris' })
    );
  });
});
