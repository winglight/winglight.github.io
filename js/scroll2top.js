$(function(){
	var tophtml="<div id=\"izl_rmenu\" class=\"izl-rmenu\"><a href=\"tencent://Message/?Uin=12002692&websiteName=terraco.com.cn=&Menu=yes\" class=\"abtn btn-qq\"></a><div class=\"abtn btn-wx\"><div class=\"pic\"></div></div><a href=\"/terraco/contact/\"><div class=\"abtn btn-phone\"><div class=\"phone\">广东 8008309983<br>上海 8009881306</div></div><div class=\"abtn btn-top\"></div></div></a>";
	$("#scrolltop").html(tophtml);
	$("#izl_rmenu").each(function(){
		$(this).find(".btn-wx").mouseenter(function(){
			$(this).find(".pic").fadeIn("fast");
		});
		$(this).find(".btn-wx").mouseleave(function(){
			$(this).find(".pic").fadeOut("fast");
		});
		$(this).find(".btn-phone").mouseenter(function(){
			$(this).find(".phone").fadeIn("fast");
		});
		$(this).find(".btn-phone").mouseleave(function(){
			$(this).find(".phone").fadeOut("fast");
		});
		$(this).find(".btn-top").click(function(){
			$("html, body").animate({
				"scroll-top":0
			},"fast");
		});
	});
	var lastRmenuStatus=false;
	$(window).scroll(function(){//bug
		var _top=$(window).scrollTop();
		if(_top>200){
			$("#izl_rmenu").data("expanded",true);
		}else{
			$("#izl_rmenu").data("expanded",false);
		}
		if($("#izl_rmenu").data("expanded")!=lastRmenuStatus){
			lastRmenuStatus=$("#izl_rmenu").data("expanded");
			if(lastRmenuStatus){
				$("#izl_rmenu .btn-top").slideDown();
			}else{
				$("#izl_rmenu .btn-top").slideUp();
			}
		}
	});
});