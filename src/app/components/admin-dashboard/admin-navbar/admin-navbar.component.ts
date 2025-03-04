import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-admin-navbar',
    standalone: true,
    imports: [RouterModule, CommonModule],
    templateUrl: './admin-navbar.component.html',
    styleUrls: ['./admin-navbar.component.css'],
})
export class AdminNavbarComponent {
    constructor(private authService: AuthService, private router: Router) { }

    isLoggedIn(): boolean {
        return this.authService.isLoggedIn();
    }

    logout(): void {
        this.authService.logout();
        this.router.navigate(['/login']);
    }
}
