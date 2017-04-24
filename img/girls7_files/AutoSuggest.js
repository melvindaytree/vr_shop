/**
 * Copyright (C) 2011 Endeca Technologies, Inc.
 *
 * The use of the source code in this file is subject to the ENDECA
 * TECHNOLOGIES, INC. SOFTWARE TOOLS LICENSE AGREEMENT. The full text of the
 * license agreement can be found in the ENDECA INFORMATION ACCESS PLATFORM
 * THIRD-PARTY SOFTWARE USAGE AND LICENSES document included with this software
 * distribution.
 */

// Search Suggestion Module, specific for typeahead dimension search, implemented as a jQuery Plugin
/* TODO - needs to be namespaced better and set to NOT extend jQuery functionality */
(function ($) {
    /** Constructor,
     * @param $ele the Element to enable Dim Search Suggestion
     * @param opts the options to be applied */
    $.EndecaSearchSuggestor = function (ele, opts) {
        this._active = true;
        this._options = opts;
        this._lastValue = '';
        this._element = ele;
        this._container = $('<div class="' + this._options.containerClass + '"></>');
        this._timeOutId;
        this._hideTimeOutId;
        this._selectedIndex = -1;

        var suggestor = this;

        // Append the container to the current page
        $(this._options.containerParent).append(this._container);

        /** Capture the keyboard event and dispatch to corresponding handlers. */
        ele.keydown(function (e) {
            switch (e.keyCode) {
                case 38: //up, select the previous item
                    if (suggestor._active) {
                        suggestor.moveToPrev();
                    } else {
                        suggestor.show();
                    }
                    break;
                case 40: //down, select the next item
                    if (suggestor._active) {
                        suggestor.moveToNext();
                    } else {
                        suggestor.show();
                    }
                    break;
                case 9: //tab, hide the box
                    suggestor.hide();
                    break;
                case 13: //return, select the highlighted item
                    if (suggestor._active && suggestor._selectedIndex != -1) {
                        e.preventDefault();
                        suggestor.selectItem();
                        return false;
                    }
                    break;
                case 27: // escape, hide the box
                    if (suggestor._active) {
                        suggestor.hide();
                    }
                    break;
                default:
                    //other keys, handle the dim search
                    suggestor.handleRequest();
            }
        });

        //hide box when lost focus
        ele.blur(function (e) {
            var hideFunction = function () {
                suggestor.hide();
            };
            suggestor._hideTimeOutId = setTimeout(hideFunction, 200);
        });
    };


    /** Move the focus to and highlight the next result Item when user type
     * arrow up key. */
    $.EndecaSearchSuggestor.prototype.moveToPrev = function () {
        if (this._selectedIndex == -1) {
            this._selectedIndex = 0;
        } else {
            if (this._selectedIndex == 0) {
                //reach the first one
                return;
            }
            this._selectedIndex--;
        }
        $(".dimResult", this._container).removeClass("selected");
        $($(".dimResult", this._container).get(this._selectedIndex)).addClass("selected");
    };


    /** Move the focus to and highlight the previous result Item when user
     * type arrow down key. */
    $.EndecaSearchSuggestor.prototype.moveToNext = function () {
        if (this._selectedIndex == $(".dimResult", this._container).size() - 1) {
            return;
        }

        this._selectedIndex = this._selectedIndex == -1 ? 0 : this._selectedIndex + 1;

        $(".dimResult", this._container).removeClass("selected");
        $($(".dimResult", this._container).get(this._selectedIndex)).addClass("selected");
    };


    /** Select the highlighted item when user click or type enter key */
    $.EndecaSearchSuggestor.prototype.selectItem = function () {
        if (this._selectedIndex == -1) {
            return;
        }

        var url = $("a", $(".dimResult", this._container)
            .get(this._selectedIndex))
            .attr("href");
        document.location.href = url;
    };


    /** Hide the search suggestion box */
    $.EndecaSearchSuggestor.prototype.hide = function () {
        this._container.hide();
        this._active = false;
    };

    /** Show the search suggestion box */
    $.EndecaSearchSuggestor.prototype.show = function () {
        if (this._container.is(":hidden")) {
            // this.setPosition();
            this._container.show();
            this._active = true;
            this._selectedIndex = -1;
        }
    };

    /** Activate the search suggestion box. */
    $.EndecaSearchSuggestor.prototype.handleRequest = function () {
        var suggestor = this;

        var callback = function () {
            var text = $.trim(suggestor._element.val());
            if (text != suggestor._lastValue) {
                if (text.length >= suggestor._options.minAutoSuggestInputLength) {
                    suggestor.requestData();
                } else {
                    suggestor.hide();
                }
            }
            suggestor._lastValue = text;
        };

        if (this._timeOutId) {
            clearTimeout(this._timeOutId);
        }
        this._timeOutId = setTimeout(callback, this._options.delay);
    };

    /** Send Ajax to backend service to request data */
    $.EndecaSearchSuggestor.prototype.requestData = function () {
        var suggestor = this;

        var response = $.ajax({
            url: suggestor.composeUrl(),
            async: true,
            success: function (data) {
                suggestor.showSearchResult(data);
            }
        });
    };

    $.EndecaSearchSuggestor.prototype.printArrayProperty = function (array, property) {
        var parameter = '';
        for (var i = 0; i < array.length; i++) {
            var path = encodeURIComponent(array[i]);
            parameter += '&' + property + '=' + path;
        }
        return parameter;
    };

    /** Search suggestion is search term sensitive. So it will take the search
     * term applied on current page and add it into the Ajax request url. */
    $.EndecaSearchSuggestor.prototype.composeUrl = function () {
        var url = this._options.autoSuggestServiceUrl;

        var searchTerm = $.trim(this._element.val());

        if (url.indexOf('?') == -1) {
            url += '?Dy=1';
        } else {
            url += '&Dy=1';
        }

        url += this.printArrayProperty(this._options.contentPaths, "contentPaths");
        if (this._options.templateTypes.length > 0) {
            url += this.printArrayProperty(this._options.templateTypes, "templateTypes");
        }
        if (this._options.templateIds.length > 0) {
            url += this.printArrayProperty(this._options.templateIds,
                "templateIds");
        }
        url += '&Ntt=' + searchTerm + '*';

        return url;
    };

    /** Show the search results in the suggestion box */
    $.EndecaSearchSuggestor.prototype.showSearchResult = function (data) {
        var htmlResult = data;
        if (htmlResult != null) {
            this._container.html(htmlResult);
            this.bindEventHandler();
            this.show();
        } else {
            // Hide the result box if there is no result
            this.hide();
        }
    };

    /** Bind event handlers for the links and divs in the box */
    $.EndecaSearchSuggestor.prototype.bindEventHandler = function () {
        var suggestor = this;

        // change CSS class when mouseover on result item
        $(".dimResult", this._container).mouseover(function (e) {
            $(".dimResult", suggestor._container).removeClass("selected");
            $(this).addClass("selected");
            suggestor._selectedIndex = $(".dimResult", suggestor._container).index($(this));
        });

        //select the result item when user lick on it
        $(".dimResult", this._container).on('click', function (e) {
            suggestor.selectItem();
        });

        //select the result item when user lick on it
        $("a", $(".dimResult", this._container)).on('click', function (e) {
            e.preventDefault();
            suggestor.selectItem();
        });

        //Dim roots are not link, when click, move the focus back to input box
        $(".dimRoots", this._container).on('click', function () {
            clearTimeout(suggestor._hideTimeOutId);
            suggestor._element.focus();
        });
    };

    /** Set the search suggestion box position */
    $.EndecaSearchSuggestor.prototype.setPosition = function () {
        var offset = this._element.offset();
        this._container.css({
            top: offset.top + this._element.outerHeight(),
            left: offset.left,
            width: this._element.width()
        });
    };

    /** Main function to enable the search suggestion to the selected element. */
    $.fn.endecaSearchSuggest = function (options) {
        var opts = $.extend({}, $.fn.endecaSearchSuggest.defaults, options);
        this.each(function () {
            var element = $(this);
            new $.EndecaSearchSuggestor(element, opts);
        });
    };

    /** Default settings for the search suggestion. */
    $.fn.endecaSearchSuggest.defaults = {
        minAutoSuggestInputLength: 3,
        displayImage: false,
        delay: 250,
        autoSuggestServiceUrl: '',
        contentPaths: [],
        templateTypes: [],
        templateIds: [],
        searchUrl: '/browse',
        containerClass: 'dimSearchSuggContainer',
        containerParent: "#searchFormContainer",
        defaultImage: 'no_image.gif'
    };
})(jQuery)
