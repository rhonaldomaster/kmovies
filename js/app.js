$(document).ready(function(){
	$(".stars").stars();
	kmovies.QueryTMDB("newreleases-list",kmovies.Imdb.nowplaying);
	kmovies.QueryTMDB("upcoming-list",kmovies.Imdb.upcoming);
	kmovies.LoadFavs();
});
var kmovies = (function() {
	var imdb = {
		url: "https://api.themoviedb.org/3",
		nowplaying: "/movie/now_playing",
		key: "?api_key=e854c0d4c0559d18527b088a8e354568",
		api: "e854c0d4c0559d18527b088a8e354568",
		imgurl: "https://image.tmdb.org/t/p/",
		upcoming: "/movie/upcoming"
	};
	var queryTMDB = function(divclass,query){
		var divqt = $("."+divclass);
		divqt.html("Searching ... ");
		var ajx = $.ajax({
			type: 'GET',
			url: imdb.url + query + imdb.key,
			dataType: 'jsonp'
		});
		ajx.done(function(resp) {
			divqt.html("");
			var json = resp.results;
			$.each(json,function(i2,v){
				if(i2==0 && query==imdb.nowplaying) viewDetails(v.id);
				var isfav = isFav(v.id);
				var contx = {
					id:v.id,imgurl:imdb.imgurl,poster_path:v.poster_path,
					heart:isfav?"heartwhite":"heartred",vote_count:kutils.numberWithCommas(v.vote_count),
					title:(v.title).replace(/'/g, "")
				};
				var source = $("#movie-element-template").html();
				var template = Handlebars.compile(source);
				divqt.append(template(contx));
			});
		})
		.fail(function(e) {
			console.log(e.message);
		});
	};
	var viewDetails = function(id){
		var msize = $(document).width();
		var bdropsize = "w300";
		if(msize<=300) bdropsize = "w300";
		else if(msize<=780) bdropsize = "w780";
		else if(msize<=1280) bdropsize = "w1280";
		else bdropsize = "original";
		$("#centerimg img").prop("src","img/test1.png");
		var ajx = $.ajax({
			type: 'GET',
			url: imdb.url+"/movie/"+id+imdb.key,
			dataType: 'jsonp'
		});
		ajx.done(function(resp) {
			var v = resp;
			var f = v.release_date;
			var af2 = f.split("-");
			var m = kutils.getMonthNameShort(af2[1]*1 - 1);
			$("#centerimg img").prop("src",imdb.imgurl+bdropsize+v.backdrop_path);
			$("#titlemov").html(v.title);
			$("#release .info-data").html(m+" "+af2[2]+", "+af2[0]);
			$("#runtime .info-data").html(v.runtime+" mins.");
			$("#info-right span").html(kutils.numberWithCommas(v.vote_count));
			$("#score .stars").html(v.vote_average/2);
			$("#score .stars").prop("title",(parseFloat(v.vote_average/2).toFixed(2)));
			$(".stars").stars();
		}).fail(function(e) {
			console.log(e.message);
		});
	};
	var isFav = function(id){
		var lfavs = window.localStorage.getItem("favs");
		var isf = false;
		if(lfavs){
			var afavs = lfavs.split("|");
			for(i=0;i<afavs.length;i++){
				if(id==afavs[i]){
					isf = true;
				}
			}
		}
		return isf;
	};
	var loadFavs = function(){
		var lfavs = window.localStorage.getItem("favs");
		var divqt = $("#favorites-list");
		divqt.html("");
		if(!lfavs){
			divqt.html("No favorites yet");
		}
		else{
			var afavs = lfavs.split("|");
			$.each(afavs,function(i2,v){
				var ajx = $.ajax({
					type: 'GET',
					url: imdb.url+"/movie/"+v+imdb.key,
					dataType: 'jsonp'
				});
			});
			ajx.done(function(resp) {
				var v1 = resp;
				var contx = {
					id:v1.id,imgurl:imdb.imgurl,poster_path:v1.poster_path,
					heart:"heartwhite",vote_count:kutils.numberWithCommas(v1.vote_count),
					title:(v1.title).replace(/'/g, "")
				};
				var source = $("#favs-element-template").html();
				var template = Handlebars.compile(source);
				divqt.append(template(contx));
			}).fail(function(e) {
				console.log(e.message);
			});
		}
	};
	var openModal = function(id,ttl){
		$("#modal").fadeIn('slow');
		$("#modal-video").html("");
		$("#modal-head span").html(ttl);
		var ajx = $.ajax({
			type: 'GET',
			url: imdb.url+"/movie/"+id+"/videos"+imdb.key,
			dataType: 'jsonp'
		});
		ajx.done(function(resp) {
			var v = resp.results[0];
			if(v!=null) $("#modal-video").html("<iframe width='80%' height='315' src='http://www.youtube.com/embed/qXti6uCbcCU?autoplay=1&showinfo=1&controls=1' frameborder='0' allowfullscreen></iframe>");
			else $("#modal-video").html("Trailer was not found");
		}).fail(function(e) {
			console.log(e.message);
		});
		listSimilar(id);
	};
	var listSimilar = function(id){
		$("#modal-similar-list").html("");
		queryTMDB("similar","/movie/"+id+"/similar");
	};
	var addToFavs = function(id,elem){
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
	};
	return{
		QueryTMDB: queryTMDB,
		LoadFavs: loadFavs,
		AddToFavs: addToFavs,
		OpenModal: openModal,
		Imdb: imdb
	}
})();
