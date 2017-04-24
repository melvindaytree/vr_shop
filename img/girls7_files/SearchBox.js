Dsw=Dsw||{};
Dsw.searchBox=Dsw.searchBox||{};
Dsw.searchBox.results=Dsw.searchBox.results||{};
var SearchBox={attachAutoSuggest:function(){var a={};
a.minAutoSuggestInputLength=3;
a.autoSuggestServiceUrl=jQuery("#serviceUrlVal").val();
a.searchUrl=jQuery("#searchUrlVal").val();
a.containerClass="dimSearchSuggContainer";
a.containerParent="#searchFormContainer";
a.contentPaths=["/content/Common"];
a.templateTypes=["AutoSuggestPanel"];
a.templateIds=[];
jQuery("#searchTerm").endecaSearchSuggest(a)
},bindSearchEvents:function(){var a=true;
jQuery("#searchGo").on("click",function(b){b.preventDefault();
a=true;
SearchBox.submitSearchForm(b,a)
});
jQuery("#searchTerm").keydown(function(c){var b=c.which;
if(b===13){c.preventDefault();
var d=jQuery(".dimSearchSuggContainer div ul li.selected a");
if(d.length>0){var e=SearchBox.getURLParams(d.attr("href"));
jQuery("#searchTerm").val(e.Ntt.replace(/%26/g,"&"));
a=true
}else{a=false
}SearchBox.submitSearchForm(c,a)
}});
jQuery("#searchFormContainer").on("click","ul li a",function(b){b.preventDefault();
a=true;
var c=SearchBox.getURLParams(jQuery(this).attr("href"));
jQuery("#searchTerm").val(c.Ntt.replace(/%26/g,"&"));
SearchBox.submitSearchForm(b,a)
})
},attachIEPlaceholderFix:function(){if(!Modernizr.input.placeholder){var a=jQuery("#searchFormContainer").find(".searchInput");
if(a.val()==""&&a.attr("placeholder")!=""){a.val(a.attr("placeholder").replace(/%26/g,"&"));
a.focus(function(){if(a.val()==a.attr("placeholder")){a.val("")
}});
a.blur(function(){if(a.val()==""){a.val(a.attr("placeholder"))
}})
}}},submitSearchForm:function(d,a){var c=jQuery("#searchTerm").val();
if(c.length>0){var b="";
if(window.location.protocol==="https:"){b="http://"+window.location.hostname+(window.location.port===""?"":window.location.port)
}if(c.indexOf("&")>-1){c=c.replace(/&/g,".and.");
c=c+"&Ntm=1"
}window.location.href=b+"/browse?Dy=1&Nty=1&Ntt="+c.replace(/ /g,"+").replace(/'/g,"")
}},getURLParams:function(a){var b={};
a.substring(1).replace(/[?&]+([^=&]+)=([^&]*)/gi,function(e,c,d){b[c]=d
});
return b
}};
jQuery(document).ready(function(){SearchBox.attachAutoSuggest();
SearchBox.bindSearchEvents();
SearchBox.attachIEPlaceholderFix()
});