var PET_DETAIL_BASE_URL = 'https://api.petfinder.com/pet.get?callback=?';

var map;

var baseQuery =  {
		format:'json',
		key: '989a42cb3d6c5c1216cbc235e1859241'
	};

function displayMap(){
	map = new google.maps.Map(document.getElementById('map'), {
          zoom: 15
        });
}
function addMarkerToMap(contact){
	var address = contact.address1.$t + " " 
	+ contact.city.$t + ", " 
	+ contact.state.$t + " " 
	+ contact.zip.$t;

	geocoder = new google.maps.Geocoder();
	geocoder.geocode( { 'address': address}, function(results, status) {
		if (status == google.maps.GeocoderStatus.OK) {
			if (status != google.maps.GeocoderStatus.ZERO_RESULTS) {
				map.setCenter(results[0].geometry.location);
				var infowindow = new google.maps.InfoWindow(
					{ content: '<b>'+address+'</b>',
					size: new google.maps.Size(150,50)
				});

				var marker = new google.maps.Marker({
					position: results[0].geometry.location,
					map: map, 
					title:address
				}); 
				google.maps.event.addListener(marker, 'click', function() {
					infowindow.open(map,marker);
				});

			} 
			else {
				console.log("No results found");
			}
		} 
		else {
			console.log("Geocode was not successful for the following reason: " + status);
		}
	});
}

function getPetDetails(petId){
	var query = baseQuery;
	query.id = petId;

	$.getJSON(PET_DETAIL_BASE_URL,query,displayPetDetails);
}



function displayPetDetails(data) {
	var petPhotos="";
	var firstPic = true;
	var j=0;
	var photoIndicators="";
	for (var i=0; i<data.petfinder.pet.media.photos.photo.length; i++) {
		if($(data.petfinder.pet.media.photos.photo[i]).attr("@size")=="x") {
			var active = '';
			if (firstPic) {
				active = " active";
				firstPic = false;
			}
			petPhotos+='<div class="item'+active+'">'+
			'<img src="'+data.petfinder.pet.media.photos.photo[i].$t+'"></div>';
			photoIndicators+='<li data-target="#photo-carousel" data-slide-to="'
			+j+'" class="'+active+'"></li>';
			j+=1;
		}
	}
	var petBreeds="Breed(s): ";
		if (data.petfinder.pet.breeds.breed.length>1) {
			for(i=0; i<data.petfinder.pet.breeds.breed.length; i++) {
				if(i<data.petfinder.pet.breeds.breed.length){
					petBreeds += data.petfinder.pet.breeds.breed[i].$t+", ";
				}
				else{
					petBreeds += data.petfinder.pet.breeds.breed[i].$t;
				}
			}
		}
			else {
				petBreeds += data.petfinder.pet.breeds.breed.$t;
			}
	$("#name").append(data.petfinder.pet.name.$t);
	$(".carousel-indicators").append(photoIndicators);
	$(".carousel-inner").append(petPhotos);
	$("#breeds").append(petBreeds);
	$("#sex").append("Sex: "+data.petfinder.pet.sex.$t);
	$("#age").append("Age: "+data.petfinder.pet.age.$t);
	$("#description").append((data.petfinder.pet.description.$t) ? data.petfinder.pet.description.$t : "");
	$('.carousel').carousel();
	addMarkerToMap(data.petfinder.pet.contact);
}

$(function() {
	var equalSign = window.location.search.indexOf("=");
	var petId = window.location.search.substring(equalSign+1);
	getPetDetails(petId);
});	
