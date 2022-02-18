import { Component, Input, OnInit, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
@Component({
  selector: 'app-modal-selector-image',
  templateUrl: './modal-selector-image.component.html',
  styleUrls: ['./modal-selector-image.component.scss'],
})
export class ModalSelectorImageComponent implements OnInit {
  @Output() selectedUrl: EventEmitter<string> = new EventEmitter();
  @Input() isOpen: boolean;
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter();

  array = [
    'horse.jpg',
    'bojack.png'
  ];
  constructor() { }

  ngOnInit() { 
   }

  handleClickImage(name: string){
    this.selectedUrl.emit(name);
  }
  handleCloseModal(){
    console.log('click')
    this.closeModal.emit(false);
  }

}
