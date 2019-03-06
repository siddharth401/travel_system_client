$(function(){
	
	//naviブロック　アコーディオン
	var ww = $(window).width();
	var ch = $('.mypage__content').height();
	var nh = $('.mypage__menu').height();
	
	$(window).on('load', function(){
		if(ww<1600){
			$('.mypage__menu').addClass('mypage__menu__acc');
			
			$('.mypage__menu__acc').click(function () {
				if($('.mypage__menu-list').css("left") == "-300px"){
					$('.mypage__menu-list').animate({
						'left': '0px'
					});
				}else{
					$('.mypage__menu-list').animate({
						'left': '-300px'
					});
				}
				$('.mypage__menu').toggleClass('mypage__menu__acc--active');
			 });
			 
			$('.mypage__breadcrumb i').click(function () {
				$('.mypage__breadcrumb').toggleClass('mypage__breadcrumb--active');
				if($('.mypage__menu-list').css("left") == "-300px"){
					$('.mypage__menu-list').animate({
						'left': '0px'
					});
				}else{
					$('.mypage__menu-list').animate({
						'left': '-300px'
					});
				}
				$('.mypage__menu').toggleClass('mypage__menu__acc--active');
			 });
			 
		}else{
			$('.mypage__menu').removeClass('mypage__menu__acc');
		}
		$('.mypage__menu-list').css({
			'min-height': ch + 50
		});
	});

	//naviリスト　アコーディオン
	$('.is-current').addClass('js-acc-trigger--active');
	$('.js-acc-trigger').click(function () {
		$('ul.mypage__menu-list > li').removeClass('js-acc-trigger--active');
		$(this).next('ul').slideToggle();
		$(this).toggleClass('js-acc-trigger--active');
		return false;
	});
});
