var Omniture=Omniture||{};
if(!s_account){var s_account=""
}if(!specialRedirectVar){var specialRedirectVar=""
}if(!endecaSpecialRedirect){var endecaSpecialRedirect=""
}jQuery.extend(true,Omniture,{Library:{fetchCurrentUrl:function(){var a=(window.location.pathname).replace("/","").replace(/\/.*\/\w\W\d*.*/,"");
if(a&&a!==null&&a!==""&&a==="browse"){console.log(a)
}},omni_searchResults_call:function(){jQuery(document).ready(function(){if(s&&(window.location.pathname.indexOf("/browse")===0)){s.pageName="SEARCH RESULTS";
s.linkTrackVars="events,prop1,prop4,prop5,eVar1,prop6,prop7,prop8,prop9,prop10,prop11,prop12,prop14,prop17,eVar16,eVar17,eVar41,eVar42,eVar44,eVar45,eVar48,eVar57,eVar64,eVar65";
var a=jQuery.makeArray(jQuery(".page-title").text());
a=a[0].trim().split(/"/);
a=a[1];
s.eVar1=s.prop11=s.prop17=a;
s.prop4="Search Results";
s.prop6=s.prop7=s.prop8=s.prop9=s.prop10=s.prop12=s.prop14="";
s.eVar17=s.eVar41=s.eVar42=s.eVar44=s.eVar45=s.eVar48=s.eVar57="";
s.eVar48="Search Results";
if(jQuery("#resultsBar").text()===""){var b="0"
}else{var b=jQuery.makeArray(jQuery("#resultsBar").text().trim().split(/results|result/));
b=b[0].trim()
}s.prop12=s.eVar16=b;
s.linkTrackEvents="";
if(specialRedirectVar!==""){s.events="event1";
s.eVar1=s.prop11=s.prop17=endecaSpecialRedirect.Ntt
}else{if(b==="0"){s.events="event1,event2"
}else{s.events="event1"
}}s.prop13=s.pageName||"no pagename given";
s.tl(this,"o","Content Share")
}})
},make_topNav_array:function(){topNavigationBarLinkArray=[];
topNavBarArray=jQuery("#primaryNav").text().trim().clean().split(" ");
jQuery(".primaryNavLink").each(function(){topNavigationBarLinkArray.push(jQuery(this).attr("href").replace(/\/_\/N-\d*\w*/,"").replace(/\?activeCategory=\d*/,"").replace("/shoe-brands/Womens-Shoes",""))
})
},make_leftNav_array:function(){exceptionLeftNavArray=["/shoe-brands/Womens-Shoes","/shoe-brands/Mens-Shoes","/shoe-brands","/shoe-brands/Handbags","/shoe-brands/Luxury","/handbag"];
if(!exceptionLeftNavArray.contains(window.location.pathname.replace(/\/_\/N-\d*\w*/,""))){leftNavigationBarLinkArray=[];
jQuery("#leftNavZone a").each(function(){leftNavigationBarLinkArray.push(jQuery(this).attr("href").replace(/\/_\/N-\d*\w*/,"").replace(/\?activeCategory=\d*/,""))
})
}},make_collectionFilter_array:function(){collectionFilterArray=[];
jQuery(".color .checked label").each(function(){collectionFilterArray.push(jQuery(this).text())
});
collectionFilterArray=_.uniq(collectionFilterArray);
currentUrlArray=window.location.pathname.replace(/\/_\/N-\d*\w*/,"").split("/")
},compare_topNavToCurrentPage:function(){return topNavigationBarLinkArray.contains(window.location.pathname.replace(/\/_\/N-\d*\w*/,""))
},compare_leftNavToCurrentPage:function(){return leftNavigationBarLinkArray.contains(window.location.pathname.replace(/\/_\/N-\d*\w*/,""))
},compare_collectionFiltersToCurrentPage:function(){if(jQuery(collectionFilterArray).not(currentUrlArray).get().length===0){return true
}else{return false
}},omni_landingPages_call:function(){jQuery(document).ready(function(){if(s){s.pageName=jQuery(".primaryNavActive").text().clean().toLowerCase()+" Landing Page";
s.pageName=s.pageName.replace(s.pageName[0],s.pageName[0].toUpperCase());
s.linkTrackVars="hier1,prop1,prop4,prop5,eVar1,prop1,prop6,prop7,prop8,prop9,prop10,prop11,prop12,prop14,prop17,eVar16,eVar17,eVar41,eVar42,eVar44,eVar45,eVar48,eVar57";
var a=jQuery.makeArray(jQuery(".page-title").text());
a=a[0].trim().split(/"/);
a=a[1];
s.eVar1=s.prop11=s.prop17=a;
s.prop4="Landing Page";
s.prop1=s.prop6=s.prop7=s.prop8=s.prop9=s.prop10=s.prop12=s.prop14="";
s.eVar17=s.eVar41=s.eVar42=s.eVar44=s.eVar45=s.eVar48=s.eVar57="";
s.prop1=jQuery(".primaryNavActive").text().clean().toLowerCase();
s.prop1=s.prop1.replace(s.prop1[0],s.prop1[0].toUpperCase());
if(jQuery("#resultsBar").text()===""){var b="0"
}else{var b=jQuery.makeArray(jQuery("#resultsBar").text().trim().split(/results|result/));
b=b[0].trim()
}s.hier1=s.prop1+", "+s.pageName;
s.linkTrackEvents="";
s.events="";
s.prop13=s.pageName||"no pagename given";
s.t(this,"o","Content Share")
}})
},omni_collectionPages_call:function(){jQuery(document).ready(function(){if(s){s.pageName="Collection: ("+jQuery(".primaryNavActive").text().clean()+") "+jQuery("a.active").text()+" ("+jQuery("a.active").data("omniture-info")+")";
s.linkTrackVars="hier1,prop1,prop2,prop4,prop5,eVar1,prop6,prop7,prop8,prop9,prop10,prop11,prop14,prop17,eVar17,eVar41,eVar42,eVar44,eVar45,eVar57";
var a=jQuery.makeArray(jQuery(".page-title").text());
a=a[0].trim().split(/"/);
a=a[1];
s.eVar1=s.prop11=s.prop17=a;
s.prop4="Collection";
s.prop6=s.prop7=s.prop8=s.prop9=s.prop10=s.prop12=s.prop14="";
s.eVar17=s.eVar41=s.eVar42=s.eVar44=s.eVar45=s.eVar48=s.eVar57="";
s.eVar48="Search Results";
if(jQuery("#resultsBar").text()===""){var b="0"
}else{var b=jQuery.makeArray(jQuery("#resultsBar").text().trim().split(/results|result/));
b=b[0].trim()
}s.prop12=s.eVar16=b;
s.prop1=jQuery(".primaryNavActive").text().clean();
s.prop2=jQuery("a.active").text()+" ("+jQuery("a.active").data("omniture-info")+")";
s.hier1=s.prop1+", "+s.pageName;
s.linkTrackEvents="";
s.events="";
s.prop13=s.pageName||"no pagename given";
s.t(this,"o","Content Share")
}})
},scCreateOmnitureTag:function(c){if(s){var b=s_gi(s_account);
var a=a||{};
jQuery.extend(true,a,{productID:jQuery("input#productId").val()});
if(typeof(jQuery("input#productId").val())==="undefined"){jQuery.extend(true,a,{productID:c.currentProductId})
}window.bopisState=window.bopisState||"";
s.pageName=c.pageName;
s.prop1=s.prop4="";
s.prop1=c.prop1;
s.prop4=c.prop4;
s.products=";"+a.productID+";;;;eVar33="+s.prop4+window.bopisState;
s.events=c.events;
s.linkTrackEvents=s.events;
s.linkTrackVars!=="None"?s.linkTrackVars=s.linkTrackVars+", eVar32, prop1, prop4, events, products":s.linkTrackVars="eVar32, prop1, prop4, events, products";
s.tl(c,"-","o","bopis initiated")
}}}});
jQuery.extend(true,Omniture,{Library:{extendNamespace:function(a,d){var e=Object.prototype.toString,b=e.call({});
for(var c in d){if(d[c]&&b===e.call(d[c])){a[c]=a[c]||{};
extend(a[c],d[c])
}else{a[c]=d[c]
}}return a
}},Test:{test:function(){function c(d,g){var h=Object.prototype.toString,e=h.call({});
for(var f in g){if(g[f]&&e===h.call(g[f])){d[f]=d[f]||{};
c(d[f],g[f])
}else{d[f]=g[f]
}}return d
}console.group("objExtend namespacing tests");
var b=b||{};
c(b,{utils:{}});
console.log("test 1",b);
c(b,{hello:{world:{wave:{test:function(){}}}}});
b.hello.test1="this is a test";
b.hello.world.test2="this is another test";
console.log("test 2",b);
b.library={foo:function(){}};
c(b,{library:{bar:function(){}}});
console.log("test 3",b);
var a=b.hello.world;
a.test3="hello again";
console.log("test 4",b);
console.groupEnd()
}}});
(function(){if(window.location.hostname==="local.dsw.com"){}var a=Dsw.Utils.extractQueryParameters();
if(window.location.pathname.indexOf("/browse")===0&&!a.cm_mmc){Omniture.Library.omni_searchResults_call()
}Omniture.Library.make_topNav_array();
if(Omniture.Library.compare_topNavToCurrentPage()===true){Omniture.Library.omni_landingPages_call()
}Omniture.Library.make_leftNav_array();
if(Omniture.Library.compare_leftNavToCurrentPage()===true){Omniture.Library.omni_collectionPages_call()
}Omniture.Library.make_collectionFilter_array();
if(Omniture.Library.compare_topNavToCurrentPage()===false&&Omniture.Library.compare_leftNavToCurrentPage()===false&&Omniture.Library.compare_collectionFiltersToCurrentPage()===true&&window.location.pathname.indexOf("/browse")!==0&&window.location.pathname.replace(/\/_\/N-\d*\w*/,"").contains("shoe-brands")!==true&&window.location.pathname.contains("_/N-")===true){Omniture.Library.omni_collectionPages_call()
}}).call(this);