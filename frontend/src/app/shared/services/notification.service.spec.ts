import { TestBed } from '@angular/core/testing';
import { NotificationService } from './notification.service';

describe('NotificationService', () => {
  let service: NotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add success notification', () => {
    service.success('Test message');
    const notifications = service.notifications$();
    expect(notifications.length).toBe(1);
    expect(notifications[0].type).toBe('success');
    expect(notifications[0].message).toBe('Test message');
  });

  it('should add error notification', () => {
    service.error('Error message');
    const notifications = service.notifications$();
    expect(notifications[0].type).toBe('error');
  });

  it('should dismiss notification by id', () => {
    service.success('Test');
    const notifications = service.notifications$();
    const id = notifications[0].id;
    service.dismiss(id);
    expect(service.notifications$().length).toBe(0);
  });

  it('should dismiss all notifications', () => {
    service.success('Test 1');
    service.success('Test 2');
    service.dismissAll();
    expect(service.notifications$().length).toBe(0);
  });
});
