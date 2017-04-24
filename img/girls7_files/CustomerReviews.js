var CustomerReviews={resultsPerPage:4,bindSortDropdown:function(){jQuery("#reviewSortDropdown").on("change",function(a){asSortOptions=jQuery("#reviewSortDropdown").val().split("-");
CustomerReviews.paginate(asSortOptions[0].trim(),asSortOptions[1].trim(),0,CustomerReviews.resultsPerPage)
})
},bindNextButton:function(){jQuery("#reviewsNextButton").on("click",function(a){CustomerReviews.paginate(jQuery("#sortByValue").val().trim(),jQuery("#sortDirValue").val().trim(),parseInt(jQuery("#startValue").val())+CustomerReviews.resultsPerPage,CustomerReviews.resultsPerPage)
})
},bindPrevButton:function(){jQuery("#reviewsPrevButton").on("click",function(a){CustomerReviews.paginate(jQuery("#sortByValue").val().trim(),jQuery("#sortDirValue").val().trim(),parseInt(jQuery("#startValue").val())-CustomerReviews.resultsPerPage,CustomerReviews.resultsPerPage)
})
},bindPictures:function(){jQuery(".reviewPhoto").on("click",function(d){jQuery("#picturePopupTemplate #picturePopupImg").attr("src","");
var c=jQuery("#picturePopupTemplate");
var f=jQuery(this).attr("normalUrl");
var a=jQuery(this).attr("title");
jQuery("#picturePopupTemplate #picturePopupImg").attr("src",f);
jQuery("#picturePopupTemplate #picturePopupCaption").html(a);
var e=jQuery(window).width()/2-250,b=jQuery(window).height()/2-250;
c.css({top:b+"px",left:e+"px"});
c.show();
d.stopPropagation();
jQuery(document).one("click",function(g){jQuery("#picturePopupTemplate").hide()
})
})
},paginate:function(c,a,b,d){c=c||"submitDate";
a=a||"asc";
b=b||0;
d=d||CustomerReviews.resultsPerPage;
jQuery.ajax({url:"/product/reviews/"+jQuery("#productIdValue").val().trim(),cache:true,data:{sortBy:c,sortDir:a,start:b,range:d},success:function(e){jQuery("#productRatingViewer").html(e)
}})
}};
jQuery(document).ready(function(){CustomerReviews.bindSortDropdown();
CustomerReviews.bindNextButton();
CustomerReviews.bindPrevButton();
CustomerReviews.bindPictures()
});