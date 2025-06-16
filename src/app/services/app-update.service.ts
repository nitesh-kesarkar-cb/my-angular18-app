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
    console.log('AppUpdateService initialized');
    if (!updates.isEnabled) return;

    const appIsStable$ = appRef.isStable.pipe(first(stable => stable));
    const everyTenSeconds$ =  interval(10 * 1000); // check every 10 seconds
    const everyTenSecondsOnceAppIsStable$ = concat(appIsStable$, everyTenSeconds$);

    everyTenSecondsOnceAppIsStable$.subscribe(() => {
      console.log('AppUpdateService Checking for app updates...');
      this.updates.checkForUpdate();
    });

    this.updates.versionUpdates.subscribe((event: VersionEvent) => {
      console.log('AppUpdateService versionUpdates...');
      if (event.type === 'VERSION_READY') {
          console.log('AppUpdateService ready...');
        const versionReadyEvent = event as VersionReadyEvent;
        const update = confirm(
          `A new version is available.\n\nCurrent: ${versionReadyEvent.currentVersion.hash}\nLatest: ${versionReadyEvent.latestVersion.hash}\n\nReload to update?`
        );
        if (update) {
          console.log('AppUpdateService updating...');
          this.updates.activateUpdate().then(() => document.location.reload());
        }
      }
    });
  }
}
