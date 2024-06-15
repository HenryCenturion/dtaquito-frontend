import {Component, OnInit} from '@angular/core';
import {MatCard, MatCardContent, MatCardImage} from "@angular/material/card";
import {NgForOf, NgIf, NgOptimizedImage} from "@angular/common";
import {SportSpacesService} from "../../services/sport-spaces.service";
import {SportSpace} from "../../models/sport-space.model";
import {ShortTimePipe} from "../../../shared/pipes/short-time.pipe";
import {Router} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {MatDialog} from "@angular/material/dialog";
import {SportSpaceCreationComponent} from "../sport-space-creation/sport-space-creation.component";
import {UsersService} from "../../services/users.service";


@Component({
  selector: 'app-sport-space-cards',
  standalone: true,
  imports: [
    MatCard,
    MatCardContent,
    MatCardImage,
    NgOptimizedImage,
    NgForOf,
    ShortTimePipe,
    FormsModule,
    NgIf,
    SportSpaceCreationComponent
  ],
  templateUrl: './sport-space-cards.component.html',
  styleUrl: './sport-space-cards.component.css'
})
export class SportSpaceCardsComponent implements OnInit {
  sportSpaces: any[] = [];
  loggedUser = JSON.parse(localStorage.getItem('loggedUser') || '{}');

  constructor(private sportSpacesService: SportSpacesService, private router: Router, private dialog: MatDialog) {
  }

  ngOnInit(): void {
    console.log("Usuario logueado" + this.loggedUser.id);
    this.getSportSpaces();
  }

  getSportSpaces() {
    this.sportSpacesService.getAllSportSpaces().subscribe((data: SportSpace[]) => {
      this.sportSpaces = data;
    });
  }

  goToDetail(sportSpace: SportSpace) {
    this.router.navigate(['/sport-spaces', sportSpace.id]);
  }

  openCreateSportSpaceDialog() {
    const dialogRef = this.dialog.open(SportSpaceCreationComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.sportSpaces.push(result);
      }
    });
  }

  deleteSportSpace(id: number, event: Event): void {
    event.stopPropagation();

    const confirmation = confirm('Are you sure you want to delete this sport space?');
    if (!confirmation) {
      return;
    }

    this.sportSpacesService.deleteSportSpace(id).subscribe(() => {
      this.getSportSpaces();
    });
  }
}

