var imdb = {
	url: "https://api.themoviedb.org/3",
	mode: "/discover/movie?sort_by=popularity.desc",
	key: "&api_key=e854c0d4c0559d18527b088a8e354568",
	api: "e854c0d4c0559d18527b088a8e354568",
	imgurl: "https://image.tmdb.org/t/p/"
};
$(document).ready(function(){
	$(".stars").stars();
	queryTMDB();
});

function queryTMDB(){
	var input="";
	$(".newreleases-list").html("Searching ... ");
	$.ajax({
		type: 'GET',
		url: imdb.url + imdb.mode + input + imdb.key,
		dataType: 'jsonp',
		success: function(resp) {
			$(".newreleases-list").html("");
			var json = resp.results;
			$.each(json,function(i2,v){
				if(i2==0) viewDetails(v.id);
				$(".newreleases-list").append(
					"<div class='movielement' style='background-image:url("+(imdb.imgurl+"w185"+v.poster_path)+");'>"
						+"<div class='el-top'>"
							+"<div class='el-top-left'><img src='img/heartred.png' alt='favs' onclick='addToFavs("+v.id+",this);'> "+(numberWithCommas(v.vote_count))+"</div>"
							+"<div class='el-top-right'><img src='img/download.png' alt='download' onclick='openModal("+v.id+",\""+v.title+"\");'></div>"
						+"</div>"
						+"<div class='el-bottom' onclick='viewDetails("+v.id+");'>"+v.title+"</div>"
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
	$("#modal").show();
	$("#modal-video").html("");
	$("#modal-head span").html(ttl);
	$.ajax({
		type: 'GET',
		url: imdb.url+"/movie/"+id+"/videos?api_key="+imdb.api,
		dataType: 'jsonp',
		success: function(resp) {
			var v = resp.results[0];
			if(v!=null) $("#modal-video").html("<iframe width='80%' height='315' src='http://www.youtube.com/embed/"+v.key+"?autoplay=0' frameborder='0' allowfullscreen></iframe>");
			else $("#modal-video").html("No se encontr&oacute; el video");
		},
		error: function(e) {
			console.log(e.message);
			$("#modal-video").html("No se encontr&oacute; el video: "+e.message);
		}
	});
}

function addToFavs(id,elem){
	var imgsrc = $(elem).prop("src");
	var imgrc = ["img/heartred.png","img/heartwhite.png"];
	if(imgsrc.indexOf("img/heartred.png")>0) $(elem).prop("src",imgrc[1]);
	else $(elem).prop("src",imgrc[0]);
}