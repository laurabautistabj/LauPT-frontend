import {Component, OnInit} from '@angular/core';
import {LearningStyleService} from "../../services/learning-style.service";
import {StudentLearningStyleService} from "../../services/student-learning-style.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass']
})
export class HomeComponent implements OnInit {

  constructor(private learningStyleService: LearningStyleService) {
  }

  async ngOnInit(): Promise<void> {
  }

}
