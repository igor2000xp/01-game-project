import { TestBed } from '@angular/core/testing';
import { describe, beforeEach, afterEach, it, expect, vi } from 'vitest';
import { NotificationService } from './notification.service';

describe('NotificationService', () => {
  let service: NotificationService;

  beforeEach(() => {
    vi.useFakeTimers();
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotificationService);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('adds success notifications', () => {
    service.success('Saved');

    expect(service.notifications$()).toHaveLength(1);
    expect(service.notifications$()[0].type).toBe('success');
    expect(service.notifications$()[0].message).toBe('Saved');
  });

  it('auto-dismisses notifications when duration elapses', () => {
    service.info('Info', 1000);
    expect(service.notifications$()).toHaveLength(1);

    vi.advanceTimersByTime(1000);
    expect(service.notifications$()).toHaveLength(0);
  });

  it('keeps notifications when duration is zero', () => {
    service.warning('Persistent', 0);

    vi.advanceTimersByTime(5000);
    expect(service.notifications$()).toHaveLength(1);
  });

  it('dismisses by id and dismisses all', () => {
    service.success('A', 0);
    service.error('B', 0);
    const [first] = service.notifications$();

    service.dismiss(first.id);
    expect(service.notifications$()).toHaveLength(1);

    service.dismissAll();
    expect(service.notifications$()).toHaveLength(0);
  });
});
