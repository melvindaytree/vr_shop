var Dsw = Dsw || {};

Dsw.SiteType = function () {
	
	var siteTypeObject = function(contextRoot, siteRoot, loginUrlReturn, myRewardsUrl, overlayTopMargin) {
		
		var trimLeadingSlash = function(s) {
			return (s.substr(0, 1) === '/') ? s.substr(1) : s;
		};

		var self = {};
		
		self.contextRoot = contextRoot;
		
		self.siteRoot = siteRoot;
		
		self.loginUrl = function() {
			return self.applyContextRootTo (loginUrlReturn);
		};

        self.myRewardsUrl = function() {
            return self.applyContextRootTo (myRewardsUrl);
        };
		
		self.overlayTopMargin = overlayTopMargin;
		
		self.applyContextRootTo = function (url) {
			return self.siteRoot + trimLeadingSlash(url);
		};
		
		return self;
	};
	
	return {
		FULL: siteTypeObject('/dsw_shoes', '/dsw_shoes/', '/user/login?reason=cc', '/user/myDSW.jsp', 200),
		MOBILE: siteTypeObject('/m', '/', '/account/login?reason=cc', '/account/rewards', 50)
	};
	
} ();

Dsw.SiteTypes = function() {
	
	var self = {};
	
	self.types = function() {
		return _.values(Dsw.SiteType);		
	};
	
	self.contextRoots = function() {
		return _.map (self.types(), function (siteType) {return siteType.contextRoot;});				
	};
	
	self.findByContextRoot = function(contextRoot) {
		return _.find (self.types(), function (siteType) {
			return siteType.contextRoot === contextRoot;
		});		
	};
	
	return self;
	
} ();

Dsw.Utils = function ($) {

	var siteType = null;
	
	var makeValidationMessage = function (proposedContextRoot) {
		var msg = 'Dsw.Utils.config() must be called with one of these context roots: ' + Dsw.SiteTypes.contextRoots().join(', ');
		var suffix = proposedContextRoot ? ' -- not ' + proposedContextRoot : '';		
		return msg + suffix;
	};
	
	var validateSiteType = function (proposedContextRoot) {
		if (!siteType) {
			throw makeValidationMessage (proposedContextRoot);
		}
	};
	
	var self = {};
	
	self.config = function(contextRoot) {
		siteType = Dsw.SiteTypes.findByContextRoot(contextRoot);
		validateSiteType (contextRoot);
		return siteType;
	};
	
	self.siteType = function () {
		validateSiteType ();
		return siteType;
	};
	
	self.contextRoot = function () {
		return self.siteType ().siteRoot;
	};
	
	self.applyContextRootTo = function (url) {
		return self.siteType ().applyContextRootTo (url);
	};
	
	self.navigateTo = function (url) {
		window.location.href = url;
	};
	
	self.openNewWindowAt = function (url) {
		window.open (url);
	};
	
	self.currentHref = function () {
		return window.location.href;
	};
	
	self.currentQueryString = function () {
		return window.location.search;
	};

	self.addQueryParameter = function addQueryParameter( oOptions ) {
		if( !oOptions ) {
			console.info('No options given to method - addQueryParameter.');
			return document.location.href;
		}
        var sUrl = typeof oOptions.sUrl !== 'undefined' ? oOptions.sUrl : window.location.href;
		var sKey = oOptions.sKey;
		var sValue = oOptions.sValue;
		if( !sKey ) {
			console.info('No key given to method - addQueryParameter.');
			return sUrl;
		}
		var rQueryRegex = new RegExp("([?&])" + sKey + "=.*?(&|#|$)(.*)", "gi");

		if( rQueryRegex.test(sUrl) ) {
			if( typeof sValue !== 'undefined' && sValue !== null ) {
				return sUrl.replace( rQueryRegex, '$1' + sKey + "=" + sValue + '$2$3' );
			} else {
				var hash = sUrl.split('#');
				sUrl = hash[0].replace(rQueryRegex, '$1$3').replace(/(&|\?)$/, '');
				if( typeof hash[1] !== 'undefined' && hash[1] !== null )
					sUrl += '#' + hash[1];
				return sUrl;
			}
		} else {
			if( typeof sValue !== 'undefined' && sValue !== null ) {
				var separator = sUrl.indexOf('?') !== -1 ? '&' : '?';
				var hash = sUrl.split('#');
				sUrl = hash[0] + separator + sKey + '=' + sValue;
				if( typeof hash[1] !== 'undefined' && hash[1] !== null ) {
					sUrl += '#' + hash[1];
				}
				return sUrl;
			} else {
				return sUrl;
			}
		}
	};

	self.extractQueryParameters = function (sUrl) {
        sUrl = sUrl || window.location.href;
        var result = {};
        if (sUrl.split('?').length === 1) {
            return result;
        }
		var pairs = sUrl.split('?')[1].slice(0).split('#')[0].slice(0).split('&');
		for(var i = 0; i < pairs.length; i++) {
			var pair = pairs[i];
			if (pair !== '') {
				var splitPair = pair.split('=');
				result[splitPair[0]] = decodeURIComponent(splitPair[1] || '');
			}
		}
		return result;
	};
		
	self.ajax = function (options) { // because HtmlUnit doesn't like it when we mock jQuery.ajax		
		$.ajax (options);
	};
	
	self.reload = function() {
		window.location.reload();
	};

	self.executeDependingOnSiteType = function (fullSiteFunction, mobileSiteFunction) {
		if (siteType === Dsw.SiteType.FULL) {
			if (fullSiteFunction) {fullSiteFunction ();}
		}
		if (siteType === Dsw.SiteType.MOBILE) {
			if (mobileSiteFunction) {mobileSiteFunction ();}
		}
	};
	
	// just for testing
	self.reset = function () {
		siteType = undefined;
	};
	
	return self;
	
} (this.jQuery || this.Zepto);

