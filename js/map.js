/**
 * Created by dell on 2016/10/8.
 */
var main = $('.main'),
    map = $(main).find('#map'),
    nearbyMarkers = [],//?????????????????marker
    locationArr = [];//?????????γ??
$(function () {
    (function init() {
        getLocation();
    }());

    //?????????λ??
    function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                var latitude = Number(position.coords.latitude - 1);
                var longitude = Number(position.coords.longitude);
                initMap(latitude, longitude);
            }, function (error) {
                switch (error.code) {
                    case error.TIMEOUT:
                        alert("A timeout occured! Please try again!");
                        break;
                    case error.POSITION_UNAVAILABLE:
                        alert('We can\'t detect your location. Sorry!');
                        initMap(24.489231, 118.103886);
                        break;
                    case error.PERMISSION_DENIED:
                        alert('Please allow geolocation access for this to work.');
                        initMap(24.489231, 118.103886);
                        break;
                    case error.UNKNOWN_ERROR:
                        alert('An unknown error occured!');
                        initMap(24.489231, 118.103886);
                        break;
                }
            });
        }
    }

    //????????
    function initMap(lat, lng) {
        var LatLng = {lat: lat, lng: lng};
        map = new google.maps.Map(document.getElementById('map'), {
            zoom: 8,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            center: LatLng
        });
    }
});

//?????marker
function MyOverlay(map, options) {
    this.latlng = options.latlng; //????????λ??
    this.lat = options.lat; //???澭γ??
    this.lng = options.lng; //???澭γ??
    this.image = options.image;  //??????????
    this.map_ = map;
    this.distance = options.distance;
    this.time = options.time;
    this.name = options.name;
    this.address = options.address;//?????
    this.title = options.title;//??????
    this.div_ = null;
    this.Num = options.Num;
    this.setMap(map);
}

//??????????????
MyOverlay.prototype = new google.maps.OverlayView();

//????????
MyOverlay.prototype.onAdd = function () {
    //??????????
    var a = new Templete();
    var div = document.createElement('div');//????div???marker img info
    div.setAttribute('class', 'popupBox');
    div.setAttribute('lat', this.lat);
    div.setAttribute('lng', this.lng);
    div.style.border = "none";
    div.style.borderWidth = "0px";
    div.style.position = "absolute";
    div.style.cursor = "pointer";

    div.innerHTML = a.create_maps_marker(this.image, this.name, this.address, this.distance, this.time, this.Num);

    this.div_ = div;

    //???????????????
    var panes = this.getPanes();
    //???ó?floatPane?????DOM?????
    panes.floatPane.appendChild(div);

    var popupMarker = $('.popupMarker');
    var popupMain = $('.popupMain');

    //???????
    $(popupMarker).unbind('click');
    $(popupMarker).bind('click', function (event) {
        showMarkerPopup(event);
    });

    //??????
    $(popupMain).unbind('click');
    $(popupMain).bind('click', function (event) {
        closeMarkerPopup(event);
        nearSearch(event);
    });

    //???marker
    map.addListener('dragstart', function () {
        $('.popupContent').hide();
    });
}

//?????????????????????λ??
MyOverlay.prototype.draw = function () {

    var overlayProjection = this.getProjection();
    var position = overlayProjection.fromLatLngToDivPixel(this.latlng);   //??????????????????????

    var div = this.div_;

    div.style.left = position.x - 32 + 'px';
    div.style.top = position.y - 60 + 'px';
};

//???marker????
function showMarkerPopup(event) {
    var elem = event.target;
    var popupContents = $('.popupContent');
    var popupContent = $(elem).parents('.popupMarker').siblings('.popupContent');
    var popupMain = $(popupContent).find('.popupMain');
    var pointX = event.pageX;
    var pointY = event.pageY;
    var mapOffset = $(main).find('#map').offset().left;
    var Width = $(main).find('#map').innerWidth() + mapOffset;
    var Height = $(main).find('#map').outerHeight();
    var _width = $(popupMain).outerWidth() + pointX;
    var _height = pointY - $(popupMain).outerHeight();
    var mapHeight = Height - ($(popupMain).outerHeight() * 2);

    $(popupMain).css({'top': '-10px', 'left': '20px'});

    if (popupContent.is(':visible')) {
        $(popupContent).hide();
    } else {
        $(popupContents).hide();
        $(popupContent).show();
        //????????? ????map?????????λ??
        if (_width > Width) {
            //consconsole.log(1);
            $(popupMain).css({
                'left': '-267px'
            });
        }
        if (_height < 0) {
            $(popupMain).css({
                'top': '38px',
                'left': '-106px'
            });
        }
        if (_height > mapHeight) {
            $(popupMain).css({
                'top': '-91px',
                'left': '-106px'
            });
        }
    }
}

