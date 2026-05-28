import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import {
    DatePipe,
    NgClass,
    NgFor,
    NgIf,
    NgTemplateOutlet,
} from '@angular/common';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Inject,
    OnDestroy,
    OnInit,
    TemplateRef,
    ViewChild,
    ViewContainerRef,
    ViewEncapsulation,
} from '@angular/core';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import {
    Notification,
    NotificationCount,
    NotificationEvent,
    PushNotificationType,
} from 'genesis-apiservices';
import {
    APP_CONFIG_GEN,
    IAppConfig,
    QueryableResponse,
} from 'genesis-coreservice';
import { genesisAnimations } from '../../../../@genesis/animations';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'notifications',
    templateUrl: './notifications.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    exportAs: 'notifications',
    standalone: true,
    animations: genesisAnimations,
    imports: [
        MatButtonModule,
        NgIf,
        MatIconModule,
        MatTooltipModule,
        NgFor,
        NgClass,
        NgTemplateOutlet,
        RouterLink,
        DatePipe,
    ],
})
export class NotificationsComponent implements OnInit, OnDestroy {
    @ViewChild('notificationsOrigin') private notificationsOrigin?: MatButton | null;
    @ViewChild('notificationsPanel')
    private notificationsPanel?: TemplateRef<any>;

    notifications: Notification[] = [];
    unreadCount: number = 0;
    notificationType = PushNotificationType.Acceptation;

    private overlayRef?: OverlayRef;
    private unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private changeDetectorRef: ChangeDetectorRef,
        private notificationEvent: NotificationEvent,
        private overlay: Overlay,
        private viewContainerRef: ViewContainerRef,
        @Inject(APP_CONFIG_GEN) public appConfig: IAppConfig,
    ) {}

    ngOnInit(): void {
        if (this.appConfig.showNotification) {
            this.notificationEvent.getNewNotifications$
                .pipe(takeUntil(this.unsubscribeAll))
                .subscribe((res: Notification) => {
                    if (res) {
                        this.notifications.push(res);
                        this.changeDetectorRef.markForCheck();
                    }
                });
            this.notificationEvent.notifications$
                .pipe(takeUntil(this.unsubscribeAll))
                .subscribe((response: QueryableResponse<Notification[]>) => {
                    this.notifications = response.data;
                    this.unreadCount = response.totalCount;
                    this.changeDetectorRef.markForCheck();
                });

            this.notificationEvent.readNotifcation
                .pipe(takeUntil(this.unsubscribeAll))
                .subscribe((notification: Notification) => {
                    var findIndex = this.notifications.findIndex(
                        (x) => x.id == notification.id,
                    );
                    this.notifications.splice(findIndex, 1);
                    this.changeDetectorRef.markForCheck();
                });

            this.notificationEvent.delete
                .pipe(takeUntil(this.unsubscribeAll))
                .subscribe((notification: Notification) => {
                    var findIndex = this.notifications.findIndex(
                        (x) => x.id == notification.id,
                    );
                    this.notifications.splice(findIndex, 1);
                    this.changeDetectorRef.markForCheck();
                });

            this.notificationEvent.changeCountNotification
                .pipe(takeUntil(this.unsubscribeAll))
                .subscribe((count: NotificationCount) => {
                    this.unreadCount = count.unReadCount;
                    this.changeDetectorRef.markForCheck();
                });
        }
    }

    ngOnDestroy(): void {
        this.unsubscribeAll.next(null);
        this.unsubscribeAll.complete();

        if (this.overlayRef) {
            this.overlayRef.dispose();
        }
    }

    openPanel(): void {
        if (!this.notificationsPanel || !this.notificationsOrigin) {
            return;
        }

        if (!this.overlayRef) {
            this.createOverlay();
        }
        this.overlayRef?.attach(
            new TemplatePortal(this.notificationsPanel, this.viewContainerRef),
        );
    }

    closePanel(): void {
        this.overlayRef?.detach();
    }

    markAllAsRead(): void {
        this.notificationEvent.readAllNotifcation = true;
    }

    toggleRead(notification: Notification): void {
        notification.read = !notification.read;
        if (this.unreadCount > 0) this.unreadCount -= 1;
        this.notificationEvent.readNotifcation = notification;
    }

    deleteNotify(notification: Notification): void {
        notification.read = !notification.read;
        if (this.unreadCount > 0) this.unreadCount -= 1;
        this.notificationEvent.delete = notification;
    }

    trackByFn(index: number, item: any): any {
        return item.id || index;
    }

    Acceptation(notification: Notification) {
        this.notificationEvent.acceptNotifcation = notification;
    }

    reject(notification: Notification) {
        this.notificationEvent.rejectNotifcation = notification;
    }

    private createOverlay(): void {
        this.overlayRef = this.overlay.create({
            hasBackdrop: true,
            backdropClass: 'genesis-backdrop-on-mobile',
            scrollStrategy: this.overlay.scrollStrategies.block(),
            positionStrategy: this.overlay
                .position()
                .flexibleConnectedTo(
                    this.notificationsOrigin?._elementRef?.nativeElement!,
                )
                .withLockedPosition(true)
                .withPush(true)
                .withPositions([
                    {
                        originX: 'start',
                        originY: 'bottom',
                        overlayX: 'start',
                        overlayY: 'top',
                    },
                    {
                        originX: 'start',
                        originY: 'top',
                        overlayX: 'start',
                        overlayY: 'bottom',
                    },
                    {
                        originX: 'end',
                        originY: 'bottom',
                        overlayX: 'end',
                        overlayY: 'top',
                    },
                    {
                        originX: 'end',
                        originY: 'top',
                        overlayX: 'end',
                        overlayY: 'bottom',
                    },
                ]),
        });

        this.overlayRef.backdropClick().subscribe(() => {
            this.overlayRef?.detach();
        });
    }
}
