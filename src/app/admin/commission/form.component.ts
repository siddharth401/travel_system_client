import {Component, OnInit} from '@angular/core';
import {AppService} from "../../shared/app.service";
import {ActivatedRoute, Router} from '@angular/router';
import {UploadService} from "../../shared/upload/upload.service";
import {FormData} from '../../shared/form-data';

@Component({
    selector: 'admin-commission-form',
    styleUrls: ['./form.component.css'],
    templateUrl: './form.component.html',

})
export class FormComponent implements OnInit {

    private data_error = [];
    private rate;
    private showRate;
    private fb;
    private data =
        {
            id: '',
            type: 1,
            rate: '',
            active: 1
        };
    private dataItem =
        {
            id: '',
            type: 2,
            from_day: '',
            to_day: '',
            cancel_rate: '',
            from_day_err: '',
            to_day_err: '',
            cancel_err: '',
            active: 1
        };

    constructor
    (private app: AppService,
     private route: ActivatedRoute,
     private router: Router,
     private upload: UploadService) {
    }

    ngOnInit() {
        this.fb = new FormData(this.app, this.data);
        this.app.get('commission', {}).then(res => {
            if (res.status === 200) {
                this.rate = res.json().data[0].rate;
            }
        });
        this.fb.initChild('data_item', this.dataItem);
        this.fb.bindData('commission', {});
    }

    save(confirm?:false) {
        this.fb.form.value['rate'] = $('#rate').val();
        this.showRate = $('#rate').val();
        this.fb.form.value['form_confirm'] = confirm;
        this.app.post('commission/save', this.fb.form.value).then(res => {
            if (res.status === 200) {
                if (confirm) {
                    $('#formConfirm').modal('show');
                }
                else {
                    $('#formConfirm').modal('hide');
                    this.app.adminFlashSuccess(this.app.trans('Data has been saved'), true);
                    this.router.navigate(['admin/commission/form']);
                    this.data_error = [];
                }
            }
            else {
                this.data_error = res.json();
            }

        });
    }
}
