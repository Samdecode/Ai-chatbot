
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AppComponent } from './app.component';
import { bootstrapApplication } from '@angular/platform-browser';


bootstrapApplication(AppComponent, {
  providers: [HttpClient],

}).catch(err => console.error(err));

export class AppModule { }