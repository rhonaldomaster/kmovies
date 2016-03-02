var kutils = (function(){
	return {
		getMonthName: function(m){
			var monthNames = ["January", "February", "March", "April", "May", "June",
				"July", "August", "September", "October", "November", "December"
			];
			return monthNames[m];
		},
		getMonthNameShort: function(m){
			var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
				"Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
			];
			return monthNames[m];
		},
		numberWithCommas: function(x) {
		    var parts = x.toString().split(".");
		    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
		    return parts.join(".");
		}
	};
}());
