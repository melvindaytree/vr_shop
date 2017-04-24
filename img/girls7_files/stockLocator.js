var StockLocatorLink=new Class({Implements:[Options,Events],defaultOptions:{data:{},skuId:"",productId:"",size:"",width:"",color:"",qty:1,s7Address:"",openStockLocator:false,supportPriceImages:false,buttonId:"openStockLocator",checkoutPage:true,showSize:true,showWidth:true},initialize:function(a){this.setOptions($merge(this.defaultOptions,a));
this.productId=this.options.productId;
this.stockLocatorButton=$(this.options.buttonId);
this.stockLocatorButton.set("data-sku-id",this.options.skuId);
this.stockLocatorButton.set("data-product-id",this.options.productId);
if(this.stockLocatorButton){this.stockLocatorButton.addEvent("click",this.onStockLocatorClick.bindWithEvent(this));
if(this.options.openStockLocator){this.openStockLocator()
}}},onStockLocatorClick:function(a){this.openStockLocator()
},openStockLocator:function(){var b="checkout/bopis";
if(!this.options.checkoutPage){b="product"
}var a="/dsw_shoes/"+b+"/"+this.options.productId+"/find?";
a+="&size="+this.options.size;
a+="&width="+this.options.width;
a+="&color="+this.options.color;
if(this.options.commerceItemId){a+="&item="+this.options.commerceItemId
}if(this.options.checkoutPage){a+="&mw=y&bopisSearch=y"
}if(this.options.actionType){a+="&actionType="+this.options.actionType
}if(window.stockLocator){window.stockLocator=null
}ModalWindow.stockLocatorModalWindow(a,"Pick Up In Store","730 380 noscroll")
}});
var StockLocator=new Class({Implements:[Options],defaultOptions:{data:{},skuId:"",productId:"",s7Address:"",isKidsProduct:false},initialize:function(a){this.setOptions($merge(this.defaultOptions,a));
this.choicesPrepared=false;
this.currentProducts=this.options.data||{choices:{}};
this.findElements();
this.modalCenter=$("mb_center");
this.modalContents=$("mb_contents");
this.productAction=new ProductAction();
if(this.options.skuId!=""){var b=this.getSku(this.options.skuId);
if(b){this.sizeInput.set("value",b.size);
this.widthInput.set("value",b.width);
this.colorInput.set("value",b.color)
}}this.prepare();
this.updateForm()
},prepare:function(){if(!this.choicesPrepared){this.colorsByCode={};
this.colorsById={};
this.options.data.choices.colors.each(function(a){this.colorsByCode[a.code]=a;
this.colorsById[a.id]=a
},this);
this.defaultColor=this.productImage.src.replace(/^.*_([0-9]+)_ss_.*$/,"$1");
this.updateChoices();
this.prepareEvents();
this.choicesPrepared=true
}},findElements:function(){this.sizeInput=$("size2");
this.widthInput=$("width2");
this.colorInput=$("color2");
this.productInput=$("productId");
this.multipleColorsOrWidths=($("widths2")&&$("widths2").getElements("option").length>1)||($("colors2")&&$("colors2").getElements("button").length>1);
this.skuPrice=$("price");
this.skuPriceColor=$("skuPrice_Color2");
this.productImage=$("productImage");
this.colorLabel=$("ColorLabel2");
this.form=$("stockLocatorSearchForm");
this.loadingIndicator=$("stockLocatorLoading");
this.stockLocatorContainer=$("stockLocatorContainer");
this.zipCode=$("zipCode");
this.city=$("city");
this.stateCode=$("stateCode");
this.findButton=$("find");
this.sizeSelect=$("sizes2");
this.widthSelect=$("widths2")
},prepareEvents:function(){this.form=$("stockLocatorSearchForm");
for(var b in this.currentProducts.choices){var a=b+"2";
switch(this.currentProducts.details[b+"InputType"]){case"option":if($(a)){$(a).addEvent("change",this.onChoiceChange.bindWithEvent(this))
}this.form.getElements(".productOptions ."+b).each(function(c){c.setStyle("display","")
},this);
break;
case"button":this.form.getElements(".productOptions ."+b).each(function(c){if(!Browser.Platform.ios){c.addEvent("mouseenter:relay(button)",this.onButtonEnter.bindWithEvent(this));
c.addEvent("mouseleave:relay(button)",this.onButtonExit.bindWithEvent(this))
}c.addEvent("click:relay(button)",this.onButtonClick.bindWithEvent(this));
c.setStyle("display","")
},this);
break;
case"swatch":this.form.getElements(".productOptions ."+b).each(function(c){if(!Browser.Platform.ios){c.addEvent("mouseenter:relay(img)",this.onSwatchEnter.bindWithEvent(this));
c.addEvent("mouseleave:relay(img)",this.onSwatchExit.bindWithEvent(this))
}c.addEvent("click:relay(img)",this.onSwatchClick.bindWithEvent(this));
c.setStyle("display","")
},this);
break;
case"":this.form.getElements(".productOptions ."+b).each(function(c){c.setStyle("display","none")
},this);
break
}}if(this.zipCode){this.zipCode.addEvent("keydown",this.onKeyDown.bindWithEvent(this));
this.zipCode.addEvent("input",this.onInput.bindWithEvent(this))
}if(this.city){this.city.addEvent("keydown",this.onKeyDown.bindWithEvent(this));
this.city.addEvent("input",this.onInput.bindWithEvent(this))
}if(this.stateCode){this.stateCode.addEvent("keydown",this.onKeyDown.bindWithEvent(this));
this.stateCode.addEvent("change",this.onInput.bindWithEvent(this))
}if(Browser.Engine.trident&&Browser.Engine.version<=4&&this.stateCode){$("stateHeader").setStyle("width",149+"px")
}this.updateSearchButton();
this.addForm=$$(".addForm");
if(this.addForm){this.addForm.each(function(d,c){d.addEvent("click:relay(a)",function(g){var f=$(g.target),e=f.getAttribute("data-name"),h=$("productAction");
h.setAttribute("name",e);
h.setAttribute("value",e);
d.submit();
g.preventDefault()
}.bindWithEvent(this))
})
}},getSku:function(a){for(var b=0;
b<this.options.data.skus.length;
b++){if(this.options.data.skus[b].id==a){return this.options.data.skus[b]
}}},onInput:function(b){var a=$(b.target);
if(a.value){this.hideErrors(a.getParent("fieldset"))
}this.updateSearchButton()
},onKeyDown:function(a){if(a.key=="enter"&&this.form){this.submit();
a.stop()
}else{this.updateSearchButton()
}},showBusy:function(){if(this.loadingIndicator){this.loadingIndicator.setStyle("visibility","visible")
}},onFindClick:function(b){this.showBusy();
if(!this.zipCode.value&&!this.city.value&&!this.stateCode.value){var a=navigator.geolocation;
if(a){a.getCurrentPosition(this.submit.bind(this),this.submit.bind(this))
}else{this.submit()
}}else{this.submit()
}b.stop()
},onButtonEnter:function(b){var a=b.target;
if(a.className!="buttonDisabled"&&a.className!="buttonActive"){if(a.className!="buttonOver"){a.className="buttonOver"
}}b.preventDefault()
},onButtonExit:function(b){var a=b.target;
if(a.className=="buttonOver"){a.className="buttonNormal"
}b.preventDefault()
},onChoiceChange:function(a){this.productAction.clearFlyouts(a.target);
this.updateForm()
},onButtonClick:function(b){var a=b.target;
if(a.className!="buttonDisabled"){if(a.getParent().getChildren("button").length>1){var c=a.className=="buttonActive";
a.getParent().getChildren("button.buttonActive").each(function(d){d.className="buttonNormal"
});
if(!c){a.className="buttonActive"
}this.updateForm()
}this.productAction.clearFlyouts(a)
}b.preventDefault()
},getProductImageSrc:function(a){return this.productImage.src.replace(/^(.*_)([^_]+)(_ss_)(01[?].*)?$/,"$1"+a+"$3$4")
},unfocusSwatch:function(b){if(b.hasClass("swatchActiveTemporary")){b.removeClass("swatchActiveTemporary")
}if(!b.hasClass("swatchActive")){var a=this.defaultColor;
b.getParent().getElements("img.swatchActive").each(function(c){a=c.get("src").replace(/^.*_([^_]+)_ss_.*$/,"$1")
});
this.productImage.src=this.getProductImageSrc(a)
}},focusSwatch:function(a){if(this.productImage){this.productImage.src=this.getProductImageSrc(a.get("src").replace(/^.*_([^_]+)_ss_.*$/,"$1"))
}if(!a.hasClass("swatchActive")){a.addClass("swatchActiveTemporary")
}},selectSwatch:function(b){if(b.getParent().getChildren("img").length>1){var c=b.hasClass("swatchActive");
b.getParent().getElements("img.swatchActive").each(function(d){d.className="swatchNormal"
});
if(!c){b.className="swatchActive"
}this.productAction.clearFlyouts(b);
if(this.productImage){var a=this.defaultColor;
if(!c){a=b.get("src").replace(/^.*_([^_]+)_ss_.*$/,"$1");
this.colorLabel.set("text"," - "+this.colorsByCode[a].label)
}else{this.colorLabel.set("text","")
}this.productImage.src=this.getProductImageSrc(a)
}this.updateForm()
}},onSwatchEnter:function(b){var a=b.target;
if(a.className!="swatchDisabled"){this.focusSwatch(a);
b.preventDefault()
}},onSwatchExit:function(b){var a=b.target;
if(a.className!="swatchActive"){this.unfocusSwatch(a);
b.preventDefault()
}},onSwatchClick:function(b){var a=b.target;
if(a.className!="swatchDisabled"){this.selectSwatch(a);
b.preventDefault()
}},showErrors:function(){this.stockLocatorContainer.getElements(".errorFlyout").fade("in")
},hideErrors:function(a){a.removeClass("error");
a.getElements(".errorHeader").removeClass("errorHeader");
a.getElements(".errorFlyout").dispose()
},updateForm:function(){if(this.currentProducts.details){var b,c,a,d=false
}},submit:function(a){this.showBusy();
var e="product";
if(this.options.checkoutPage){e="checkout/bopis"
}var d=function(){return(this.stockLocatorContainer.getSize())
}.bind(this);
var b=this.stockLocatorContainer.measure(d).y;
var c="/dsw_shoes/"+e+"/"+this.options.productId+"/find";
if(a&&a.coords){c+="?latitude="+a.coords.latitude+"&longitude="+a.coords.longitude
}var f=new Request.HTML({method:this.form.get("method"),url:c,data:this.form,evalScripts:false,onFailure:function(){this.loadingIndicator.setStyle("visibility","hidden")
}.bind(this),onSuccess:function(j,h,g,i){this.stockLocatorContainer.set("html",h.filter("#stockLocatorContainer").get("html"));
if($("mb_caption")){if($("mb_caption").get("text")==="Pick Up In Store Availability"){$("mb_caption").set("text","Pick Up In Store")
}else{$("mb_caption").set("text","Pick Up In Store Availability")
}}$exec(i);
setTimeout(function(){if($("stockLocatorSearchForm")){if(h.filter("#bopisResultsPageTag").length>0){this.findElements();
this.prepareEvents();
this.updateChoices()
}else{this.findElements();
this.prepareEvents()
}}this.adjustOverlay(b)
}.bind(this),100)
}.bind(this)});
f.send()
},adjustOverlay:function(a){var e=function(){return(this.stockLocatorContainer.getSize())
}.bind(this);
var c=this.stockLocatorContainer.measure(e).y;
var f=c-a;
if(a>this.modalCenter.getStyle("height").toInt()){this.modalCenter.setStyle("height",a+"px");
this.modalContents.setStyle("height",(a+1)+"px")
}var d=(this.modalCenter.getStyle("height").toInt()+f)+"px";
var b=(this.modalContents.getStyle("height").toInt()+f)+"px";
new Fx.Tween(this.modalCenter,{duration:"long",onComplete:function(){this.modalContents.setStyle("height",b)
}.bind(this)}).start("height",d)
},optionSortClosure:function(){var a=(arguments.length>0)?$A(arguments):[];
return a.sort(function(d,c){var f=d===null||d===""||d.innerHTML===null||d.innerHTML===""?-1:parseInt(d.innerHTML)||d.innerHTML,e=c===null||c===""||c.innerHTML===null||c.innerHTML===""?1:parseInt(c.innerHTML)||d.innerHTML;
if(f>e){return 1
}if(f<e){return -1
}return 0
})
},sortOptions:function(b,e){var c=b.getElements("option"),a=$A(c);
if(e){try{a=a.sort(e)
}catch(d){}}c.dispose();
a.each(function(h,g){h.inject(b,"bottom")
});
var f=this.sizeInput.value;
a.each(function(h,g){h.set("selected",(h.value==f?"true":""))
})
},createOption:function(c,f,b,e,a){var b=c+"2_"+e.id,d=$(b);
if(d){d.dispose()
}d=new Element("option",{id:b,value:e.id,text:e.label});
d.inject(f,"bottom");
if(this.currentProducts.choices[c].length==1||e.selected){if(c=="sizes"){this.sizeInput.set("value",e.id)
}else{if(c=="widths"){this.widthInput.set("value",e.id);
this.widthSelect.set("value",e.id)
}}}},createButton:function(b,g,i,c,h){var j={},e=b+"2_"+c.id,d=$(e),f="buttonDisabled";
if(!d){d=new Element("button",{id:e,name:e,value:c.id,styles:j}).set("html",c.label);
d.injectInside(g)
}var k=this.sizeInput.value;
var a=this.widthInput.value;
if(this.currentProducts.choices[b].length==1||(!this.choicesPrepared&&c.selected)||(k!=null&&k==c.id)||(a!=null&&a==c.id)){f="buttonActive"
}else{f="buttonNormal"
}d.className=f;
d.set("disabled","buttonDisabled"==f?"disabled":"")
},createSwatch:function(b,e,h,c,f){var d=b+"2_"+c.id,i=this.options.s7Address+this.options.productId+"_"+c.code+"_ss_sw?$slswatches$",g=$(d),a=this.colorInput.get("value");
if(this.skuPrice&&this.skuPrice.hasClass("clearance")){this.skuPriceColor.removeClass("price");
this.skuPriceColor.addClass("clearance")
}if(!g){g=new Element("img",{src:i,id:d,value:c.id,alt:c.label,title:c.label,border:"0"}).setStyle("cursor","pointer")
}if((!this.choicesPrepared&&c.selected)||(a!=null&&a==c.id)||(this.currentProducts.choices[b].length==1&&f==0)){g.set("src",i);
g.className="swatchActive";
this.colorLabel.set("html"," - "+c.label)
}else{g.className="swatchNormal"
}},updateChoices:function(){var e=this.currentProducts,a=this.currentProducts.details;
for(var d in e.choices){var h=d+"2",g=$(h),f=a[d+"InputType"],j=e.choices[d];
if(g){j.each(function(l,k){if(l.enabled){switch(f){case"button":this.createButton(d,g,h+"_"+l.id,l,k);
break;
case"option":this.createOption(d,g,h+"_"+l.id,l,k);
break;
case"swatch":this.createSwatch(d,g,h+"_"+l.id,l,k);
break
}}},this);
if(j.length==0){this.form.getElements("productOptions ."+h).each(function(k){k.setStyle("display","none");
k.set("html","")
},this)
}if(f=="option"&&d!="widths"){this.sortOptions(g,(!this.options.isKidsProduct||(this.options.isKidsProduct&&d!=="sizes"))?this.optionSortClosure:null)
}}}this.productInput.value=this.options.productId;
var b=a.lowestPricePaid,c=this.colorsById[this.colorInput.value],i=c?c.code:this.defaultColor;
if(this.skuPrice&&this.skuPrice.get("html")!=b){this.skuPrice.set("html",b);
if(this.skuPriceColor){this.skuPriceColor.set("html","")
}}if(this.productImage){this.productImage.src=this.getProductImageSrc(i)
}this.updateSearchButton();
this.showErrors()
},validateZipCode:function(a){var b=new RegExp("^\\d{5}$");
if(b.test(a)==false){return false
}return true
},updateSearchButton:function(){var a=((this.sizeInput.value&&this.colorInput.value&&this.widthInput.value)||(!this.showSize&&!this.showWidth&&this.colorInput.value)||(!this.showWidth&&this.sizeInput.value&&this.colorInput.value))&&((this.zipCode.value&&this.validateZipCode(this.zipCode.value))||this.city.value&&this.stateCode.value);
if(!a){this.findButton.addClass("disabled");
this.findButton.addClass("toolTip");
this.findButton.addClass("bopisToolTip");
this.findButton.removeEvents("click")
}else{this.findButton.removeClass("disabled");
this.findButton.removeClass("toolTip");
this.findButton.removeClass("bopisToolTip");
this.findButton.removeEvents("click");
this.findButton.addEvent("click",this.onFindClick.bindWithEvent(this))
}}});