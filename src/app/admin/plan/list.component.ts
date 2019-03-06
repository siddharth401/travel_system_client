import {Component, OnInit,EventEmitter} from '@angular/core';
import {AppService} from '../../shared/app.service';
import {ActivatedRoute,Router} from '@angular/router';
import {Filter} from "../shared/filter/filter";
import {TranslationPipe} from "../../shared/translation/translation.pipe";
import {any} from "codelyzer/util/function";

@Component({
    selector: 'admin-city-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
    private filter;
    private curLang;
    private listGuiders = {};
    private listPlans = {};
    private params = {'status': [], 'member_id': '', 'sort': 'id', 'direction': 'desc', 'page': ''};
    private is_search = false;
    private guiders = [];
    private Select = this.app.trans('Select');
    private guiderSelectUS = this.app.constant.GUIDER_SELECT_US;
    private guiderSelectJP = this.app.constant.GUIDER_SELECT_JP;
    private select_language;

    constructor
    (private app: AppService,
     private router: Router,
     private route: ActivatedRoute) {
    }

    ngOnInit() {
        window.scrollTo(0, 0);
        this.route.params.subscribe((params) => {
            this.params["page"] = params.page ? params.page : 1;
            this.search(false);
        });
        this.getListGuiders();
        this.app.event.subscribe(data=>{
            if(data){
                this.app.get('members', {'type': 2}).then(res => {
                    if (res.status == 200) {
                        this.listGuiders = this.app.arrToList(res.json().data, 'id', 'name');
                        this.guiders = this.app.pushToArr(res.json().data, 'id', 'name');
                        if (data.lang == 'us') {
                            var index = this.guiders.indexOf(this.guiderSelectJP);
                            this.guiders.splice(index, 1);
                            this.guiders.unshift(this.guiderSelectUS);
                        } else {
                            var index = this.guiders.indexOf(this.guiderSelectUS);
                            this.guiders.splice(index, 1);
                            this.guiders.unshift(this.guiderSelectJP);
                        }
                        this.params.member_id = this.app.constant.FALSE;
                        $(document).ready(function () {
                            $('#search-guider').trigger('click');
                        });
                    }
                });
            }
        });
    }

    ngAfterViewChecked() {
        $('.select2-selection__arrow').css({"display": "none"});
        $('.select2-results__message').remove();
    }

    reset(event) {
        $(".checkbox-status").prop('checked', false);
        this.params = {'status': [], 'member_id': '', 'sort': 'id', 'direction': 'desc', 'page': ''};
        this.getListGuiders();
    }

    changeSort(field) {
        if (this.params["sort"] == field) {
            this.params["direction"] = this.params["direction"] == 'asc' ? 'desc' : 'asc';
        } else {
            this.params["sort"] = field;
            this.params["direction"] = 'desc';
        }

        this.search(false);
    }

    onChange(e) {
        var isChecked = e.target.value;
        if (this.params.status.includes(isChecked)) {
            this.params.status.splice(this.params.status.indexOf(isChecked), 1);
        } else {
            this.params.status.push(isChecked);
        }
    }

    search(search) {
        var member_id;
        var memberName = $('.select2-selection__rendered').attr('title');
        $('.select2-selection__rendered').text(memberName);
        if (memberName == this.guiderSelectUS || memberName == this.guiderSelectJP) {
            member_id = this.app.constant.FALSE;
        } else {
            $.each(this.listGuiders, function (key, value) {
                if (value == memberName) {
                    member_id = key;
                }
            });
        }
        this.params.member_id = member_id;
        this.is_search = search === false ? search : true;
        this.app.get('plans', this.params).then(res => {
            $('.select2-selection__rendered').text(memberName);
            this.listPlans = res.json().data;
        });
        window.scrollTo(0, 0);
    }

    getListGuiders() {
        this.curLang = this.app.getConfig('LANG', 'us');
        this.app.get('members', {'type': 2}).then(res => {
            if (res.status == 200) {
                this.listGuiders = this.app.arrToList(res.json().data, 'id', 'name');
                this.guiders = this.app.pushToArr(res.json().data, 'id', 'name');
                if (this.curLang == 'us') {
                    var index = this.guiders.indexOf(this.guiderSelectJP);
                    this.guiders.splice(index, 1);
                    this.guiders.unshift(this.guiderSelectUS);
                } else {
                    var index = this.guiders.indexOf(this.guiderSelectUS);
                    this.guiders.splice(index, 1);
                    this.guiders.unshift(this.guiderSelectJP);
                }
                this.params.member_id = this.app.constant.FALSE;
                $(document).ready(function () {
                    $('#search-guider').trigger('click');
                });
            }
        });


    }

}