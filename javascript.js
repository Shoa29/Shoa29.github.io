var map, infoWindow;

function initMap () {
	var map, infoWindow;
  var options = {
    center: { lat: 43.654, lng: -79.383 },
    zoom: 10
  };

  map = new google.maps.Map(document.getElementById('map-canvas'), options);
  infoWindow = new google.maps.InfoWindow;

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (p) {
      var position = {
        lat: p.coords.latitude,
        lng: p.coords.longitude
      };

      infoWindow.setPosition(position);
      infoWindow.setContent('Your location!');
      infoWindow.open(map);
      map.setCenter(position);
    }, function () {
      handleLocationError('Geolocation service failed', map.getCenter());
    });
  } else {
    handleLocationError('No geolocation available.', map.getCenter());
  }
  return position;
}

function handleLocationError (content, position) {
  infoWindow.setPosition(position);
  infoWindow.setContent(content);
  infoWindow.open(map);
}


function initialize() {
	 //var pos = initMap();
	var mapOptions, map, marker, searchBox, city,
		infoWindow = '',
		addressEl = document.querySelector( '#map-search' ),
		latEl = document.querySelector( '.latitude' ),
		longEl = document.querySelector( '.longitude' ),
		element = document.getElementById( 'map-canvas' );
	city = document.querySelector( '.reg-input-city' );

	mapOptions = {
		// How far the maps zooms in.
		zoom: 8,
		// Current Lat and Long position of the pin/
		center: new google.maps.LatLng(-34,150),
		// center : {
		// 	lat: -34.397,
		// 	lng: 150.644
		// },
		disableDefaultUI: false, // Disables the controls like zoom control on the map if set to true
		scrollWheel: true, // If set to false disables the scrolling on the map.
		draggable: true, // If set to false , you cannot move the map around.
		// mapTypeId: google.maps.MapTypeId.HYBRID, // If set to HYBRID its between sat and ROADMAP, Can be set to SATELLITE as well.
		// maxZoom: 11, // Wont allow you to zoom more than this
		// minZoom: 9  // Wont allow you to go more up.

	};
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function (p) {
		  var position = {
			lat: p.coords.latitude,
			lng: p.coords.longitude
		  };
	
		  //infoWindow.setPosition(position);
		  //infoWindow.setContent('Your location!');
		  //infoWindow.open(map);
		  //map.setCenter(position);
		  mapOptions.center = new google.maps.LatLng(position);
		  map = new google.maps.Map( element, mapOptions ); 
		  marker = new google.maps.Marker({
			position: mapOptions.center,
			map: map,
			// icon: 'http://pngimages.net/sites/default/files/google-maps-png-image-70164.png',
			draggable: true
		});
		searchBox = new google.maps.places.SearchBox( addressEl );
		var lat, long, address, resultArray, citi;

		console.log( 'i am dragged' );
		lat = marker.getPosition().lat();
		long = marker.getPosition().lng();

		var geocoder = new google.maps.Geocoder();
		geocoder.geocode( { latLng: marker.getPosition() }, function ( result, status ) {
			if ( 'OK' === status ) {  // This line can also be written like if ( status == google.maps.GeocoderStatus.OK ) {
				address = result[0].formatted_address;
				resultArray =  result[0].address_components;

				// Get the city and set the city input value to the one selected
				for( var i = 0; i < resultArray.length; i++ ) {
					if ( resultArray[ i ].types[0] && 'administrative_area_level_2' === resultArray[ i ].types[0] ) {
						citi = resultArray[ i ].long_name;
						console.log( citi );
						city.value = citi;
					}
				}
				addressEl.value = address;
				latEl.value = lat;
				longEl.value = long;

			} else {
				console.log( 'Geocode was not successful for the following reason: ' + status );
			}

			// Closes the previous info window if it already exists
			if ( infoWindow ) {
				infoWindow.close();
			}

			/**
			 * Creates the info Window at the top of the marker
			 */
			infoWindow = new google.maps.InfoWindow({
				content: address
			});

			infoWindow.open( map, marker );
		} );
	
	/**
	 * When the place is changed on search box, it takes the marker to the searched location.
	 */
	/*const geocoder = new google.maps.Geocoder();
	geocoder.geocode({ location: latlng }, (results, status) => {
		if (status === "OK") {
		  if (results[0]) {

		}
	}
	});*/
	google.maps.event.addListener( searchBox, 'places_changed', function () {
		var places = searchBox.getPlaces(),
			bounds = new google.maps.LatLngBounds(),
			i, place, lat, long, resultArray,
			addresss = places[0].formatted_address;

		for( i = 0; place = places[i]; i++ ) {
			bounds.extend( place.geometry.location );
			marker.setPosition( place.geometry.location );  // Set marker position new.
		}

		map.fitBounds( bounds );  // Fit to the bound
		map.setZoom( 15 ); // This function sets the zoom to 15, meaning zooms to level 15.
		// console.log( map.getZoom() );

		lat = marker.getPosition().lat();
		long = marker.getPosition().lng();
		latEl.value = lat;
		longEl.value = long;

		resultArray =  places[0].address_components;

		// Get the city and set the city input value to the one selected
		for( var i = 0; i < resultArray.length; i++ ) {
			if ( resultArray[ i ].types[0] && 'administrative_area_level_2' === resultArray[ i ].types[0] ) {
				citi = resultArray[ i ].long_name;
				city.value = citi;
			}
		}

		// Closes the previous info window if it already exists
		if ( infoWindow ) {
			infoWindow.close();
		}
		/**
		 * Creates the info Window at the top of the marker
		 */
		infoWindow = new google.maps.InfoWindow({
			content: addresss
		});

		infoWindow.open( map, marker );
	} );


	/**
	 * Finds the new position of the marker when the marker is dragged.
	 */
	google.maps.event.addListener( marker, "dragend", function ( event ) {
		var lat, long, address, resultArray, citi;

		console.log( 'i am dragged' );
		lat = marker.getPosition().lat();
		long = marker.getPosition().lng();

		var geocoder = new google.maps.Geocoder();
		geocoder.geocode( { latLng: marker.getPosition() }, function ( result, status ) {
			if ( 'OK' === status ) {  // This line can also be written like if ( status == google.maps.GeocoderStatus.OK ) {
				address = result[0].formatted_address;
				resultArray =  result[0].address_components;

				// Get the city and set the city input value to the one selected
				for( var i = 0; i < resultArray.length; i++ ) {
					if ( resultArray[ i ].types[0] && 'administrative_area_level_2' === resultArray[ i ].types[0] ) {
						citi = resultArray[ i ].long_name;
						console.log( citi );
						city.value = citi;
					}
				}
				addressEl.value = address;
				latEl.value = lat;
				longEl.value = long;

			} else {
				console.log( 'Geocode was not successful for the following reason: ' + status );
			}

			// Closes the previous info window if it already exists
			if ( infoWindow ) {
				infoWindow.close();
			}

			/**
			 * Creates the info Window at the top of the marker
			 */
			infoWindow = new google.maps.InfoWindow({
				content: address
			});

			infoWindow.open( map, marker );
		} );
	});

		});}
	/**
	 * Creates the map using google function google.maps.Map() by passing the id of canvas and
	 * mapOptions object that we just created above as its parameters.*/



}
function onsub(){
	var name = document.getElementById("name").value();
	var add = document.getElementById("controls").value();
	var lat = document.getElementById("lat").value();
	var long = document.getElementById("long").value();
	var city = document.getElementById("city").value();
	console.log(name  + " " + add + " " + lat + " " + long + " " + city);
	
Ecwid.OnAPILoaded.add(function() {
	console.log("Ecwid storefront JS API has loaded");
	Ecwid.Cart.setAddress({
		"name": name,
		"street": add,
		"city": city,

		},
		function(){
		  console.log('Address successfully set')
		},
		function(){
		  console.log('Error setting the address');
		}
	  );	
});
}
