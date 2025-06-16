import { ApplicationRef, Injectable } from '@angular/core';
import {
  SwUpdate,
  VersionEvent,
  VersionReadyEvent
} from '@angular/service-worker';
import { concat, interval } from 'rxjs';
import { first } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AppUpdateService {
  constructor(appRef: ApplicationRef, private updates: SwUpdate) {
    if (!updates.isEnabled) return;

    const appIsStable$ = appRef.isStable.pipe(first(stable => stable));
    const everySixHours$ = interval(6 * 60 * 60 * 1000);
    const everySixHoursOnceAppIsStable$ = concat(appIsStable$, everySixHours$);

    everySixHoursOnceAppIsStable$.subscribe(() => {
      this.updates.checkForUpdate();
    });

    this.updates.versionUpdates.subscribe((event: VersionEvent) => {
      if (event.type === 'VERSION_READY') {
        const versionReadyEvent = event as VersionReadyEvent;
        const update = confirm(
          `A new version is available.\n\nCurrent: ${versionReadyEvent.currentVersion.hash}\nLatest: ${versionReadyEvent.latestVersion.hash}\n\nReload to update?`
        );
        if (update) {
          this.updates.activateUpdate().then(() => document.location.reload());
        }
      }
    });
  }
}
