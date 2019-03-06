import {Component, OnInit, Input} from '@angular/core';
import {Router} from '@angular/router';
import {AppService} from "../app.service";

@Component({
    selector: 'top-star',
    templateUrl: './top-star.component.html',
    styleUrls: ['./top-star.component.css']
})
export class TopStarComponent implements OnInit {

    @Input() public point:any;

    constructor
    (
        private app: AppService,
        private router: Router
    ) {}

    ngOnInit() {
    }

    rating(number) {
        let tmp = number;
        let result = [];
        for (var i = 1;  i <= 5; i++)
        {
            var value = 1;
            if( i > tmp)
            {
                value = 0;
                if(tmp > (i-1))
                {
                    value = 2;
                }
            }
            result.push({key: value})
        }
        return result;
    }
}
