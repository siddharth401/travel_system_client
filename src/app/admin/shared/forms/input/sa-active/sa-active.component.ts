import {Component, OnInit, Input, EventEmitter, Output} from '@angular/core';
import {AppService} from "../../../../../shared/app.service";

@Component({
  selector: 'sa-active',
  templateUrl: 'sa-active.html',
})
export class AdminActiveComponent implements OnInit
{
  @Input() title:string;
  @Output() modelChange = new EventEmitter();
  @Input() value:boolean;
  @Input() model:string;
  @Input() id:string;
  @Input() active:any;

  public widgetId;

  constructor(private app: AppService) {}

  ngOnInit()
  {
    if(this.model && this.id)
    {
      this.value = (this.active == 1)?true:false;
      this.widgetId = 'sa-active-' + this.id;
    }
    else
    {
      this.title = 'Invalid';
      console.log('Hey dev! Missing parameters');
    }
  }

  onChange()
  {
    this.modelChange.emit(this.value);

    let data =
    {
      model:this.model,
      id:this.id
    };

    this.app.post('commons/active', data).then(res =>
    {
      if(res.status == 200){}
    });
  }
}
