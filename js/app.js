var imdb = {
	url: "https://api.themoviedb.org/3",
	mode: "/movie/now_playing",
	key: "?api_key=e854c0d4c0559d18527b088a8e354568",
	api: "e854c0d4c0559d18527b088a8e354568",
	imgurl: "https://image.tmdb.org/t/p/"
};

$(document).ready(function(){
	$(".stars").stars();
	queryTMDB();
	loadFavs();
});

function queryTMDB(){
	$(".newreleases-list").html("Searching ... ");
	$.ajax({
		type: 'GET',
		url: imdb.url + imdb.mode + imdb.key,
		dataType: 'jsonp',
		success: function(resp) {
			$(".newreleases-list").html("");
			var json = resp.results;
			$.each(json,function(i2,v){
				if(i2==0) viewDetails(v.id);
				var isfav = isFav(v.id);
				$(".newreleases-list").append(
					"<div class='movielement' style='background-image:url("+(imdb.imgurl+"w185"+v.poster_path)+");'>"
						+"<div class='el-top'>"
							+"<div class='el-top-left'><img src='img/"+(isfav?"heartwhite":"heartred")+".png' alt='favs' onclick='addToFavs("+v.id+",this);'> "+(numberWithCommas(v.vote_count))+"</div>"
							+"<div class='el-top-right'><img src='img/download.png' alt='download' onclick='openModal("+v.id+",\""+((v.title).replace(/'/g, ""))+"\");'></div>"
						+"</div>"
						+"<div class='el-bottom' onclick='openModal("+v.id+",\""+((v.title).replace(/'/g, ""))+"\");'>"+v.title+"</div>"
					+"</div>"
				);
			});
		},
		error: function(e) {
			console.log(e.message);
		}
	});
}

function viewDetails(id){
	var msize = $(document).width();
	var bdropsize = "w300";
	if(msize<=300) bdropsize = "w300";
	else if(msize<=780) bdropsize = "w780";
	else if(msize<=1280) bdropsize = "w1280";
	else bdropsize = "original";
	$("#centerimg img").prop("src","img/test1.png");
	$.ajax({
		type: 'GET',
		url: imdb.url+"/movie/"+id+"?api_key="+imdb.api,
		dataType: 'jsonp',
		success: function(resp) {
			var v = resp;
			var f = v.release_date;
			var af2 = f.split("-");
			var m = getMonthNameShort(af2[1]*1 - 1);
			$("#centerimg img").prop("src",imdb.imgurl+bdropsize+v.backdrop_path);
			$("#titlemov").html(v.title);
			$("#release .info-data").html(m+" "+af2[2]+", "+af2[0]);
			$("#runtime .info-data").html(v.runtime+" mins.");
			$("#info-right span").html(numberWithCommas(v.vote_count));
			$("#score .stars").html(v.vote_average/2);
			$("#score .stars").prop("title",(parseFloat(v.vote_average/2).toFixed(2)));
			$(".stars").stars();
		},
		error: function(e) {
			console.log(e.message);
		}
	});
}

function openModal(id,ttl){
	$("#modal").fadeIn('slow');
	$("#modal-video").html("");
	$("#modal-head span").html(ttl);
	$.ajax({
		type: 'GET',
		url: imdb.url+"/movie/"+id+"/videos?api_key="+imdb.api,
		dataType: 'jsonp',
		success: function(resp) {
			var v = resp.results[0];
			if(v!=null) $("#modal-video").html("<iframe width='80%' height='315' src='http://www.youtube.com/embed/"+v.key+"?autoplay=0&showinfo=1&controls=1' frameborder='0' allowfullscreen></iframe>");
			else $("#modal-video").html("Trailer was not found");
		},
		error: function(e) {
			console.log(e.message);
			$("#modal-video").html("Trailer was not found: "+e.message);
		}
	});
	 listSimilar();
}

function listSimilar(){
	$("#modal-similar-list").html("");
	$.ajax({
		type: 'GET',
		url: imdb.url+"/movie/now_playing?api_key="+imdb.api,
		dataType: 'jsonp',
		success: function(resp) {
			var json = resp.results;
			$.each(json,function(i2,v){
				if(i2==0) viewDetails(v.id);
				$("#modal-similar-list").append(
					"<div class='movielement' style='background-image:url("+(imdb.imgurl+"w185"+v.poster_path)+");'>"
						+"<div class='el-top'>"
							+"<div class='el-top-left'><img src='img/heartred.png' alt='favs' onclick='addToFavs("+v.id+",this);'> "+(numberWithCommas(v.vote_count))+"</div>"
							+"<div class='el-top-right'><img src='img/download.png' alt='download' onclick='openModal("+v.id+",\""+((v.title).replace(/'/g, ""))+"\");'></div>"
						+"</div>"
						+"<div class='el-bottom' onclick='openModal("+v.id+",\""+((v.title).replace(/'/g, ""))+"\");'>"+v.title+"</div>"
					+"</div>"
				);
			});
		},
		error: function(e) {
			console.log(e.message);
			$("#modal-similar-list").html("No movies found: "+e.message);
		}
	});
}

function addToFavs(id,elem){
	var lfavs = window.localStorage.getItem("favs");
	var imgsrc = $(elem).prop("src");
	var imgrc = ["img/heartred.png","img/heartwhite.png"];
	if(imgsrc.indexOf("img/heartred.png")>0){
		if(!lfavs) lfavs = id;
		else lfavs += "|"+id;
		$(elem).prop("src",imgrc[1]);
	}
	else{
		var afavs = lfavs.split("|");
		lfavs = "";
		$.each(afavs,function(i2,v){
			if(id!=v){
				if(i2>0) lfavs += "|";
				lfavs += v;
			}
		});
		$(elem).prop("src",imgrc[0]);
		if(lfavs=="") window.localStorage.removeItem("favs");
	}
	window.localStorage.setItem("favs",lfavs);
	loadFavs();
}

function loadFavs(){
	var lfavs = window.localStorage.getItem("favs");
	$("#favorites-list").html("");
	if(!lfavs){
		$("#favorites-list").html("No favorites yet");
	}
	else{
		var afavs = lfavs.split("|");
		$.each(afavs,function(i2,v){
			$.ajax({
				type: 'GET',
				url: imdb.url+"/movie/"+v+"?api_key="+imdb.api,
				dataType: 'jsonp',
				success: function(resp) {
					var v1 = resp;
					$("#favorites-list").append(
						"<div class='movielement' style='background-image:url("+(imdb.imgurl+"w185"+v1.poster_path)+");'>"
							+"<div class='el-top'>"
								+"<div class='el-top-left'><img src='img/heartwhite.png' alt='favs'> "+(numberWithCommas(v1.vote_count))+"</div>"
								+"<div class='el-top-right'><img src='img/download.png' alt='download' onclick='openModal("+v1.id+",\""+((v1.title).replace(/'/g, ""))+"\");'></div>"
							+"</div>"
							+"<div class='el-bottom' onclick='openModal("+v.id+",\""+((v.title).replace(/'/g, ""))+"\");'>"+v1.title+"</div>"
						+"</div>"
					);
				},
				error: function(e) {
					console.log(e.message);
				}
			});
		});
	}
}

function isFav(id){
	var lfavs = window.localStorage.getItem("favs");
	var isf = false;
	if(!lfavs) ;
	else{
		var afavs = lfavs.split("|");
		for(i=0;i<afavs.length;i++){
			if(id==afavs[i]){
				console.log("encont en "+i);
				isf = true;
			}
		}
	}
	return isf;
}