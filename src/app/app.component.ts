import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppUpdateService } from './services/app-update.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'my-angular18-app';

  constructor(private appUpdateService: AppUpdateService) {}
}
