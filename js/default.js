﻿
(function () {
    "use strict";

    var _pullBoxHeight = 80;
    var _outerScroller;
    var _innerScroller;
    var _pullLabel;
    var _pullArrow;

    var MS_MANIPULATION_STATE_ACTIVE = 1; // A contact is touching the surface and interacting with content
    var MS_MANIPULATION_STATE_INERTIA = 2; // The content is still moving, but contact with the surface has ended 

    function init() {
        // Setup variables
        _outerScroller = document.querySelector(".outerScroller");
        _innerScroller = document.querySelector(".innerScroller");
        _pullLabel = document.querySelector(".pullLabel");
        _pullArrow = document.querySelector(".pullArrow");

        // Set the initial scroll past the pull box
        _outerScroller.scrollTop = _pullBoxHeight;

        // Update the arrow rotation based on scroll postion
        _outerScroller.addEventListener("scroll", onScroll);

        // Listen for panning events (different than scroll) and detect when we're in the over pan state
        _outerScroller.addEventListener("MSManipulationStateChanged", onManipulationStateChanged);

        // Populate the list
        loadItems();

    }
	
	// Initialize when the DOM is ready
	$(init);

    function onScroll(e) {
        var rotationAngle = 180 * ((_pullBoxHeight - _outerScroller.scrollTop) / _pullBoxHeight) + 90;
        _pullArrow.style.transform = "rotate(" + rotationAngle + "deg)";

        // Change the label once you pull to the top
        if (_outerScroller.scrollTop === 0) {
            _pullLabel.innerText = "Release to refresh";
        } else {
            _pullLabel.innerText = "Pull to refresh";
        }
    };

    function onManipulationStateChanged(e) {
        // Check to see if they lifted while pulled to the top
        if (e.currentState == MS_MANIPULATION_STATE_INERTIA &&
            e.lastState == MS_MANIPULATION_STATE_ACTIVE &&
            _outerScroller.scrollTop === 0) {

            // Change the loading state and prevent panning
            $(_outerScroller).addClass("loading");
            _outerScroller.disabled = true;
            _pullLabel.innerText = "Loading...";

            refreshItemsAsync().then(function () {
                // After the refresh, return to the default state
                $(_outerScroller).removeClass("loading");
                _outerScroller.disabled = false;

                // Scroll back to the top of the list
                scrollTo(_outerScroller, _pullBoxHeight)
         
            });
        }
    };

    function scrollTo(element, position) {
        // msZoomTo is Windows 8.1/IE11 only
        if (element.msZoomTo) {
            element.msZoomTo({
                contentX: 0,
                contentY: position,
                viewporX: 0,
                viewportY: 0
            });
        } else {
            element.scrollTop = position;
        }

    }

    function refreshItemsAsync() {
        return new $.Deferred(function(deferred) {
            // Initiate the refresh (simulated delay with setTimeout)
            setTimeout(function () {
                loadItems();
                deferred.resolve();
            }, 2000);
        }).promise();
    }

    function loadItems() {
        // Add random items to the list
        var items = document.createElement("div");

        for (var i = 0; i < 100; i++) {
            var randomNumber = (100 * Math.random()).toFixed();

            var element = document.createElement("div");
            element.className = "listItem";
            element.textContent = "Random item " + randomNumber;
            items.appendChild(element);
        }
        _innerScroller.innerHTML = items.innerHTML;
    }

 })();
