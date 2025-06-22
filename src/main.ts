import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { CommonModule } from '@angular/common';

bootstrapApplication(AppComponent)
  .catch(err => console.error(err));
