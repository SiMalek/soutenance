import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http'; 
import { MatChipsModule } from '@angular/material/chips';
import { ReactiveFormsModule,FormsModule} from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SignComponent } from './components/sign-in/sign-in.component';
import { CommonModule } from '@angular/common';
@NgModule({
  declarations: [
    AppComponent,  
    SignComponent
  ],
  imports: [
    BrowserModule,
    MatChipsModule,
    ReactiveFormsModule,
    CommonModule ,
    FormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    RouterModule.forRoot([]) 
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }