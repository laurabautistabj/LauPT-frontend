import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.sass']
})
export class DetailComponent implements OnInit {

  @Input() data: any;
  @Output() closeDetail = new EventEmitter();

  constructor() {
  }

  ngOnInit(): void {
  }

  async onClose(): Promise<void> {
    this.closeDetail.emit(null);
  }

}
