angular.module('common.components.widget').directive('scrollUp', [function () {
    return {
        restrict: 'E',
        replace: true,
        link: function (scope, element, attrs) {
            $.scrollUp({
                scrollName: 'scrollUp',      // Element ID
                scrollDistance: 100,         // Distance from top/bottom before showing element (px)
                scrollFrom: 'top',           // 'top' or 'bottom'
                scrollSpeed: 300,            // Speed back to top (ms)
                easingType: 'linear',        // Scroll to top easing (see http://easings.net/)
                animation: 'fade',           // Fade, slide, none
                animationSpeed: 300,         // Animation speed (ms)
                scrollTrigger: false,        // Set a custom triggering element. Can be an HTML string or jQuery object
                scrollTarget: false,         // Set a custom target element for scrolling to. Can be element or number
                scrollText: '',               // Text for element, can contain HTML
                scrollTitle: 'Scroll to top',// Set a custom <a> title if required.
                scrollImg: false,            // Set true to use image
                activeOverlay: false,        // Set CSS color to display scrollUp active point, e.g '#00FFFF'
                zIndex: 2147483647             // Z-Index for the overlay
            });
        }
    }
}]);