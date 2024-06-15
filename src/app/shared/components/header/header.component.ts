import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Router, RouterLink, RouterLinkActive} from '@angular/router';
import {NgIf} from "@angular/common";
import {AuthService} from "../../services/auth.service";
import {User} from "../../../business/models/user.model";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  standalone: true,
  imports: [
    RouterLinkActive,
    RouterLink,
    NgIf
  ],
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @ViewChild('menu') menu!: ElementRef;
  isLoggedIn: boolean = false;
  menuOpen: boolean = false;
  loggedUser: User | null = null;

  constructor(private authService: AuthService) {
  }

  ngOnInit() {
    this.authService.isLoggedIn$.subscribe(status => {
      this.isLoggedIn = status;
      this.loggedUser = this.authService.getLoggedUser();
    });

  }

  logout(): void {
    this.authService.logout();
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }
  onDocumentClick(event: Event) {
    if (this.menuOpen && !this.menu.nativeElement.contains(event.target)) {
      this.toggleMenu();
    }
  }

}
