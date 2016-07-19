var app = angular.module('myApp', ['angular-toArrayFilter',
									'ngRoute'
						]);

app.config(function($routeProvider) {
        $routeProvider

            // route for the home page
            .when('/', {
                templateUrl : 'views/main.html',
                controller  : 'myCtrl'
            })

            // route for the about page
            .when('/user/:id', {
                templateUrl : 'views/profile.html',
                controller  : 'myCtrl'
            })

            // route for the contact page
            .when('/contact', {
                templateUrl : 'pages/contact.html',
                controller  : 'contactController'
            })
            .otherwise({
            	redirectTo:'/'
            });
 });




app.controller('myCtrl', function($scope, $http,$location,$filter) {


	$scope.welcome= "HEllo WOrld";
    $http.get("data.json")
    .then(function(response) {
        $scope.emp =  response.data;
    });

    $scope.getdata = function(){

    		var _MS_PER_DAY = 1000 * 60 * 60 * 24;
    		var str = $location.path().split('user/');
    		var dataaaa = str[1];
    		$scope.piedatajson = [];
    		$http.get("data.json")
		    .then(function(response) {
		        
				$scope.empdetail = $filter('filter')(response.data, {EmpID: dataaaa })[0];
				console.log($scope.empdetail);
				console.log($scope.empdetail.Skills);
				console.log($scope.empdetail.AssignationCycle);
				console.log($scope.empdetail.Bench);
				var len = Object.keys($scope.empdetail.AssignationCycle).length;
				$scope.skills = $scope.empdetail.Skills;

				angular.forEach($scope.empdetail.AssignationCycle, function(value, key){
				     console.log(key);
				     console.log(value.StartDate);

				     	var a =  new Date(value.StartDate);
					    var b =  new Date(value.EndDate);
					    dateDiffInDays(a,b);
						// a and b are javascript Date objects
						
						function dateDiffInDays(a, b) {
						  // Discard the time and time-zone information.
						  var utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
						  var utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

						 	var dateindays = Math.floor((utc2 - utc1) / _MS_PER_DAY) + 1;
						 	 	var obj = {pname: key, days: dateindays};
    							$scope.piedatajson.push(obj);
    							console.log($scope.piedatajson);
						}

						

				});

				var dd = 0;
				var i=0;
				$scope.benchlength = Object.keys($scope.empdetail.Bench).length;
				console.log($scope.benchlength);
				angular.forEach($scope.empdetail.Bench, function(value, key){ 

						i++;
							var a =  new Date(value.StartDate);
						    var b =  new Date(value.EndDate);
						    
						    dateDiffInDays2(a,b);
							// a and b are javascript Date objects
							

							function dateDiffInDays2(a, b) {
							  // Discard the time and time-zone information.
							  var utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
							  var utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

							 	var dateindays = Math.floor((utc2 - utc1) / _MS_PER_DAY) + 1;
								dd = dd + dateindays;
									 	
							 	
	    						if(i === $scope.benchlength){
	    								var obj1 = {pname: "Bench", days: dd};
	    								$scope.piedatajson.push(obj1);
	    								console.log($scope.piedatajson);
	    								$scope.createchart($scope.piedatajson);
	    						}
							}



			    });

		    });

		    
		    


    };
    $scope.click = "";
   // $scope.pdetail =[];
    $scope.createchart = function(piedata) {


			var w = 400;
			var h = 400;
			var r = h/2;
			var color = d3.scale.category20c();

			var data = 		  piedata;
			//console.log(data);


			var vis = d3.select('#chart').append("svg:svg").data([data]).attr("width", w).attr("height", h).append("svg:g").attr("transform", "translate(" + r + "," + r + ")");
			var pie = d3.layout.pie().value(function(d){return d.days;});

			// declare an arc generator function
			var arc = d3.svg.arc().outerRadius(r);

			// select paths, use arc generator to draw
			var arcs = vis.selectAll("g.slice").data(pie).enter().append("svg:g").attr("class", "slice");
			arcs.append("svg:path")
			    .attr("fill", function(d, i){
			        return color(i);
			    })
			    .attr("d", function (d) {
			        // log the result of the arc generator to show how cool it is :)
			        console.log(arc(d));
			        return arc(d);
			    })
			    .on("click", function(d, i) {
			    	  $scope.clickk = "yes";	
			    	  $scope.pdetail = {pname: data[i].pname, days: data[i].days, pcolor: color(i)};	
			    	  console.log($scope.clickk);
			    	  $scope.$evalAsync();
			          //alert(data[i].days)
			     });

			// add the text
			arcs.append("svg:text").attr("transform", function(d){
						d.innerRadius = 0;
						d.outerRadius = r;
			    return "translate(" + arc.centroid(d) + ")";}).attr("text-anchor", "middle").text( function(d, i) {
			    return data[i].pname;}
					);
		}	    
    
});

app.controller('userCtrl', function($scope, $http) {



});