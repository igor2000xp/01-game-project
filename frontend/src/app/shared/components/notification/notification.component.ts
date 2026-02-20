import { Component, computed, inject } from '@angular/core';
import { NotificationService, Notification, NotificationType } from '../../services/notification.service';

@Component({
  selector: 'app-notification',
  standalone: true,
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.css',
})
export class NotificationComponent {
  private readonly notificationService = inject(NotificationService);

  readonly notifications = this.notificationService.notifications$;
  readonly hasNotifications = computed(() => this.notifications().length > 0);

  dismiss(id: string): void {
    this.notificationService.dismiss(id);
  }

  getTypeClass(type: NotificationType): string {
    const typeClasses: Record<NotificationType, string> = {
      success: 'notification-success',
      error: 'notification-error',
      warning: 'notification-warning',
      info: 'notification-info',
    };
    return typeClasses[type];
  }

  getIcon(type: NotificationType): string {
    const icons: Record<NotificationType, string> = {
      success: '✓',
      error: '✕',
      warning: '⚠',
      info: 'ℹ',
    };
    return icons[type];
  }
}
