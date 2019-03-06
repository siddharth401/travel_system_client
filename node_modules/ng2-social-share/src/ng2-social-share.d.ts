import { FacebookParams } from './facebookParams';
import { TwitterParams } from './twitterParams';
import { GooglePlusParams } from './googlePlusParams';
import { PinterestParams } from './pinterestParams';
import { LinkedinParams } from './linkedinParams';
export declare class CeiboShare {
    facebook: FacebookParams;
    twitter: TwitterParams;
    googlePlus: GooglePlusParams;
    pinterest: PinterestParams;
    linkedIn: LinkedinParams;
    shareWidth: string;
    shareHeight: string;
    private sharers;
    constructor();
    private urlSharer(sharer);
    private getSharer();
    share(): void | boolean;
}
