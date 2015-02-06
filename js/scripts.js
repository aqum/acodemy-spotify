angular.module("acodemy-app",["ngAnimate","ngRoute","ngSanitize","ngTouch","acodemy-app.navbar","acodemy-app.routes.notFound","acodemy-app.routes.search","acodemy-app.routes.album","acodemy-app.routes.artist"]).config(["$locationProvider",function(t){t.html5Mode(!1)}]),angular.module("acodemy-app.apis.spotify",["ngSanitize"]).config(["$sceDelegateProvider",function(t){var a=t.resourceUrlWhitelist();a.push("https://p.scdn.co/mp3-preview/**"),t.resourceUrlWhitelist(a)}]).service("SpotifyApi",["$http",function(t){function a(){for(var t={},a={},n={},e=0;e<arguments.length;e++){var r=arguments[e];r&&(angular.extend(t,r),angular.extend(a,r.params),angular.extend(n,r.headers))}return t.params=a,t.headers=n,t}function n(t,n,r){var s=angular.isArray(n);return s||(n=[n]),r=a(r,{params:{ids:n.join(",")}}),e.get("/"+t,r).then(function(a){return s?a.data[t]:a.data[t][0]})}var e=this,r="https://api.spotify.com/v1";e.getUrl=function(t){return r+t},e.get=function(a,n){return t.get(this.getUrl(a),n)},e.search=function(t,n,e){return n||(n=["album","artist"]),angular.isString(n)&&(n=[n]),e=a(e,{params:{q:t,type:n.join(",")}}),this.get("/search",e).then(function(t){return t.data})},e.getArtists=function(t,a){return n("artists",t,a)},e.getAlbums=function(t,a){return n("albums",t,a)},e.getTracks=function(t,a){return n("tracks",t,a)},e.getAlbumTracks=function(t,a){return e.get("/albums/"+t+"/tracks",a).then(function(t){return t.data})},e.getArtistsAlbums=function(t,a){return e.get("/artists/"+t+"/albums",a).then(function(t){return t.data})},e.getArtistsTopTracks=function(t,n,r){return n=n||"US",r=a(r,{params:{country:n}}),e.get("/artists/"+t+"/top-tracks",r).then(function(t){return t.data.tracks})},e.getRelatedArtists=function(t,a){return e.get("/artists/"+t+"/related-artists",a).then(function(t){return t.data.artists})}}]),angular.module("acodemy-app.navbar",["acodemy-app.routes.search"]).controller("NavbarController",["$scope","$location",function(t,a){var n=this;n.searchQuery=a.search().q||null,t.$watch(function(){return n.searchQuery},function(){n.searchQuery!==a.search().q&&(a.replace(),a.search("q",n.searchQuery||null))}),t.$on("$routeChangeSuccess",function(){n.initialized=!0}),n.isSearch=function(){return"/search"===a.path()},n.clearSearch=function(){n.searchQuery=""},n.openSearchPage=function(){"/search"!==a.path()&&a.path("/search")}}]),angular.module("acodemy-app.utils.debounce",[]).factory("$debounce",["$timeout",function(t){return function(a,n,e){var r;return function(){var s=this,i=arguments,o=function(){r=null,e||a.apply(s,i)},l=e&&!r;t.cancel(r),r=t(o,n),l&&a.apply(s,i)}}}]),angular.module("acodemy-app.utils.duration-filter",[]).filter("duration",function(){var t=1e3,a=6e4,n=36e5;return function(e){var r=[],s=Math.floor(e/n);e%=n,s&&r.push(s+":");var i=Math.floor(e/a);e%=a,r.push(s&&10>i?"0"+i:i);var o=Math.floor(e/t);return e%=t,r.push(10>o?"0"+o:o),r.join(":")}}),angular.module("acodemy-app.directives.play-button",[]).directive("playButton",function(){function t(t){a.forEach(function(a){a!==t&&a.stop()})}var a=[];return{restrict:"E",templateUrl:"directives/play-button/play-button.html",scope:{src:"@audioSrc"},controllerAs:"player",bindToController:!0,controller:["$scope","$element",function(n,e){var r=this,s=e[0],i=s.querySelector("audio"),o=r.src,l={};a.push(r),i.addEventListener("playing",function(){r.state=l.playing,n.$apply()}),i.addEventListener("ended",function(){r.state=l.stopped,n.$apply()}),r.play=function(){t(r),r.src&&(o!==r.src&&(r.state=l.loading,i.load()),i.play())},r.stop=function(){i.pause(),i.currentTime=0,r.state=l.stopped},r.pause=function(){i.pause(),r.state=l.paused},l={stopped:{icon:"fa fa-play",next:r.play},paused:{icon:"fa fa-play",next:r.play},playing:{icon:"fa fa-pause",next:r.pause},loading:{icon:"fa fa-spin fa-circle-o-notch",next:function(){}}},n.$watch("player.src",function(){r.stop()}),r.state=l.stopped}]}}),angular.module("acodemy-app.routes.album",["ngRoute","acodemy-app.apis.spotify","acodemy-app.utils.duration-filter","acodemy-app.directives.play-button"]).config(["$routeProvider",function(t){t.when("/album/:albumId/:trackId?",{controller:"AlbumPageController",controllerAs:"page",templateUrl:"routes/album/album.html"})}]).controller("AlbumPageController",["$scope","$q","$routeParams","SpotifyApi",function(t,a,n,e){var r=this;e.getAlbums(n.albumId).then(function(t){r.album=t,r.artists=t.artists;var a=t.artists.map(function(t){return t.id});return e.getArtists(a).then(function(t){r.artists=t})})}]),angular.module("acodemy-app.routes.artist",["ngRoute","acodemy-app.apis.spotify","acodemy-app.utils.duration-filter","acodemy-app.directives.play-button"]).config(["$routeProvider",function(t){t.when("/artist/:id",{controller:"ArtistPageController",controllerAs:"page",templateUrl:"routes/artist/artist.html"})}]).controller("ArtistPageController",["$scope","$q","$routeParams","SpotifyApi",function(t,a,n,e){var r=this;a.all([e.getArtists(n.id),e.getArtistsTopTracks(n.id),e.getArtistsAlbums(n.id,{params:{limit:10}}),e.getRelatedArtists(n.id)]).then(function(t){r.artist=t[0],r.topTracks=t[1],r.albums=t[2],r.relatedArtists=t[3]})}]),angular.module("acodemy-app.routes.notFound",["ngRoute"]).config(["$routeProvider",function(t){t.otherwise({templateUrl:"routes/not-found/not-found.html"})}]),angular.module("acodemy-app.routes.search",["ngRoute","acodemy-app.apis.spotify","acodemy-app.utils.debounce","acodemy-app.utils.duration-filter","acodemy-app.directives.play-button"]).config(["$routeProvider",function(t){t.when("/",{redirectTo:"/search"}),t.when("/search",{controller:"SearchPageController",controllerAs:"page",templateUrl:"routes/search/search.html",reloadOnSearch:!1})}]).controller("SearchPageController",["$scope","$location","$q","$debounce","SpotifyApi",function(t,a,n,e,r){var s=this;s.searchQuery=a.search().q,s.albums={},s.artists={},s.tracks={},t.$watch(function(){return a.search().q},e(function(t){return s.searchQuery=t,t?void r.search(t,["album","artist","track"],{params:{limit:10}}).then(function(t){s.albums=t.albums,s.artists=t.artists,s.tracks=t.tracks}):(s.albums={},s.artists={},void(s.tracks={}))},250))}]),angular.module("acodemy-app").run(["$templateCache",function(t){t.put("directives/play-button/play-button.html",'<button ng-click="player.state.next()">\n  <div class="icon-background">\n    <i class="{{ player.state.icon }}" ></i>\n  </div>\n  <audio ng-src="{{ player.src }}" preload="none"></audio>\n</button>\n'),t.put("routes/album/album.html",'<header class="page-header">\n  <aside>\n    <div class="thumb-l"\n         ng-style="{\'background-image\': \'url(\' + page.album.images[0].url + \')\'}">\n    </div>\n\n    <ul class="thumbs-list">\n      <li ng-repeat="artist in page.artists">\n        <a href="#/artist/{{ artist.id }}">\n          <div class="thumb-s"\n               ng-style="{\'background-image\': \'url(\' + page.album.images[2].url + \')\'}">\n          </div>\n          <p>{{ artist.name }}</p>\n        </a>\n      </li>\n    </ul>\n  </aside>\n\n  <section>\n    <header>\n      <h1>{{ page.album.name }}</h1>\n      <h2>{{ page.album.release_date | date:\'yyyy\' }}</h2>\n    </header>\n\n    <section class="table-section">\n      <header><h1>Tracks</h1></header>\n      <table class="tracks-table">\n        <tr ng-repeat="track in page.album.tracks.items">\n          <td><play-button audio-src="{{ track.preview_url }}"></play-button></td>\n          <td><a ng-href="#/album/{{ page.album.id }}/{{ track.id }}">{{ track.name }}</a></td>\n          <td><a ng-href="#/album/{{ page.album.id }}">{{ page.album.name }}</a></td>\n          <td>\n            <a ng-repeat="artist in track.artists"\n               ng-href="#/artist/{{ artist.id }}">\n              {{ artist.name }}<span ng-if="!$last">,</span>\n            </a>\n          </td>\n          <td>{{ track.duration_ms | duration }}</td>\n        </tr>\n      </table>\n    </section>\n  </section>\n</header>\n'),t.put("routes/artist/artist.html",'<header class="page-header">\n  <aside>\n    <div class="thumb-l"\n         ng-style="{\'background-image\': \'url(\' + page.artist.images[0].url + \')\'}">\n    </div>\n  </aside>\n\n  <section>\n    <header>\n      <h1>{{ page.artist.name }}</h1>\n      <h2>{{ page.artist.followers.total | number }} followers</h2>\n    </header>\n\n    <section class="table-section">\n      <header><h1>Top tracks</h1></header>\n      <table class="tracks-table">\n        <tr ng-repeat="track in page.topTracks | limitTo:5">\n          <td><play-button audio-src="{{ track.preview_url }}"></play-button></td>\n          <td><a ng-href="#/album/{{ track.album.id }}/{{ track.id }}">{{ track.name }}</a></td>\n          <td><a ng-href="#/album/{{ track.album.id }}">{{ track.album.name }}</a></td>\n          <td>\n            <a ng-repeat="artist in track.artists"\n               ng-href="#/artist/{{ artist.id }}">\n              {{ artist.name }}<span ng-if="!$last">,</span>\n            </a>\n          </td>\n          <td>{{ track.duration_ms | duration }}</td>\n        </tr>\n      </table>\n    </section>\n  </section>\n</header>\n\n<section class="tiles-section">\n  <header>\n    <h1>Albums</h1>\n    <h2>{{ page.albums.total }} found</h2>\n  </header>\n  <div class="tiles-container">\n    <a ng-repeat="album in page.albums.items"\n       ng-href="#/album/{{ album.id }}"\n       class="tile thumb-m"\n       title="{{ album.name }}"\n       ng-style="{ \'background-image\': \'url(\' + album.images[1].url + \')\' }">\n    </a>\n  </div>\n</section>\n\n<section class="tiles-section">\n  <header>\n    <h1>Related artists</h1>\n  </header>\n  <div class="tiles-container">\n    <a ng-repeat="artist in page.relatedArtists | limitTo:10"\n       ng-href="#/artist/{{ artist.id }}"\n       class="tile thumb-m"\n       title="{{ artist.name }}"\n       ng-style="{ \'background-image\': \'url(\' + artist.images[1].url + \')\' }">\n    </a>\n  </div>\n</section>\n'),t.put("routes/not-found/not-found.html","NOT FOUND\n"),t.put("routes/search/search.html",'<section class="tiles-section" ng-show="page.albums.total">\n  <header>\n    <h1>Albums</h1>\n    <h2>{{ page.albums.total }} found</h2>\n  </header>\n  <div class="tiles-container">\n    <a ng-repeat="album in page.albums.items"\n       ng-href="#/album/{{ album.id }}"\n       class="tile thumb-m"\n       title="{{ album.name }}"\n       ng-style="{ \'background-image\': \'url(\' + album.images[1].url + \')\' }">\n    </a>\n  </div>\n</section>\n\n<section class="tiles-section" ng-show="page.artists.total">\n  <header>\n    <h1>Artists</h1>\n    <h2>{{ page.artists.total }} found</h2>\n  </header>\n  <div class="tiles-container">\n    <a ng-repeat="artist in page.artists.items"\n       ng-href="#/artist/{{ artist.id }}"\n       class="tile thumb-m"\n       title="{{ artist.name }}"\n       ng-style="{ \'background-image\': \'url(\' + artist.images[1].url + \')\' }">\n    </a>\n  </div>\n</section>\n\n<section class="table-section" ng-show="page.tracks.total">\n  <header>\n    <h1>Tracks</h1>\n    <h2>{{ page.tracks.total }} found</h2>\n  </header>\n  <table class="tracks-table">\n    <tr ng-repeat="track in page.tracks.items">\n      <td><play-button audio-src="{{ track.preview_url }}"></play-button></td>\n      <td><a ng-href="#/album/{{ track.album.id }}/{{ track.id }}">{{ track.name }}</a></td>\n      <td><a ng-href="#/album/{{ track.album.id }}">{{ track.album.name }}</a></td>\n      <td>\n        <a ng-repeat="artist in track.artists"\n           ng-href="#/artist/{{ artist.id }}">\n          {{ artist.name }}<span ng-if="!$last">,</span>\n        </a>\n      </td>\n      <td>{{ track.duration_ms | duration }}</td>\n    </tr>\n  </table>\n</section>\n')}]);