//??????
function closeMarkerPopup(event) {
    var elem = event.target;

    if ($(elem).hasClass('closePopup')) {
        var popupContent = $(elem).parents('.popupContent');
        $(popupContent).hide();
    }
}

//????????
function nearSearch(event) {
    var elem = event.target;
    var address;
    var types = '';
    var image = '';
    var lat = '';
    var lng = '';
    var typeVal = '';
    var bodyContent = $(elem).parents('.popupContent');
    var len = nearbyMarkers.length;

    if ($(elem).hasClass('searchHOTEL') || $(elem).hasClass('searchRESTAURANT')) {
        //???marker
        for (var i = 0; i < len; i++) {
            nearbyMarkers[i].setMap(null);
        }
    }
    if ($(elem).hasClass('searchHOTEL')) {
        lat = Number($(elem).parents('.popupBox').attr('lat'));
        lng = Number($(elem).parents('.popupBox').attr('lng'));
        address = new google.maps.LatLng({lat: lat, lng: lng});
        types = 'lodging';
        image = 'images/marker2.png';
        typeVal = '一晚住宿';
        $(bodyContent).hide();
        mapsNearSearch(address, types, image,typeVal);
    }
    if ($(elem).hasClass('searchRESTAURANT')) {
        lat = Number($(elem).parents('.popupBox').attr('lat'));
        lng = Number($(elem).parents('.popupBox').attr('lng'));
        address = new google.maps.LatLng({lat: lat, lng: lng});
        types = 'food';
        image = 'images/marker3.png';
        typeVal = '美食品尝';
        $(bodyContent).hide();
        mapsNearSearch(address, types, image,typeVal);
    }
}

function mapsNearSearch(address, types, image,typeVal) {
    var service = new google.maps.places.PlacesService(map);
    var infowindows = new google.maps.InfoWindow();
    service.nearbySearch({
        location: address,
        radius: 300,
        types: [types]
    }, callback);

    function callback(results, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            for (var i = 1; i < results.length - 1; i++) {
                createMarker(results[i]);
            }
        }
    }

    function createMarker(place) {
        var placeLoc = place.geometry.location;
        var marker = new google.maps.Marker({
            map: map,
            position: place.geometry.location,
            icon: image
        });
        nearbyMarkers.push(marker);
        var distance = '';
        var duration = '';
        var directionsService = new google.maps.DirectionsService();
        var a = new Templete();
        var request = {
            origin: address,
            destination: placeLoc,
            travelMode: google.maps.DirectionsTravelMode.WALKING
        };

        directionsService.route(request, function (response, status) {
            if (status == google.maps.DirectionsStatus.OK) {
                distance = response.routes[0].legs[0].distance.value;
                duration = response.routes[0].legs[0].duration.text;
                marker.addListener('click', function () {
                    infowindows.setMap(null);
                    infowindows.setContent(a.create_maps_info(distance, duration, place.name));
                    setTimeout(function(){
                        var mapAddTrip = $('.mapAddTrip');
                        $(mapAddTrip).attr('title',place.name).attr('lat',placeLoc.lat()).attr('lng',placeLoc.lng()).attr('address','厦门思明区').attr('img','images/120.jpg').attr('stopTime',1).attr('typeVal',typeVal);
                        $(mapAddTrip).bind('click',function(){
                            addTripLists($(this),'false');
                        });
                    },200);
                    infowindows.open(map, this);
                });
                map.addListener('dragstart', function () {
                    infowindows.close();
                });
            }
        });
    }

}


