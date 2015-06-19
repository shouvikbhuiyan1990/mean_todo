var app = angular.module('toDOApp',[]);

app.controller('ToDOCtrl',['$scope','$http','$rootScope','myFac',function($scope,$http,$rootScope,myFac){
	var postObj;

	myFac.updateCount().success(function(data){
    	$scope.activeCount = data.length;
    });

	myFac.initData().success(function(data){
		$scope.todoRecs = data;
		//$scope.activeCount = 0;
	});

	

	$scope.toDoSubmit = function(){
		postObj = {'name':$scope.toDoText,done:false};
		$scope.toDoText = '';
		$http.post('/records/update',postObj).success(function(data){
			myFac.updateData();
		});

		myFac.updateCount().success(function(data){
	    	$scope.activeCount = data.length;
	    });
		
	};

	$scope.$on('todo/newData',function(e,data){
		$scope.todoRecs = data;
	});

	$scope.viewAll = function(){
		myFac.updateData();
	};

	$scope.deleteDone = function(){
		$http.get('/todo/delete').success(function(data){
			myFac.updateData();
		})
	};

	$scope.showActive = function(){
		$http.get('/todo/active').success(function(data){
			$scope.todoRecs = data;
		})
	}

}]);

app.directive('recWorld',[ '$http','myFac',function($http,myFac) {
  return {
     // use a new isolated scope
    restrict: 'E',
    link : function(scope,elem,attr){
    	var reqObj = {};
    	elem.bind('click',function(){
    		
    		reqObj.id = $(this).attr('id');
    		$http.post('/records/getone',reqObj).success(function(data){
    			reqObj.doneCount = data.done;
    			scope.rec.done = !data.done;
    			$http.post('/records/modify',reqObj).success(function(innerData){
    				myFac.updateCount().success(function(data){
		    			scope.$parent.activeCount = data.length;
		    		})
    			})
    		});
    	})
    }
  };
}]);
app.factory('myFac',['$rootScope','$http',function(root,http){
	return{
		initData : function(){
			return http.get('/records/todo') 
		},
		updateData : function(){
			http.get('/records/todo').success(function(data){
				root.$broadcast('todo/newData',data);
			});
		},
		updateCount : function(){
			return http.get('/todo/active') 
		}
	}
}])


//added some comment