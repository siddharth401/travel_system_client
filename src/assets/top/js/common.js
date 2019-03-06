$(function(){

	var header = $('header.header');
	var topBtn = $('#pageTop a');

	var tabs = $('ul.tab__list');
	var tab = tabs.find('a');
	var search_trigger = $('.header__search-trigger');

	var user_menu = $('div.user-menu');

	topBtn.hide();

	$(window).scroll(function () {
		if ($(this).scrollTop() > 0) {
			header.addClass('scrolled');
			topBtn.fadeIn();
		} else {
			header.removeClass('scrolled');
			topBtn.fadeOut();
		}
	});

	$(".btnCboxIframe").colorbox({
		iframe:true,
		width:"100%",
		height:"100%",
		maxWidth:'100%',
		maxHeight:'100%',
		transition: "fade",
		fixed:true,
		opacity : 1
	});

	tab.on('click',function(){
		tab.removeClass('is-current');
		$(this).addClass('is-current');
		var tab_target = $(this).data('target');
		$('div.tab__section').hide();
		$('div'+tab_target).fadeIn();
	});

	topBtn.click(function () {
		$('body,html').animate({
			scrollTop: 0
		}, 500);
		return false;
	});

	user_menu.click(function(){
		$(this).toggleClass('is-active');
		$(this).next('div').slideToggle();
	})

	//今日の日付を取得してカレンダーに設定
	var today = new Date();
	var year = today.getFullYear();
	var month = today.getMonth();
	var week = today.getDay();
	var day = today.getDate();

	$('#input-date').pickadate({
		monthsFull: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
		weekdaysShort: ['日', '月', '火', '水', '木', '金', '土'],
		today: '今日',
		clear: 'クリア',
		close: '閉じる',
		labelMonthNext: '次月',
		labelMonthPrev: '前月',
		format: 'yyyy/mm/dd',
		min: [year,month,day]
	});
	/* 	 $('select.easy-select').easySelectBox({speed:100}); */
	if($('.easy-select').length){
		$('.easy-select').select2();
	}


	$.slidebars({
		siteClose: true, // true or false
		hideControlClasses: true, // true or false
		scrollLock: true // true or false
	});

	search_trigger.on('click',function(){
		$(this).toggleClass('is-active');
		$('div.search--sp').slideToggle();
	});

	// #で始まるアンカーをクリックした場合に処理
	$('a[href^=#]').click(function() {
		// スクロールの速度
		var speed = 400; // ミリ秒
		// アンカーの値取得
		var href= $(this).attr("href");
		// 移動先を取得
		var target = $(href == "#" || href == "" ? 'html' : href);
		// 移動先を数値で取得
		var position = target.offset().top;
		// スムーススクロール
		$('body,html').animate({scrollTop:position}, speed, 'swing');
		return false;
	});


});