Dsw.Json = function () {
	var self = {};

	self.stringifyJSON = function(objectValue) {
		var stringValue = null;
		if (window.JSON && window.JSON.stringify) {
			stringValue = window.JSON.stringify(objectValue);
		} else if (window.MooTools) {
			stringValue = JSON.encode(objectValue);
		}
		return stringValue;
	};

	self.parseJSON = function(stringValue) {
		var objectValue = null;
		if (typeof stringValue != 'undefined' && stringValue != undefined
				&& stringValue != '') {
			if (window.JSON && window.JSON.parse) {
				objectValue = window.JSON.parse(stringValue);
			} else if (window.MooTools) {
				objectValue = JSON.decode(stringValue);
			}
		}
		return objectValue;
	};
	
	return self;
} ();

Dsw.CookieUtils = function () {
	
	var self = {};

	self.saveToCookie = function(object, cookieName) {
		var json = Dsw.Json.stringifyJSON (object);
		self.writeCookie(cookieName, json);
	};
	
	self.restoreFromCookie = function (cookieName) {
		var json = self.readCookie (cookieName);
		return Dsw.Json.parseJSON (json);
	};

	self.writeCookie = function(cookieName, value, duration) {
		value = (value === undefined) ? "" : value.replace (/'/g, '&apos;'); // because either Chrome or JBoss can't handle single quotes in cookies
		value = encodeURIComponent(value);
		value = value + '; path=/';
		if (duration) {
			var date = new Date();
			date.setTime(date.getTime() + duration * 24 * 60 * 60 * 1000);
			value += '; expires=' + date.toGMTString();
		}
		var cookieText = cookieName + '=' + value;
		document.cookie = cookieText;
	};

	self.readCookie = function(cookieName) {
		var valueGroups = document.cookie.match('(?:^|;)\\s*'
				+ cookieName.replace(/([-.*+?^${}()|[\]\/\\])/g, '\\$1')
				+ '=([^;]*)');
		var value = (valueGroups) ? decodeURIComponent(valueGroups[1]) : null;
		return value;
	};

	self.disposeCookie = function(cookieName) {
		self.writeCookie(cookieName, '', -1);
	};
	
	return self;
} ();

Dsw.CCUtils = function(){
    // cardBINs can be passed in as a single value, a list of values or an array of values
    // cardLengthMax is optional.  If left off, it will be set to cardLengthMin (meaning the card has to equal one length instead of be in a range)
    var cardTypeObject = function(cardName, cardID, cardBINs, cardLengthMin, cardLengthMax){
        var name = cardName;
        var id = cardID;
        var BINs = cardBINs;
        var lengthMin = lengthMax = cardLengthMin;
        if (cardLengthMax){
            lengthMax = cardLengthMax;
        }

        // If the list of acceptables BINs was passed in as a list, split it into an array.
        if (!_.isArray(BINs)){
            BINs = BINs.split(",");
        }

        var self = {};

        self.getID = function(){ return id; };

        self.getName = function(){ return name; };

        self.isMatch = function(cardNumber){
            var retVal = false;
            // first check if the length is good
            if (cardNumber.length >= lengthMin && cardNumber.length <= lengthMax){
                // now check if the number starts with any of the BINs for this card type
                _.each(BINs, function(element){
                    if (cardNumber.indexOf(element) === 0){
                        retVal = true;
                    }
                });
            }

            return retVal;
        };

        return self;
    };

    var getCardTypes = function() {
        // for now we're just worried about VISA and DSW VISA, but other card types can easily be added.
        return {
            VISA : cardTypeObject("VISA", "VISA", ["4"], 13, 16),
            DSW_VISA : cardTypeObject("DSW VISA", "DSW_VISA", ["467639"], 16)
        };
    };

    var isTextInput = function(el){
        return (el !== undefined && el !== null && el.tagName === "INPUT" && (el.type === "text" || el.type === "tel"));
    };

    var isSelect = function(el){
        return (el !== undefined && el !== null && el.tagName === "SELECT");
    };


    var self = {};

    self.getCardTypeFromBIN = function(num){
        // for now we're just checking for VISA and DSW VISA types.  This may be extended to include all card types when requirements ask for it.
        var cardTypes = getCardTypes();
        var retVal = undefined;

        // A DSW_VISA is a VISA, but a VISA may not be a DSW_VISA.  Therefore we must check for VISA first, and DSW_VISA second.
        if (cardTypes.VISA.isMatch(num)){
            retVal = cardTypes.VISA.getID();
        }
        if (cardTypes.DSW_VISA.isMatch(num)){
            retVal = cardTypes.DSW_VISA.getID();
        }

        return retVal;
    };

    // assumes CCNum is a text input element and type is a <select> element
    self.autoSelectType = function(elCCNum, elCCType){
        var typeEntered, typeSelected;

        if (isTextInput(elCCNum) && isSelect(elCCType)){
            typeSelected = elCCType.options[elCCType.selectedIndex].value.replace(" ", "_");
            typeEntered = self.getCardTypeFromBIN(elCCNum.value);
            if (typeSelected != typeEntered){
                // for now we're only autocorrecting VISA to DSW VISA, and vice versa.
                if ((typeSelected === "VISA" || typeSelected === "DSW_VISA") && (typeEntered === "VISA" || typeEntered === "DSW_VISA")){
                    _.each(elCCType.options, function(option){
                        if (option.value.replace(" ", "_") === typeEntered){
                            option.selected = true;
                        }
                    });
                }
            }
        }
    };

    return self;
} ();

/**
 * Dsw.RestUtils includes methods for automatically adding Dynamo Session Confirmation on AJAX requests
 */
Dsw.RestUtils = function ($) {
	'use strict';

	var secureOrigin = generateSecureOrigin();
	var sessionConfirmationCookieKey = 'DSWdsc';
	var self = {
		activeSessionConfirmationPromise: null,
		getSessionConfirmation: getSessionConfirmation,
		ajax: ajax
	};

	/**
	 * Returns a promise that when resolved will contain the session confirmation number. Uses
	 * cookies for caching to reduce origin requests. Cookies should be switched to localStorage
	 * once we are on one origin.
	 * @returns {*} jQuery Promise
	 */
	function getSessionConfirmation () {
		if (Dsw.RestUtils.activeSessionConfirmationPromise != null) {
			return Dsw.RestUtils.activeSessionConfirmationPromise;
		} else {
			var deferred = Dsw.RestUtils.activeSessionConfirmationPromise = $.Deferred();

			$.ajax({
				url: secureOrigin + '/rest/SessionConfirmationActor/getSessionConfirmationNumber',
				dataType: 'text',
				xhrFields: {
					withCredentials: true
				},
				beforeSend: function () {
					var sessionConfirmation = Dsw.CookieUtils.readCookie(sessionConfirmationCookieKey);
					if (sessionConfirmation != null && sessionConfirmation != '') {
						Dsw.CookieUtils.writeCookie(sessionConfirmationCookieKey, sessionConfirmation, .5/24);
						Dsw.RestUtils.activeSessionConfirmationPromise = null;
						deferred.resolve(sessionConfirmation);
						return false;
					}
					return true;
				}
			})
				.done(function (data) {
					var sessionConfirmation = parseSessionConfirmation(data);
					Dsw.CookieUtils.writeCookie(sessionConfirmationCookieKey, sessionConfirmation, .5/24);
					Dsw.RestUtils.activeSessionConfirmationPromise = null;
					deferred.resolve(sessionConfirmation);
				})
				.fail(function (jqXHR, error) {
					Dsw.RestUtils.activeSessionConfirmationPromise = null;
					deferred.reject(error);
				});

			return deferred.promise();
		}
	}

	/**
	 * Takes a session confirmation json object and returns the string representing the session
	 * confirmation number. This is required because larger confirmation numbers can lose
	 * precision when parsed.
	 * @param data
	 * @returns {*}
	 */
	function parseSessionConfirmation(data) {
		var matches = data.match(/\{"sessionConfirmationNumber":(.+)\}/);
		return (matches[1]);
	}

	/**
	 * All REST requests are to go to HTTPS endpoints
	 * @returns {string}
	 */
	function generateSecureOrigin() {
		var secureHost = 'https://';
		var resourcePartials = location.hostname.split('.');

		// Convert mobile to full site
		switch (resourcePartials[0]) {
			case 'origin-m':
				resourcePartials[0] = 'origin-www';
				break;
			case 'origin-m-2':
				resourcePartials[0] = 'origin-www-2';
				break;
			case 'm':
				if (resourcePartials[1] == 'local') {
					resourcePartials.splice(0, 1);
				} else {
					resourcePartials[0] = 'www';
				}
				break;
			case 'm-2':
				resourcePartials[0] = 'www-2';
				break;
		}

		secureHost += resourcePartials.join('.') + (location.port ? ':' + location.port: '');

		return secureHost;
	}

	/**
	 * Acts similar to a normal jQuery.ajax request along with adding session
	 * confirmation on the request. Converts settings.data to JSON if
	 * contentType == 'application/json' and method == 'post'.
	 * @param url
	 * @param settings
	 */
	function ajax (url, settings) {
		var deferred = $.Deferred();

		settings = settings || {};

		// Append withCredentials so that cookies are passed up
		if (!settings.hasOwnProperty('xhrFields')) {
			settings['xhrFields'] = {};
		}
		if (!settings.xhrFields.hasOwnProperty('withCredentials')) {
			settings.xhrFields['withCredentials'] = true;
		}

		// Append _dynSessConf to settings.data
		if (!settings.hasOwnProperty('data')) {
			settings['data'] = {};
		}
		getSessionConfirmation()
			.done(function (sessionConfirmation) {
				settings.data['_dynSessConf'] = sessionConfirmation;

				// Convert settings.data to JSON if performing a JSON POST request
				if (settings.hasOwnProperty('contentType') && settings.contentType == 'application/json') {
					if (settings.hasOwnProperty('method') && settings.method == 'post') {
						settings.data = Dsw.Json.stringifyJSON(settings.data);
					}
				}

				$.ajax(secureOrigin + url, settings)
					.done(function (data) {
						deferred.resolve(data);
					})
					.fail(function (jqXHR, error) {
						if (jqXHR.status === 409) {
							// The session confirmation seems to be out of date, try refreshing it
							Dsw.CookieUtils.disposeCookie(sessionConfirmationCookieKey);
							getSessionConfirmation()
								.done(function (sessionConfirmation) {
									settings.data['_dynSessConf'] = sessionConfirmation;

									// Try the request one more time with the new session
									$.ajax(secureOrigin + url, settings)
										.done(function (data) {
											deferred.resolve(data);
										})
										.fail(function (jqXHR, error) {
											deferred.reject(error);
										})
								})
								.fail(function (jqXHR, error) {
									deferred.reject(error);
								});
						}
						deferred.reject(error);
					});
			})
			.fail(function (jqXHR, error) {
				deferred.reject(error);
			});

		return deferred;
	}

	return self;

} (this.jQuery || this.Zepto);

/**
 * Dsw.localStorage is an abstraction for accessing localStorage. The abstraction is required today as
 * we have four origins (http/https for both m. and www.) and we are using XDLS to consolidate to one
 * single https www. origin. In the future when the site is served solely from a single host on the
 * same scheme, the calls to XDLS can be replaced with calls to localStorage directly.
 */
Dsw.localStorage = function ($, XDLS) {
	'use strict';
	var origin, path, xdls, xdlsScriptElement, self;

	xdlsScriptElement = $('#xdls-script');
	origin = xdlsScriptElement.data('origin');
	path = xdlsScriptElement.data('path');

	if (origin !== undefined && origin !== null && origin != '' && path !== undefined && path !== null && path != '' && XDLS !== undefined) {
		xdls = new XDLS({
			origin: origin,
			path: path
		});
	}

	self = {
		getItem: getItem,
		setItem: setItem,
		removeItem: removeItem,
		clear: clear,
		length: length
	};


	/**
	 * Gets the specified item.
	 * @param key
	 * @param cb Callback requires error and value arguments
	 */
	function getItem (key, cb) {
		xdls.getItem(key, cb);
	}

	/**
	 * Sets the specified item.
	 * @param key
	 * @param value
	 * @param cb Callback requires error argument
	 */
	function setItem (key, value, cb) {
		xdls.setItem(key, value, cb);
	}

	/**
	 * Removes the specified item.
	 * @param key
	 * @param cb Callback requires error argument
	 */
	function removeItem(key, cb) {
		xdls.removeItem(key, cb);
	}

	/**
	 * Clears all items.l
	 * @param cb Callback requires error argument
	 */
	function clear(cb) {
		xdls.clear(cb);
	}

	/**
	 * Gets the number of keys stored.
	 * @param cb Callback requires error and length arguments
	 */
	function length(cb) {
		xdls.length(cb);
	}

	if (xdls != undefined) {
		return self;
	} else {
		return undefined;
	}

} (this.jQuery || this.Zepto, require('xdls'));
