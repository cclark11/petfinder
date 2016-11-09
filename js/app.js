
var PETFINDER_BASE_URL = 'https://api.petfinder.com/breed.list?callback=?';
var PETS_BASE_URL = 'https://api.petfinder.com/pet.find?callback=?';

var baseQuery =  {
		format:'json',
		key: '989a42cb3d6c5c1216cbc235e1859241'
	};

function getBreeds(searchTerm, callback) {
	var query = baseQuery;
	query.animal = searchTerm;

	$.getJSON(PETFINDER_BASE_URL, query, callback);
}

function displayBreeds(data) {
	if (data.petfinder.breeds) {
		$("#breeds").show();
		$("#breeds").append('<option value="">Please select a Breed</option>');
		data.petfinder.breeds.breed.forEach(function(breed){
			$("#breeds").append('<option value="'+breed.$t+'">'+breed.$t+'</option>');
		});
	}
	else{
		$("#breeds").hide();
	}
}

function animalsChange() {
	$("#animals").on('change',function(e){
		e.preventDefault();
		$("#breeds").empty();
		var query = $("#animals").val();
		getBreeds(query, displayBreeds);
	});
}

function getPets (params, callback) {
	var query = baseQuery;
	var keys = Object.keys(params);

	for(var i =0; i < keys.length; i++) {
		query[keys[i]] = params[keys[i]];
	}

	$.getJSON(PETS_BASE_URL,query,callback)
}
function zipSubmitCallback(e) {
	e.preventDefault();
		$("#petTable").empty();
		var params = {
			count:100,
			location: $("#zipcode").val()
		}

		if($("#breeds").val()) {
			params.breed = $("#breeds").val();
		}
		if($("#animals").val()) {
			params.animal = $("#animals").val();
		}
		
		getPets(params, displayPets);
}
function zipSubmit() {
	$("#location").on('submit',zipSubmitCallback);
}


function displayPets(data) {
	console.log(data);
	if (data.petfinder.pets && data.petfinder.pets.pet) {

		$("#petList").show();
		data.petfinder.pets.pet.forEach(function(pet){
			if (pet.media.photos) {

				var petBreeds="";
				if (pet.breeds.breed.length>1) {
					for(var i=0; i<pet.breeds.breed.length; i++) {
						petBreeds += '<li>'+pet.breeds.breed[i].$t+'</li>';
					}
				}
				else {
					petBreeds= '<li>'+pet.breeds.breed.$t+'</li>';
				}
				var petPhoto="";
				if (pet.media.photos) {
					petPhoto='<div class="pic" style="background-image: url(\''+pet.media.photos.photo[2].$t + '\')"></div>';
				}
					$("#petList").append('<div class="col-sm-6 col-md-4">'
						+'<a href="petdetail.html?petId='+pet.id.$t+'"><div class="thumbnail">'
							+petPhoto
							+'<div class="caption">'
								+'<h2 class="petName">'+pet.name.$t.substr(0,16)+'</h2>'
								+'<div><b>Sex: </b>'+pet.sex.$t+'</div>'
								+'<div><b>Age: </b>'+pet.age.$t+'</div>'
								+'<div><b>Breed(s): </b></div>'
								+'<ul>'+ petBreeds + '</ul>'
							+'</div></a>'
						+'</div>');
			}
		});

	}
	else{
		$("#petList").hide();
	}
}

$(function() {
	animalsChange();
	zipSubmit();
	
});	
