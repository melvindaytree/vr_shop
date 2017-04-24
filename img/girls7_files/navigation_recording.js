var NavRec = function() {

	var self = {};
	
	self.TOP_NAV_PATH_LIMIT = 3;
	self.LEFT_NAV_PATH_LIMIT = 3;
	self.PRODUCT_HISTORY_LIMIT = 5;

	self.NavigationTracker = function(navCookie) {
		
		var incrementPath = function (oldPath, limit, newElement, dotsElement) {
			if (oldPath.length >= limit) {return _.take(oldPath, limit - 1).concat([dotsElement]);}
			return oldPath.concat ([newElement]);
		};

		var ref = {};
		ref.emptyNavCookie = '{"left": {"path": [], "hier": [], "count": 0}, "top": {"path": [], "hier": "", "count": 0}}';

		navCookie = pick(navCookie, ref.emptyNavCookie);

		ref.navHistory = Dsw.Json.parseJSON(navCookie);

		ref.modifyLeftHierarchy = function(linkText, categoryId, ancestry) {
			var update = ref.composeUpdate(linkText, categoryId, ancestry);
			var history = ref.navHistory.left.hier;
			var i = 0;
			while (!this.applyUpdateFrameToHistory(i, update, history,
					categoryId)) {
				i++;
			}
		};

		ref.composeUpdate = function(linkText, categoryId, ancestry) {
			var update = [];
			for ( var i = 0; i < ancestry.length; i++) {
				update.push({
					text : null,
					categoryId : ancestry[i],
					clicked : false
				});
			}
			update.push({
				text : linkText,
				categoryId : categoryId,
				clicked : true
			});
			return update;
		};

		ref.applyUpdateFrameToHistory = function(i, update, history, categoryId) {
			if (i >= update.length) {
				return true;
			}
			if (i >= history.length) {
				history.push(update[i]);
			} else if (update[i].categoryId === history[i].categoryId) {
				ref.modifyHistoryFrame(update[i], history[i], categoryId);
			} else {
				history[i] = update[i];
				history.length = i + 1;
			}
			return false;
		};

		ref.modifyHistoryFrame = function(updateFrame, historyFrame, categoryId) {
			if (updateFrame.text !== null) {
				historyFrame.text = updateFrame.text;
			}
			if (historyFrame.categoryId === categoryId) {
				historyFrame.clicked = true;
			}
		};

		ref.clickLeftNav = function(collectionJustSampled, linkText, categoryId, ancestry) {
			if (collectionJustSampled.value()) {
				ref.clearLeftNav();
				collectionJustSampled.abandonCollection();
			}
			ref.navHistory.left.path = incrementPath (ref.navHistory.left.path, self.LEFT_NAV_PATH_LIMIT,
				{text: linkText, categoryId: categoryId}, {text: '...', categoryId: '...'});
			ref.modifyLeftHierarchy(linkText, categoryId, ancestry);
			ref.navHistory.left.count++;
		};

		ref.clickTopNav = function(collectionJustSampled, linkText) {
			if (collectionJustSampled.value()) {
				collectionJustSampled.abandonCollection();
			}
			ref.navHistory.top.path = incrementPath (ref.navHistory.top.path, self.TOP_NAV_PATH_LIMIT, linkText, '...');
			ref.navHistory.top.hier = linkText;
			ref.navHistory.top.count++;
			ref.clearLeftNav();
		};

		ref.toJSON = function() {
			return Dsw.Json.stringifyJSON(this.navHistory);
		};

		ref.getNavHistory = function() {
			return ref.navHistory;
		};

		ref.clearLeftNav = function() {
			ref.navHistory.left.path = [];
			ref.navHistory.left.hier = [];
			ref.navHistory.left.count = 0;
		};

		ref.clearTopNav = function() {
			ref.navHistory.top.path = [];
			ref.navHistory.top.hier = "";
			ref.navHistory.top.count = 0;
		};

		ref.clearNav = function() {
			ref.clearLeftNav();
			ref.clearTopNav();
		};

		return ref;
	};

	self.CollectionJustSampled = function(cookie) {

		var ref = {};

		ref.contents = (cookie === 'true') ? true : false;

		ref.sampleCollection = function() {
			ref.contents = true;
		};

		ref.abandonCollection = function() {
			ref.contents = false;
		};

		ref.value = function() {
			return ref.contents;
		};

		ref.toJSON = function() {
			return (ref.contents) ? 'true' : 'false';
		};

		return ref;
	};

	self.ProductNavigation = function(cookie) {

		var ref = {};

		cookie = pick(cookie, '[]');

		ref.productHistories = Dsw.Json.parseJSON(cookie);

		ref.add = function(productId, tracker) {
			if (ref.productHistories.length >= self.PRODUCT_HISTORY_LIMIT) {return;}
			ref.productHistories.push({
				productId : productId,
				nav : tracker.getNavHistory()
			});
		};

		ref.toJSON = function() {
			return Dsw.Json.stringifyJSON(this.productHistories);
		};

		return ref;

	};

	self.NavigationCookieManager = function() {

		var ref = {};

		ref.getNavigationTracker = function() {
			var navHistory = Dsw.CookieUtils.readCookie('navHistory');
			return new self.NavigationTracker(navHistory);
		};

		ref.saveNavigationTracker = function(tracker) {
			Dsw.CookieUtils.writeCookie ('navHistory', tracker.toJSON ());
		};

		ref.clearTopNavigationTracking = function() {
			var tracker = this.getNavigationTracker();
			tracker.clearTopNav();
			ref.saveNavigationTracker(tracker);
		};

		ref.clearLeftNavigationTracking = function() {
			var tracker = this.getNavigationTracker();
			tracker.clearLeftNav();
			ref.saveNavigationTracker(tracker);
		};

		ref.clearNavigationTracking = function() {
			var tracker = this.getNavigationTracker();
			tracker.clearNav();
			ref.saveNavigationTracker(tracker);
		};

		ref.getCollectionJustSampled = function() {
			var collectionJustSampled = Dsw.CookieUtils
					.readCookie('collectionJustSampled');
			return new self.CollectionJustSampled(collectionJustSampled);
		};

		ref.saveCollectionJustSampled = function(collectionJustSampled) {
			Dsw.CookieUtils.saveToCookie(collectionJustSampled.value (),
					'collectionJustSampled');
		};

		ref.getProductNavigation = function() {
			var productNavigationHistory = Dsw.CookieUtils
					.readCookie('productNavHistory');
			return new self.ProductNavigation(productNavigationHistory);
		};

		ref.saveProductNavigation = function(productNavigation) {
			Dsw.CookieUtils.writeCookie ('productNavHistory', productNavigation.toJSON ());
		};

		ref.clickTopNav = function(text) {
			ref.click(function(tracker, sampled) {
				tracker.clickTopNav(sampled, text);
			});
		};

		ref.clickLeftNav = function(text, categoryId, ancestry) {
			ref.click(function(tracker, sampled) {
				tracker.clickLeftNav(sampled, text, categoryId, ancestry);
			});
		};

		ref.click = function(clicker) {
			var navigationTracker = ref.getNavigationTracker();
			var collectionJustSampled = ref.getCollectionJustSampled();
			clicker(navigationTracker, collectionJustSampled);
			ref.saveCollectionJustSampled(collectionJustSampled);
			ref.saveNavigationTracker(navigationTracker);
		};

		ref.abandonCollection = function() {
			var collectionJustSampled = ref.getCollectionJustSampled();
			collectionJustSampled.abandonCollection();
			ref.saveCollectionJustSampled(collectionJustSampled);
		};

		ref.sampleCollection = function() {
			var collectionJustSampled = ref.getCollectionJustSampled();
			collectionJustSampled.sampleCollection();
			ref.saveCollectionJustSampled(collectionJustSampled);
		};

		ref.recordProductNavigation = function(productId) {
			var navigationTracker = ref.getNavigationTracker();
			var productNavigation = ref.getProductNavigation();
			productNavigation.add(productId, navigationTracker);
			ref.saveProductNavigation(productNavigation);
		};

		return ref;

	};

	self.MobileCollectionClickListener = function() {

		var ref = {};

		self.addClickHandler('div.togglePanel a', function(event, target) {
			var linkText = linkTextFromTarget(target);
			var categoryId = ref.categoryIdFromTarget(target);
			if (categoryId !== null) {
				var ancestry = ref.calculateAncestry(categoryId, target);
				new NavRec.NavigationCookieManager().clickLeftNav(linkText,
						categoryId, ancestry);
			}
		});

		ref.categoryIdFromTarget = function(target) {
			var tokens = tokensFromTarget(target);
			var categoryId = lastArrayValue(tokens);
			if (!categoryId) {
				categoryId = ref.thisElementsParentCategoryId(target);
			}
			return categoryId;
		};

		ref.thisElementsParentCategoryId = function(target) {
			var categoryId = null;
			var element = target.parentNode;
			while (element.id !== 'panel' && !categoryId) {
				if (element.id.indexOf("cat_") === 0) {
					categoryId = element.id.substring(4);
				} else {
					element = element.parentNode;
				}
			}
			return categoryId;
		};

		ref.calculateAncestry = function(categoryId, target) {
			var parentCategoryId = ref.thisElementsParentCategoryId(target);
			if (parentCategoryId !== categoryId) {
				return [ parentCategoryId ];
			} else {
				return [];
			}
		};

		return ref;
	};

	self.TopNavigationClickListener = function() {
		var ref = {};

		self.addClickHandler('#primaryNav>div>.primaryNavLink', function(event,
				target) {
			ref.clickTopNav(linkTextFromTarget(target));
		});

		ref.clickTopNav = function(text) {
			var cookieManager = new NavRec.NavigationCookieManager();
			cookieManager.clickTopNav(text);
		};

		return ref;

	};

	self.LeftNavigationClickListener = function() {

		var ref = {};

		self.addClickHandler('div#leftNavZone a', function(event, target) {
			var linkText = linkTextFromTarget(target);
			//var categoryId = ref.categoryIdFromTarget(target); // Needed for historical reference for time being
                        var categoryId = window.tempCatId;

			if (categoryId !== null) {
				var ancestry = ref.calculateAncestry(target);
				new NavRec.NavigationCookieManager().clickLeftNav(linkText,
						categoryId, ancestry);
			}
		});

		ref.categoryIdFromTarget = function(target) {
			var tokens = tokensFromTarget(target);
			if (tokens[tokens.length - 2] !== 'page-1') {
				return null;
			}
			return trim(tokens[tokens.length - 3]);
		};

		ref.calculateAncestry = function(target) {
			var ancestry = [];
			var li = ref.thisElementsParentListItem(target);
			if (li === null) {
				return ancestry;
			}
			li = ref.thisElementsParentListItem(li);
			while (li !== null) {
				var anchor = ref.thisListItemsAnchor(li);
				if (anchor !== null) {
					ancestry.unshift(ref.categoryIdFromTarget(anchor));
				}
				li = ref.thisElementsParentListItem(li);
			}
			return ancestry;
		};

		ref.thisElementsParentListItem = function(li) {
			var element = li.parentNode;
			while ((element.nodeName !== 'DIV')
					&& (element.getAttribute('id') !== 'leftNavZone')) {
				if (element.nodeName === 'LI') {
					return element;
				}
				element = element.parentNode;
			}
			return null;
		};

		ref.thisListItemsAnchor = function(li) {
			var span = findChild(li, 'SPAN');
			if (span === null) {
				return null;
			}
			var cls = span.getAttribute('class');
			if ((cls !== null) && (cls.indexOf('no-click') !== -1)) {
				return null;
			}
			return findChild(span, 'A');
		};

		return ref;
	};

	self.CheckoutContinueClickListener = function() {
		var ref = {};

		self.addClickHandler('#continue_shopping', function(event, target) {
			ref.updateCookies(function(manager) {
				manager.sampleCollection();
			});
		});

		self.addClickHandler('#check_out_now', function(event, target) {
			ref.updateCookies(function(manager) {
				manager.abandonCollection();
			});
		});

		ref.updateCookies = function(modifyManager) {
			var cookieManager = new NavRec.NavigationCookieManager();
			modifyManager(cookieManager);
		};

		return ref;

	};

	var contains = function(string, substring) {
		return string.indexOf(substring) >= 0;
	};

	var containsParameter = function(url, parameterName) {
		return contains(url, '?' + parameterName + '=')
				|| contains(url, '&' + parameterName + '=');
	};

	var containsPathElement = function(url, pathElement) {
		return contains(url, '/' + pathElement + '/');
	};

	var clickCameFromExternalMarketingLink = function(url) {
		return containsParameter(url, 'cm_mmc');
	};

	var clickCameFromInternalMarketingLink = function(url) {
		return containsParameter(url, 'cm_re');
	};

	var clickTargetsACollection = function(url) {
		return containsPathElement(url, 'collection');
	};

	var clickTargetsAProduct = function(url) {
		return containsParameter(url, 'prodId');
	};

	self.shouldClearLeftNav = function(url) {
		if (clickCameFromExternalMarketingLink(url)) {
			return true;
		}
		if (!clickCameFromInternalMarketingLink(url)) {
			return false;
		}
		return clickTargetsACollection(url) || clickTargetsAProduct(url);
	};

	self.acknowledgePageUrl = function(url) {
		if (self.shouldClearLeftNav(url)) {
			new NavRec.NavigationCookieManager().clearLeftNavigationTracking();
		}
	};

	self.addClickHandler = function(selector, handler) {
		try {
			var results = document.querySelectorAll(selector);
			var handlerWrapper = function(event) {
				var target = null;
                                
				if (event.target) {
					target = event.target;
				} else if (event.srcElement) {
					target = event.srcElement;
				}
				if (target) {
					handler(event, target);
				}
			};
			for (var i = 0; i < results.length; i++) {
				if (results[i].addEventListener) {
					results[i].addEventListener('click', handlerWrapper, false);
				} else if (results[i].attachEvent) {
					results[i].attachEvent('onclick', handlerWrapper);
				}
			}
		} catch (e) {
			log(e.message);
		}
	};

	var linkTextFromTarget = function(target) {
		return trim(target.textContent ? target.textContent : target.innerText);
	};

	var findChild = function(element, nodeName) {
		var node = element.firstChild;
		while (node !== null) {
			if (node.nodeName === nodeName) {
				return node;
			}
			node = node.nextSibling;
		}
		return null;
	};

	var lastArrayValue = function(array) {
		if (array.length < 2)
			return;
		for ( var i = array.length - 1; i >= 0; i--) {
			if (array[i].length > 0) {
				return array[i];
			}
		}
	};

	var tokensFromTarget = function(target) {
		var href = target.href;
		return href.split("/");
	};

	var trim = function(arg) {
		return arg.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
	};

	var pick = function(arg, def) {
		return (((typeof arg === 'undefined') || (arg === null) || (arg === '')) ? def
				: arg);
	};

	var log = function(s) {
		if (window.console)
			console.log(s);
	};

	return self;

}();