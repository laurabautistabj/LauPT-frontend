import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.sass']
})
export class ListComponent implements OnInit {

  displayedColumns: string[] = ['ApPaterno', 'ApMaterno', 'Nombre', 'UltimaUnidad', 'UltimoTema', 'Estado', 'Detalle'];
  @Input() data = [];
  @Output() studentDetail = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  async onDetail(data: any): Promise<void> {
    this.studentDetail.emit(data);
  }

}
