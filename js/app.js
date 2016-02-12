var imdb = {
	url: "https://api.themoviedb.org/3",
	mode: "/discover/movie?sort_by=popularity.desc",
	key: "&api_key=e854c0d4c0559d18527b088a8e354568",
	api: "e854c0d4c0559d18527b088a8e354568",
	imgurl: "https://image.tmdb.org/t/p/"
};
$(document).ready(function(){
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
							+"<div class='el-top-left'><img src='img/heartred.png' alt='favs'> "+v.vote_count+"</div>"
							+"<div class='el-top-right'><img src='img/download.png' alt='download'></div>"
						+"</div>"
						+"<div class='el-bottom' onclick='viewDetails("+v.id+");'>"+v.original_title+"</div>"
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
			$("#centerimg img").prop("src",imdb.imgurl+bdropsize+v.backdrop_path);
			$("#titlemov").html(v.original_title);
			$("#release .info-data").html(v.release_date);
			$("#runtime .info-data").html(v.runtime+" mins.");
			$("#info-right span").html(v.vote_count);
			$("#score .stars").html(v.vote_average/2);
			$(".stars").stars();
		},
		error: function(e) {
			console.log(e.message);
		}
	});
}