"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var facebookParams_1 = require('./facebookParams');
var twitterParams_1 = require('./twitterParams');
var googlePlusParams_1 = require('./googlePlusParams');
var pinterestParams_1 = require('./pinterestParams');
var linkedinParams_1 = require('./linkedinParams');
var CeiboShare = (function () {
    function CeiboShare() {
        this.sharers = {
            facebook: {
                shareUrl: 'https://www.facebook.com/sharer/sharer.php',
            },
            googleplus: {
                shareUrl: 'https://plus.google.com/share',
            },
            linkedin: {
                shareUrl: 'https://www.linkedin.com/shareArticle',
            },
            twitter: {
                shareUrl: 'https://twitter.com/intent/tweet/',
            },
            email: {
                //shareUrl: 'mailto:' + this.to,
                /*params: {
                    subject: this.subject,
                    body: this.title + '\n' + this.url
                },*/
                isLink: true
            },
            whatsapp: {
                shareUrl: 'whatsapp://send',
                /*params: {
                    text: this.title + ' ' + this.url
                },*/
                isLink: true
            },
            telegram: {
                shareUrl: 'tg://msg_url',
                /*params: {
                    text: this.title + ' ' + this.url
                },*/
                isLink: true
            },
            viber: {
                shareUrl: 'viber://forward',
                /*params: {
                    text: this.title + ' ' + this.url
                },*/
                isLink: true
            },
            line: {
                //shareUrl: 'http://line.me/R/msg/text/?' + encodeURIComponent(this.title + ' ' + this.url),
                isLink: true
            },
            pinterest: {
                shareUrl: 'https://www.pinterest.com/pin/create/button/',
            },
            tumblr: {
                shareUrl: 'http://tumblr.com/widgets/share/tool',
            },
            hackernews: {
                shareUrl: 'https://news.ycombinator.com/submitlink',
            },
            reddit: {
                shareUrl: 'https://www.reddit.com/submit',
            },
            vk: {
                shareUrl: 'http://vk.com/share.php',
            },
            xing: {
                shareUrl: 'https://www.xing.com/app/user',
            },
            buffer: {
                shareUrl: 'https://buffer.com/add',
            },
            instapaper: {
                shareUrl: 'http://www.instapaper.com/edit',
            },
            pocket: {
                shareUrl: 'https://getpocket.com/save',
            },
            digg: {
                shareUrl: 'http://www.digg.com/submit',
            },
            stumbleupon: {
                shareUrl: 'http://www.stumbleupon.com/submit',
            },
            flipboard: {
                shareUrl: 'https://share.flipboard.com/bookmarklet/popout',
            },
            /*weibo: {
                shareUrl: 'http://service.weibo.com/share/share.php',
                params: {
                    url: this.url,
                    title: this.title,
                    pic: this.image,
                    appkey: this.getValue('appkey'),
                    ralateUid: this.getValue('ralateuid'),
                    language: 'zh_cn'
                }
            },*/
            renren: {
                shareUrl: 'http://share.renren.com/share/buttonshare',
            },
            myspace: {
                shareUrl: 'https://myspace.com/post',
            },
            blogger: {
                shareUrl: 'https://www.blogger.com/blog-this.g',
            },
            baidu: {
                shareUrl: 'http://cang.baidu.com/do/add',
            },
            douban: {
                shareUrl: 'https://www.douban.com/share/service',
            },
            okru: {
                shareUrl: 'https://connect.ok.ru/dk',
            }
        };
    }
    CeiboShare.prototype.urlSharer = function (sharer) {
        var p = sharer.params || {}, keys = Object.keys(p), i, str = keys.length > 0 ? '?' : '';
        for (i = 0; i < keys.length; i++) {
            if (str !== '?') {
                str += '&';
            }
            if (p[keys[i]]) {
                str += keys[i] + '=' + encodeURIComponent(p[keys[i]]);
            }
        }
        sharer.shareUrl += str;
        if (!sharer.isLink) {
            var popWidth = sharer.width || 600, popHeight = sharer.height || 480, left = window.innerWidth / 2 - popWidth / 2 + window.screenX, top = window.innerHeight / 2 - popHeight / 2 + window.screenY, popParams = 'scrollbars=no, width=' + popWidth + ', height=' + popHeight + ', top=' + top + ', left=' + left, newWindow = window.open(sharer.shareUrl, '', popParams);
            if (window.focus) {
                newWindow.focus();
            }
        }
        else {
            window.location.href = sharer.shareUrl;
        }
    };
    CeiboShare.prototype.getSharer = function () {
        var _sharer = {};
        if (this.facebook) {
            _sharer = this.sharers['facebook'];
            _sharer.params = this.facebook;
        }
        if (this.googlePlus) {
            _sharer = this.sharers['googleplus'];
            _sharer.params = this.googlePlus;
        }
        if (this.twitter) {
            _sharer = this.sharers['twitter'];
            _sharer.params = this.twitter;
        }
        if (this.pinterest) {
            _sharer = this.sharers['pinterest'];
            _sharer.params = this.pinterest;
        }
        if (this.linkedIn) {
            _sharer = this.sharers['linkedin'];
            _sharer.params = this.linkedIn;
        }
        return _sharer;
    };
    CeiboShare.prototype.share = function () {
        var s = this.getSharer();
        // custom popups sizes
        if (s) {
            s.width = this.shareWidth;
            s.height = this.shareHeight;
        }
        return s !== undefined ? this.urlSharer(s) : false;
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', facebookParams_1.FacebookParams)
    ], CeiboShare.prototype, "facebook", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', twitterParams_1.TwitterParams)
    ], CeiboShare.prototype, "twitter", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', googlePlusParams_1.GooglePlusParams)
    ], CeiboShare.prototype, "googlePlus", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', pinterestParams_1.PinterestParams)
    ], CeiboShare.prototype, "pinterest", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', linkedinParams_1.LinkedinParams)
    ], CeiboShare.prototype, "linkedIn", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], CeiboShare.prototype, "shareWidth", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], CeiboShare.prototype, "shareHeight", void 0);
    __decorate([
        core_1.HostListener('click'), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', []), 
        __metadata('design:returntype', void 0)
    ], CeiboShare.prototype, "share", null);
    CeiboShare = __decorate([
        core_1.Directive({
            selector: '[ceiboShare]'
        }), 
        __metadata('design:paramtypes', [])
    ], CeiboShare);
    return CeiboShare;
}());
exports.CeiboShare = CeiboShare;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmcyLXNvY2lhbC1zaGFyZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm5nMi1zb2NpYWwtc2hhcmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLHFCQUErQyxlQUFlLENBQUMsQ0FBQTtBQUMvRCwrQkFBK0Isa0JBQy9CLENBQUMsQ0FEZ0Q7QUFDakQsOEJBQThCLGlCQUFpQixDQUFDLENBQUE7QUFDaEQsaUNBQWtDLG9CQUFvQixDQUFDLENBQUE7QUFDdkQsZ0NBQWdDLG1CQUFtQixDQUFDLENBQUE7QUFDcEQsK0JBQStCLGtCQUFrQixDQUFDLENBQUE7QUFLbEQ7SUEwTmtCO1FBaE5SLFlBQU8sR0FBRztZQUNBLFFBQVEsRUFBRTtnQkFDTixRQUFRLEVBQUUsNENBQTRDO2FBRXpEO1lBQ0QsVUFBVSxFQUFFO2dCQUNSLFFBQVEsRUFBRSwrQkFBK0I7YUFFNUM7WUFDRCxRQUFRLEVBQUU7Z0JBQ04sUUFBUSxFQUFFLHVDQUF1QzthQUtwRDtZQUNELE9BQU8sRUFBRTtnQkFDTCxRQUFRLEVBQUUsbUNBQW1DO2FBT2hEO1lBQ0QsS0FBSyxFQUFFO2dCQUNILGdDQUFnQztnQkFDaEM7OztvQkFHSTtnQkFDSixNQUFNLEVBQUUsSUFBSTthQUNmO1lBQ0QsUUFBUSxFQUFFO2dCQUNOLFFBQVEsRUFBRSxpQkFBaUI7Z0JBQzNCOztvQkFFSTtnQkFDSixNQUFNLEVBQUUsSUFBSTthQUNmO1lBQ0QsUUFBUSxFQUFFO2dCQUNOLFFBQVEsRUFBRSxjQUFjO2dCQUN4Qjs7b0JBRUk7Z0JBQ0osTUFBTSxFQUFFLElBQUk7YUFDZjtZQUNELEtBQUssRUFBRTtnQkFDSCxRQUFRLEVBQUUsaUJBQWlCO2dCQUMzQjs7b0JBRUk7Z0JBQ0osTUFBTSxFQUFFLElBQUk7YUFDZjtZQUNELElBQUksRUFBRTtnQkFDRiw0RkFBNEY7Z0JBQzVGLE1BQU0sRUFBRSxJQUFJO2FBQ2Y7WUFDRCxTQUFTLEVBQUU7Z0JBQ1AsUUFBUSxFQUFFLDhDQUE4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VSxhQTBTdEIsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IERpcmVjdGl2ZSwgSG9zdExpc3RlbmVyLCBJbnB1dCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgRmFjZWJvb2tQYXJhbXMgfSBmcm9tICcuL2ZhY2Vib29rUGFyYW1zJ1xuaW1wb3J0IHsgVHdpdHRlclBhcmFtcyB9IGZyb20gJy4vdHdpdHRlclBhcmFtcyc7XG5pbXBvcnQgeyAgR29vZ2xlUGx1c1BhcmFtcyB9IGZyb20gJy4vZ29vZ2xlUGx1c1BhcmFtcyc7XG5pbXBvcnQgeyBQaW50ZXJlc3RQYXJhbXMgfSBmcm9tICcuL3BpbnRlcmVzdFBhcmFtcyc7XG5pbXBvcnQgeyBMaW5rZWRpblBhcmFtcyB9IGZyb20gJy4vbGlua2VkaW5QYXJhbXMnO1xuXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbY2VpYm9TaGFyZV0nXG59KVxuZXhwb3J0IGNsYXNzIENlaWJvU2hhcmUge1xuICAgIEBJbnB1dCgpIGZhY2Vib29rIDogRmFjZWJvb2tQYXJhbXM7XG4gICAgQElucHV0KCkgdHdpdHRlciA6IFR3aXR0ZXJQYXJhbXM7XG4gICAgQElucHV0KCkgZ29vZ2xlUGx1cyA6IEdvb2dsZVBsdXNQYXJhbXM7XG4gICAgQElucHV0KCkgcGludGVyZXN0IDogUGludGVyZXN0UGFyYW1zO1xuICAgIEBJbnB1dCgpIGxpbmtlZEluIDogTGlua2VkaW5QYXJhbXM7XG4gICAgQElucHV0KCkgc2hhcmVXaWR0aDogc3RyaW5nO1xuICAgIEBJbnB1dCgpIHNoYXJlSGVpZ2h0OiBzdHJpbmc7XG5cblxuICBwcml2YXRlIHNoYXJlcnMgPSB7XG4gICAgICAgICAgICAgICAgICAgIGZhY2Vib29rOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzaGFyZVVybDogJ2h0dHBzOi8vd3d3LmZhY2Vib29rLmNvbS9zaGFyZXIvc2hhcmVyLnBocCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAvL3BhcmFtczoge3U6IHRoaXMudXJsfVxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBnb29nbGVwbHVzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzaGFyZVVybDogJ2h0dHBzOi8vcGx1cy5nb29nbGUuY29tL3NoYXJlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vcGFyYW1zOiB7dXJsOiB0aGlzLnVybH1cbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgbGlua2VkaW46IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNoYXJlVXJsOiAnaHR0cHM6Ly93d3cubGlua2VkaW4uY29tL3NoYXJlQXJ0aWNsZScsXG4gICAgICAgICAgICAgICAgICAgICAgICAvKnBhcmFtczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVybDogdGhpcy51cmwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWluaTogdHJ1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgfSovXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHR3aXR0ZXI6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNoYXJlVXJsOiAnaHR0cHM6Ly90d2l0dGVyLmNvbS9pbnRlbnQvdHdlZXQvJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIC8qcGFyYW1zOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogdGhpcy50aXRsZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cmw6IHRoaXMudXJsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhhc2h0YWdzOiB0aGlzLmhhc2h0YWdzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZpYTogdGhpcy52aWFcbiAgICAgICAgICAgICAgICAgICAgICAgIH0qL1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBlbWFpbDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy9zaGFyZVVybDogJ21haWx0bzonICsgdGhpcy50byxcbiAgICAgICAgICAgICAgICAgICAgICAgIC8qcGFyYW1zOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3ViamVjdDogdGhpcy5zdWJqZWN0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJvZHk6IHRoaXMudGl0bGUgKyAnXFxuJyArIHRoaXMudXJsXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCovXG4gICAgICAgICAgICAgICAgICAgICAgICBpc0xpbms6IHRydWVcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgd2hhdHNhcHA6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNoYXJlVXJsOiAnd2hhdHNhcHA6Ly9zZW5kJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIC8qcGFyYW1zOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogdGhpcy50aXRsZSArICcgJyArIHRoaXMudXJsXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCovXG4gICAgICAgICAgICAgICAgICAgICAgICBpc0xpbms6IHRydWVcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgdGVsZWdyYW06IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNoYXJlVXJsOiAndGc6Ly9tc2dfdXJsJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIC8qcGFyYW1zOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogdGhpcy50aXRsZSArICcgJyArIHRoaXMudXJsXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCovXG4gICAgICAgICAgICAgICAgICAgICAgICBpc0xpbms6IHRydWVcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgdmliZXI6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNoYXJlVXJsOiAndmliZXI6Ly9mb3J3YXJkJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIC8qcGFyYW1zOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogdGhpcy50aXRsZSArICcgJyArIHRoaXMudXJsXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCovXG4gICAgICAgICAgICAgICAgICAgICAgICBpc0xpbms6IHRydWVcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgbGluZToge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy9zaGFyZVVybDogJ2h0dHA6Ly9saW5lLm1lL1IvbXNnL3RleHQvPycgKyBlbmNvZGVVUklDb21wb25lbnQodGhpcy50aXRsZSArICcgJyArIHRoaXMudXJsKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGlzTGluazogdHJ1ZVxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBwaW50ZXJlc3Q6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNoYXJlVXJsOiAnaHR0cHM6Ly93d3cucGludGVyZXN0LmNvbS9waW4vY3JlYXRlL2J1dHRvbi8nLFxuICAgICAgICAgICAgICAgICAgICAgICAgLypwYXJhbXM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cmw6IHRoaXMudXJsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lZGlhOiB0aGlzLmltYWdlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiB0aGlzLmRlc2NyaXB0aW9uXG4gICAgICAgICAgICAgICAgICAgICAgICB9Ki9cbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgdHVtYmxyOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzaGFyZVVybDogJ2h0dHA6Ly90dW1ibHIuY29tL3dpZGdldHMvc2hhcmUvdG9vbCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAvKnBhcmFtczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbm9uaWNhbFVybDogdGhpcy51cmwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGVudDogdGhpcy51cmwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9zdHR5cGU6ICdsaW5rJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogdGhpcy50aXRsZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXB0aW9uOiB0aGlzLmNhcHRpb24sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFnczogdGhpcy50YWdzXG4gICAgICAgICAgICAgICAgICAgICAgICB9Ki9cbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgaGFja2VybmV3czoge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2hhcmVVcmw6ICdodHRwczovL25ld3MueWNvbWJpbmF0b3IuY29tL3N1Ym1pdGxpbmsnLFxuICAgICAgICAgICAgICAgICAgICAgICAgLypwYXJhbXM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB1OiB0aGlzLnVybCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0OiB0aGlzLnRpdGxlXG4gICAgICAgICAgICAgICAgICAgICAgICB9Ki9cbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgcmVkZGl0OiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzaGFyZVVybDogJ2h0dHBzOi8vd3d3LnJlZGRpdC5jb20vc3VibWl0JyxcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vcGFyYW1zOiB7J3VybCc6IHRoaXMudXJsfVxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB2azoge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2hhcmVVcmw6ICdodHRwOi8vdmsuY29tL3NoYXJlLnBocCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAvKnBhcmFtczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVybDogdGhpcy51cmwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6IHRoaXMudGl0bGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IHRoaXMuY2FwdGlvbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbWFnZTogdGhpcy5pbWFnZVxuICAgICAgICAgICAgICAgICAgICAgICAgfSovXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHhpbmc6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNoYXJlVXJsOiAnaHR0cHM6Ly93d3cueGluZy5jb20vYXBwL3VzZXInLFxuICAgICAgICAgICAgICAgICAgICAgICAgLypwYXJhbXM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnb3AnOiAnc2hhcmUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICd1cmwnOiB0aGlzLnVybCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAndGl0bGUnOiB0aGlzLnRpdGxlXG4gICAgICAgICAgICAgICAgICAgICAgICB9Ki9cbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgYnVmZmVyOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzaGFyZVVybDogJ2h0dHBzOi8vYnVmZmVyLmNvbS9hZGQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgLypwYXJhbXM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cmw6IHRoaXMudXJsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiB0aGlzLnRpdGxlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZpYTogdGhpcy52aWEsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGljdHVyZTogdGhpcy5waWN0dXJlXG4gICAgICAgICAgICAgICAgICAgICAgICB9Ki9cbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgaW5zdGFwYXBlcjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2hhcmVVcmw6ICdodHRwOi8vd3d3Lmluc3RhcGFwZXIuY29tL2VkaXQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgLypwYXJhbXM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cmw6IHRoaXMudXJsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiB0aGlzLnRpdGxlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiB0aGlzLmRlc2NyaXB0aW9uXG4gICAgICAgICAgICAgICAgICAgICAgICB9Ki9cbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgcG9ja2V0OiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzaGFyZVVybDogJ2h0dHBzOi8vZ2V0cG9ja2V0LmNvbS9zYXZlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIC8qcGFyYW1zOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdXJsOiB0aGlzLnVybFxuICAgICAgICAgICAgICAgICAgICAgICAgfSovXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIGRpZ2c6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNoYXJlVXJsOiAnaHR0cDovL3d3dy5kaWdnLmNvbS9zdWJtaXQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgLypwYXJhbXM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cmw6IHRoaXMudXJsXG4gICAgICAgICAgICAgICAgICAgICAgICB9Ki9cbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgc3R1bWJsZXVwb246IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNoYXJlVXJsOiAnaHR0cDovL3d3dy5zdHVtYmxldXBvbi5jb20vc3VibWl0JyxcbiAgICAgICAgICAgICAgICAgICAgICAgIC8qcGFyYW1zOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdXJsOiB0aGlzLnVybCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogdGhpcy50aXRsZVxuICAgICAgICAgICAgICAgICAgICAgICAgfSovXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIGZsaXBib2FyZDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2hhcmVVcmw6ICdodHRwczovL3NoYXJlLmZsaXBib2FyZC5jb20vYm9va21hcmtsZXQvcG9wb3V0JyxcbiAgICAgICAgICAgICAgICAgICAgICAgIC8qcGFyYW1zOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdjogMixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogdGhpcy50aXRsZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cmw6IHRoaXMudXJsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHQ6IERhdGUubm93KClcbiAgICAgICAgICAgICAgICAgICAgICAgIH0qL1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAvKndlaWJvOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzaGFyZVVybDogJ2h0dHA6Ly9zZXJ2aWNlLndlaWJvLmNvbS9zaGFyZS9zaGFyZS5waHAnLFxuICAgICAgICAgICAgICAgICAgICAgICAgcGFyYW1zOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdXJsOiB0aGlzLnVybCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogdGhpcy50aXRsZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwaWM6IHRoaXMuaW1hZ2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXBwa2V5OiB0aGlzLmdldFZhbHVlKCdhcHBrZXknKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByYWxhdGVVaWQ6IHRoaXMuZ2V0VmFsdWUoJ3JhbGF0ZXVpZCcpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhbmd1YWdlOiAnemhfY24nXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0sKi9cbiAgICAgICAgICAgICAgICAgICAgcmVucmVuOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzaGFyZVVybDogJ2h0dHA6Ly9zaGFyZS5yZW5yZW4uY29tL3NoYXJlL2J1dHRvbnNoYXJlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIC8qcGFyYW1zOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGluazogdGhpcy51cmxcbiAgICAgICAgICAgICAgICAgICAgICAgIH0qL1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBteXNwYWNlOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzaGFyZVVybDogJ2h0dHBzOi8vbXlzcGFjZS5jb20vcG9zdCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAvKnBhcmFtczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHU6IHRoaXMudXJsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHQ6IHRoaXMudGl0bGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYzogdGhpcy5kZXNjcmlwdGlvblxuICAgICAgICAgICAgICAgICAgICAgICAgfSovXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIGJsb2dnZXI6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNoYXJlVXJsOiAnaHR0cHM6Ly93d3cuYmxvZ2dlci5jb20vYmxvZy10aGlzLmcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgLypwYXJhbXM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB1OiB0aGlzLnVybCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuOiB0aGlzLnRpdGxlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHQ6IHRoaXMuZGVzY3JpcHRpb25cbiAgICAgICAgICAgICAgICAgICAgICAgIH0qL1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBiYWlkdToge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2hhcmVVcmw6ICdodHRwOi8vY2FuZy5iYWlkdS5jb20vZG8vYWRkJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIC8qcGFyYW1zOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaXQ6IHRoaXMudGl0bGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaXU6IHRoaXMudXJsXG4gICAgICAgICAgICAgICAgICAgICAgICB9Ki9cbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgZG91YmFuOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzaGFyZVVybDogJ2h0dHBzOi8vd3d3LmRvdWJhbi5jb20vc2hhcmUvc2VydmljZScsXG4gICAgICAgICAgICAgICAgICAgICAgICAvKnBhcmFtczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IHRoaXMudGl0bGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaHJlZjogdGhpcy51cmwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW1hZ2U6IHRoaXMuaW1hZ2VcbiAgICAgICAgICAgICAgICAgICAgICAgIH0qL1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBva3J1OiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzaGFyZVVybDogJ2h0dHBzOi8vY29ubmVjdC5vay5ydS9kaycsXG4gICAgICAgICAgICAgICAgICAgICAgICAvKnBhcmFtczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdzdC5jbWQnOiAnV2lkZ2V0U2hhcmVQcmV2aWV3JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnc3Quc2hhcmVVcmwnOiB0aGlzLnVybCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAndGl0bGUnOiB0aGlzLnRpdGxlXG4gICAgICAgICAgICAgICAgICAgICAgICB9Ki9cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgY29uc3RydWN0b3IoKSB7fVxuXG5cbiAgcHJpdmF0ZSB1cmxTaGFyZXIoc2hhcmVyOiBhbnkpIHtcbiAgICAgICAgICAgIHZhciBwID0gc2hhcmVyLnBhcmFtcyB8fCB7fSxcbiAgICAgICAgICAgICAgICBrZXlzID0gT2JqZWN0LmtleXMocCksXG4gICAgICAgICAgICAgICAgaTogYW55LFxuICAgICAgICAgICAgICAgIHN0ciA9IGtleXMubGVuZ3RoID4gMCA/ICc/JyA6ICcnO1xuICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IGtleXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpZiAoc3RyICE9PSAnPycpIHtcbiAgICAgICAgICAgICAgICAgICAgc3RyICs9ICcmJztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHBba2V5c1tpXV0pIHtcbiAgICAgICAgICAgICAgICAgICAgc3RyICs9IGtleXNbaV0gKyAnPScgKyBlbmNvZGVVUklDb21wb25lbnQocFtrZXlzW2ldXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc2hhcmVyLnNoYXJlVXJsICs9IHN0cjtcblxuICAgICAgICAgICAgaWYgKCFzaGFyZXIuaXNMaW5rKSB7XG4gICAgICAgICAgICAgICAgdmFyIHBvcFdpZHRoID0gc2hhcmVyLndpZHRoIHx8IDYwMCxcbiAgICAgICAgICAgICAgICAgICAgcG9wSGVpZ2h0ID0gc2hhcmVyLmhlaWdodCB8fCA0ODAsXG4gICAgICAgICAgICAgICAgICAgIGxlZnQgPSB3aW5kb3cuaW5uZXJXaWR0aCAvIDIgLSBwb3BXaWR0aCAvIDIgKyB3aW5kb3cuc2NyZWVuWCxcbiAgICAgICAgICAgICAgICAgICAgdG9wID0gd2luZG93LmlubmVySGVpZ2h0IC8gMiAtIHBvcEhlaWdodCAvIDIgKyB3aW5kb3cuc2NyZWVuWSxcbiAgICAgICAgICAgICAgICAgICAgcG9wUGFyYW1zID0gJ3Njcm9sbGJhcnM9bm8sIHdpZHRoPScgKyBwb3BXaWR0aCArICcsIGhlaWdodD0nICsgcG9wSGVpZ2h0ICsgJywgdG9wPScgKyB0b3AgKyAnLCBsZWZ0PScgKyBsZWZ0LFxuICAgICAgICAgICAgICAgICAgICBuZXdXaW5kb3cgPSB3aW5kb3cub3BlbihzaGFyZXIuc2hhcmVVcmwsICcnLCBwb3BQYXJhbXMpO1xuXG4gICAgICAgICAgICAgICAgaWYgKHdpbmRvdy5mb2N1cykge1xuICAgICAgICAgICAgICAgICAgICBuZXdXaW5kb3cuZm9jdXMoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gc2hhcmVyLnNoYXJlVXJsO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cblxucHJpdmF0ZSBnZXRTaGFyZXIoKXtcbiAgICB2YXIgX3NoYXJlcjogYW55ID0ge307XG4gICAgaWYodGhpcy5mYWNlYm9vayl7XG4gICAgICAgIF9zaGFyZXI9IHRoaXMuc2hhcmVyc1snZmFjZWJvb2snXVxuICAgICAgICBfc2hhcmVyLnBhcmFtcyA9IHRoaXMuZmFjZWJvb2tcbiAgICB9XG4gICAgaWYodGhpcy5nb29nbGVQbHVzKXtcbiAgICAgICAgX3NoYXJlcj0gdGhpcy5zaGFyZXJzWydnb29nbGVwbHVzJ11cbiAgICAgICAgX3NoYXJlci5wYXJhbXMgPSB0aGlzLmdvb2dsZVBsdXNcbiAgICB9XG5cbiAgICBpZih0aGlzLnR3aXR0ZXIpe1xuICAgICAgICBfc2hhcmVyID0gdGhpcy5zaGFyZXJzWyd0d2l0dGVyJ107XG4gICAgICAgIF9zaGFyZXIucGFyYW1zID0gdGhpcy50d2l0dGVyO1xuICAgIH1cblxuICAgIGlmKHRoaXMucGludGVyZXN0KSB7XG4gICAgICAgIF9zaGFyZXIgPSB0aGlzLnNoYXJlcnNbJ3BpbnRlcmVzdCddO1xuICAgICAgICBfc2hhcmVyLnBhcmFtcyA9IHRoaXMucGludGVyZXN0O1xuICAgIH1cblxuICAgIGlmKHRoaXMubGlua2VkSW4pe1xuICAgICAgICBfc2hhcmVyID0gdGhpcy5zaGFyZXJzWydsaW5rZWRpbiddO1xuICAgICAgICBfc2hhcmVyLnBhcmFtcyA9IHRoaXMubGlua2VkSW47XG4gICAgfVxuXG4gICAgcmV0dXJuIF9zaGFyZXI7XG5cbn1cblxuICBASG9zdExpc3RlbmVyKCdjbGljaycpIHNoYXJlKCl7XG4gICAgICAgIFxuXG4gICAgICAgICAgICB2YXIgcyA9IHRoaXMuZ2V0U2hhcmVyKClcbiAgICAgICAgICAgIC8vIGN1c3RvbSBwb3B1cHMgc2l6ZXNcbiAgICAgICAgICAgIGlmIChzKSB7XG4gICAgICAgICAgICAgICAgcy53aWR0aCA9IHRoaXMuc2hhcmVXaWR0aDtcbiAgICAgICAgICAgICAgICBzLmhlaWdodCA9IHRoaXMuc2hhcmVIZWlnaHRcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBzICE9PSB1bmRlZmluZWQgPyB0aGlzLnVybFNoYXJlcihzKSA6IGZhbHNlO1xuXG4gIH1cblxuICAgXG5cbn1cbiJdfQ==