import {Component, NgZone, OnInit, ViewEncapsulation} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppService } from '../../shared/app.service';

@Component({
  selector: 'top-default-layout',
  templateUrl: './default-layout.component.html',
  styleUrls:
     [
     '../../../assets/top/css/select2.min.css',
     '../../../assets/top/css/themes/default.css',
     '../../../assets/top/css/themes/default.date.css',
     '../../../assets/top/css/slidebars.min.css',
     '../../../assets/top/css/colorbox.css',
     '../../../assets/top/css/global.css',
     '../../../assets/top/css/index.css',
     '../../../assets/top/css/loading_request.css',
     '../../../assets/top/css/privacypolicy.css'
   ],
  encapsulation: ViewEncapsulation.None
})
export class DefaultLayoutComponent implements OnInit {
    private curMember = this.app.getCurrentMember();

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private app: AppService,
        private _ngZone: NgZone) { }

    ngOnInit() {
        let baseUrl = this.app.constant.BASE_WEB;
        //check language on url then set config local storage
        /*let url_path_name = window.location.pathname;
        let pathArr = window.location.pathname.split( '/' );
        if(pathArr[1] == this.app.constant.EN_LANGUAGE_URL) {
            this.app.setLanguage(this.app.constant.EN_LANGUAGE_URL, this.app.constant.EN_LANGUAGE_ID);
        } else {
            this.app.setLanguage(this.app.constant.DEFAULT_LANGUAGE_URL, this.app.constant.TOP_LANGUAGE_ID);
        }*/
        $('head').append('<link rel="canonical" href="'+baseUrl+'">');
        // not use this in AppService, because it turn on change detection once scroll
        this._ngZone.runOutsideAngular(() => {
            var header = $('header.header');
            var topBtn = $('#pageTop a');
            $(window).scroll(function () {
                if ($(this).scrollTop() > 0) {
                    header.addClass('scrolled');
                    topBtn.fadeIn();
                } else {
                    header.removeClass('scrolled');
                    topBtn.fadeOut();
                }
            });
        });

    }
}
