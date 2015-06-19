var app = angular.module('toDOApp',[]);

app.controller('ToDOCtrl',['$scope','$http','$rootScope','myFac',function($scope,$http,$rootScope,myFac){
	var postObj;

	myFac.initData();

	$http.get('/records/todo').success(function(data){
		$scope.todoRecs = data;
		console.log(data);
	});

	$scope.toDoSubmit = function(){
		postObj = {'name':$scope.toDoText,done:false};
		$scope.toDoText = '';
		$http.post('/records/update',postObj).success(function(data){
			myFac.initData();
		});
		
	};

	$scope.$on('todo/newData',function(e,data){
		$scope.todoRecs = data;
	})

}]);

app.directive('recWorld',[ '$http',function($http) {
  return {
     // use a new isolated scope
    restrict: 'A',
    link : function(scope,elem,attr){
    	var reqObj = {};
    	elem.bind('click',function(){
    		reqObj.id = $(this).attr('id');
    		$http.post('/records/getone',reqObj).success(function(data){
    			reqObj.doneCount = data.done;
    			scope.rec.done = !data.done;
    			$http.post('/records/modify',reqObj).success(function(innerData){
    				console.log(innerData);
    			})
    		});
    	})
    }
  };
}]);
app.factory('myFac',['$rootScope','$http',function(root,http){
	return{
		initData : function(){
			http.get('/records/todo').success(function(data){
				root.$broadcast('todo/newData',data);
			});
		}
	}
}])


//added some comment