import {Component, OnInit, Input} from '@angular/core';
import {Router} from '@angular/router';
import {constant} from "../../../shared/constant";

@Component({
    selector: 'top-see-full',
    templateUrl: './see-full.component.html',
    styleUrls: ['./see-full.component.css']
})
export class SeeFulllComponent implements OnInit {

    @Input() public content: any;
    @Input() public id: any;

    constructor(private router: Router) {
    }

    ngOnInit() {
        $(document).on('click', '.btn_see_full', function () {
            var post_id = $(this).attr("id");
            $('#post_' + post_id).find('.limit').hide();
            $('#post_' + post_id).find( '.full').show();
        });
    }
}
