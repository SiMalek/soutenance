import { Component, OnInit } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { RouterModule } from '@angular/router';
import { FooterComponent } from '../footer/footer.component'; // Import the FooterComponent

@Component({
  selector: 'app-landing-page',
  templateUrl: './landingpage.component.html',
  standalone: true,
  imports: [RouterModule, FooterComponent], // Add FooterComponent to imports
  styleUrls: ['./landingpage.component.css'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('0.6s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class LandingPageComponent implements OnInit {
  constructor() { }

  ngOnInit() { }
}