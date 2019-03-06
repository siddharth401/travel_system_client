import { Component, OnInit } from '@angular/core';
import { AppService } from '../../shared/app.service';
import { ActivatedRoute } from '@angular/router';
import {Router} from '@angular/router';
import { Filter } from "../shared/filter/filter";
import { Angular2Csv } from 'angular2-csv/Angular2-csv';


@Component({
    selector: 'list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
    private filter;
    private listMembers = {};
    private requests = {
        data : {}
    };
    private params = {'date_plan_from': '', 'date_plan_to': '', 'date_end_from': '', 'date_end_to': '', 'status': [], 'member_name': '', 'sort': 'id', 'direction': 'desc', 'page': '', 'is_download': false};
    private curDate = new Date();
    private is_search = false;

    constructor(private app: AppService,
                private route: ActivatedRoute,
                private router: Router) {
    }

    ngOnInit() {
        window.scrollTo(0,0);
        this.route.params.subscribe((params) => {
            this.params["page"] = params.page ? params.page : 1;
            this.search(false);
        });
        this.getListMembers();

        System.import('script-loader!jquery-ui-npm/jquery-ui.min.js').then(()=>{
            $(document).ready(function(){
                $( ".datepicker" ).datepicker(
                    { dateFormat: 'yy/mm/dd' }
                );
            });
        });
    }

    getListMembers()
    {
        this.app.get('members', {type: 1}).then(res =>
        {
            if (res.status == 200) {
                this.listMembers = this.app.arrToList(res.json().data, 'id','name');
            }
        });
    }

    reset() {
        this.params = {'date_plan_from': '', 'date_plan_to': '', 'date_end_from': '', 'date_end_to': '', 'status': [], 'member_name': '', 'sort': 'id', 'direction': '', 'page': '', 'is_download': false};
        $('[name="date_plan_from"]').val("");
        $('[name="date_plan_to"]').val("");
        $('[name="date_end_from"]').val("");
        $('[name="date_end_to"]').val("");
        $(".checkbox-status").prop('checked', false);
    }

    onChange(e) {
        var isChecked = e.target.value;
        if(this.params.status.includes(isChecked)) {
            this.params.status.splice(this.params.status.indexOf(isChecked), 1);
        } else {
            this.params.status.push(isChecked);
        }
    }

    changeSort(field) {
        if (this.params["sort"] == field) {
            this.params["direction"] = this.params["direction"]=='asc'?'desc':'asc';
        } else {
            this.params["sort"] = field;
            this.params["direction"] = 'desc';
        }

        this.search(false);
    }
    
    search(search) {
        this.is_search = search == false ? search : true;
        this.params['date_plan_from'] = $('[name="date_plan_from"]').val();
        this.params['date_plan_to'] = $('[name="date_plan_to"]').val();
        this.params['date_end_from'] = $('[name="date_end_from"]').val();
        this.params['date_end_to'] = $('[name="date_end_to"]').val();
        if((this.params['date_plan_from'] != "" && this.params['date_plan_to'] != "" && this.params['date_plan_from'] > this.params['date_plan_to'])
            || (this.params['date_end_from'] != "" && this.params['date_end_to'] != "" && this.params['date_end_from'] > this.params['date_end_to'])) {
            alert(this.app.trans('The end date is needing bigger than the start date'));
        } else {
            this.app.get('requests', this.params).then(res => {
                this.requests = res.json().data;
                if(search == true) {
                    this.router.navigate(['/admin/requests']);
                }
            });
        }        
    }

    downloadCsv() {
        var listRequest = [
            {
                request_id: this.app.trans("Request ID"),
                member_request: this.app.trans("Member request"),
                title: this.app.trans("Request title"),
                deadline: this.app.trans("Deadline"),
                date_plan: this.app.trans("Date plan"),
                number_suggestions: this.app.trans("Number suggestions"),
                created_at: this.app.trans("Created at"),
                message: this.app.trans("Message"),
                status: this.app.trans("Status")
            }
        ];
        this.params['is_download'] = true;
        this.app.get('requests', this.params).then(res => {
            if (res.status == 200) {
                var requestList = res.json().data;
                //add element booking to list for export csv
                for (var index in requestList) {
                    listRequest.push(
                        {
                            request_id: this.app.addFixedId(requestList[index]['id'], "R"),
                            member_request: requestList[index]["member_name"] ? requestList[index]["member_name"] : "",
                            title: requestList[index]["title"],
                            deadline: this.app.datex(requestList[index]["date_end"], "YYYY/MM/DD"),
                            date_plan: this.app.datex(requestList[index]["date_plan"], "YYYY/MM/DD"),
                            number_suggestions: requestList[index]["num_suggestions"] ? requestList[index]["num_suggestions"] : "",
                            created_at: this.app.datex(requestList[index]["created_at"], "YYYY/MM/DD"),
                            message: requestList[index]["num_comments"] ? requestList[index]["num_comments"] : "",
                            status: this.app.constant.Request.status[requestList[index]["status"]] ? this.app.trans(this.app.constant.Request.status[requestList[index]["status"]]) : ""
                        }
                    );
                };
                var options = {
                    fieldSeparator: ',',
                    quoteStrings: '"',
                    decimalseparator: '.',
                    showLabels: true,
                    showTitle: true,
                    title: "Request List",
                    useBom: true
                };

                new Angular2Csv(listRequest, 'requests', options);
            }

        });

    }

}