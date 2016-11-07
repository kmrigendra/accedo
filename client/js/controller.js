var myApp = angular.module('Accedo', ['ngRoute', 'slickCarousel']);

myApp.config(['$logProvider', '$routeProvider' , function($logProvider, $routeProvider ){
  $routeProvider.when('/', {
    templateUrl:'index.html',
    controller:'HomeCtrl'
  })
  .when('/history', {
    templateUrl:'history.html',
    controller:'HistoryCtrl'
  });
}]);

myApp.filter('trustUrl', ['$sce', function ($sce) {
        return function (recordingUrl) {
            return $sce.trustAsResourceUrl(recordingUrl);
        };
    }]);

myApp.controller('HomeCtrl', ['$scope', '$sce', '$http', '$rootScope', '$timeout', function($scope, $sce, $http, $rootScope, $timeout){
  $scope.slickPanels = {
  method: {},
  dots:false,
  infinite: true,
  speed: 300,
  slidesToShow: 4,
  slidesToScroll: 4,
  autoPlay: false,
  // responsive:'miniGalleryResponsive',
      arrows : false,
  // adaptiveHeight: true,
  event: {
    beforeChange: function() {
      console.log("before change called");
    },
    afterChange: function() {
      console.log("after called");
    }
  }
};


    $scope.miniGalleryResponsive = [
        {
            breakpoint: 1024,
            settings: {
                slidesToShow: 4,
                slidesToScroll: 4
            }
        },
        {
            breakpoint: 980,
            settings: {
                slidesToShow: 3,
                slidesToScroll: 1
            }
        },
        {
            breakpoint: 767,
            settings: {
                slidesToShow: 2,
                slidesToScroll: 1
            }
        },
        {
            breakpoint: 500,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1
            }
        }
    ];
    
  $scope.video = {
    poster : '',
    src : '',
  };
  $scope.currentVideo = "";

  $http.get('https://demo2697834.mockable.io/movies').success(function(response) {
    console.log(response.entries);
    $rootScope.viewLoaded = false;
   $scope.entries = response.entries;
   $timeout(function() {
       $rootScope.viewLoaded = true;
     });
  $scope.playVideo = function(data, e){
    // e.preventDefault();
    $scope.currentVideo = data;
    console.log(data.images[0].url);
      $scope.video = { poster : data.images[0].url, src : data.contents[0].url };
      $('#fade-wrapper').fadeIn();
    };

  $scope.pauseOrPlay = function(ele){
            var video = angular.element(ele.srcElement);
            video[0].pause(); // video.play()
   };
  });

  $('#fade-wrapper').click(function(e){
        var targetElement = angular.element(e.target.children);
        targetElement[0].pause();
        targetElement[0].currentTime = 0;
        targetElement[0].load();
        $(this).fadeOut();
    });

  $('#videoplayer').click(function(e){
    e.stopPropagation();
  });

  $('video').on('ended', function() {
      console.log(this.parentElement);
      this.webkitExitFullscreen();
      setTimeout($(this.parentElement).fadeOut(), 100);
  });
  $('video').on('play', function() {
    console.log('video play', $scope.currentVideo);
    $http.post('/api/history', $scope.currentVideo).success(function(response) {
      console.log(response);
    });
  });

}]);

myApp.controller('HistoryCtrl', ['$scope', '$sce', '$http', function($scope, $sce, $http){
  $scope.history = '';
  $http.get('/api/history').success(function(response) {
    $scope.history = response;
  });
}]);
