angular.module('app', [])

.controller('MainController', function($scope, $http, $rootScope) {

	$scope.hosts = [];
	$scope.password = "";
	$scope.errorMessage = "";

	var pingHost = function(host, callback) {
		$http({
			method: 'POST',
			data: host,
			url: '/api/host/ping',
			headers: {
				"Password": $scope.password
			}
		}).then(function(response) {
			callback(response.data);
	  		$scope.errorMessage = "";
		}, function(error) {
			if(error.status == 403) {
				$scope.errorMessage = "Dostęp zastrzeżony!";
				$scope.hosts = [];
			}
		});
	};

	var loadHosts = function() {
		$http({
			method: 'GET',
			url: '/api/hosts',
			headers: {
				"Password": $scope.password
			}
		}).then(function(response) {
			$scope.hosts = response.data;
			$scope.pingAll();
			$scope.errorMessage = "";
		}, function(error) {
			if(error.status == 403) {
				$scope.errorMessage = "Dostęp zastrzeżony!";
				$scope.hosts = [];
			}
		});
	};

	$scope.wake = function(host) {
		$scope.$emit('showAjaxLoad');
		$http({
			method: 'POST',
			data: host,
			url: '/api/host/wake',
			headers: {
				"Password": $scope.password
			}
		}).then(function(response) {
			$scope.$emit('hideAjaxLoad');
			$scope.errorMessage = "";
		}, function(error) {
			if(error.status == 403) {
				$scope.errorMessage = "Dostęp zastrzeżony!";
				$scope.hosts = [];
			}
		});
	};

	$scope.pingAll = function() {
		$scope.$emit('showAjaxLoad');

		var hostsCountLeft = $scope.hosts.length;
	    $scope.hosts.forEach(function(host) {
			pingHost(host, function(ping) {
				host.active = ping.alive;
				hostsCountLeft--;
				if(!hostsCountLeft) {
					$scope.$emit('hideAjaxLoad');
				}
			});
	    });
	};

  	$scope.pingHost = function(host) {
  		$scope.$emit('showAjaxLoad');
		pingHost(host, function(ping) {
			$scope.$emit('hideAjaxLoad');
			host.active = ping.alive;
		});
	};

	$scope.panelKeyPress = function(e) {
		if(e.keyCode == 13) {
			loadHosts();
		}
	};
})
.controller('AjaxController', function($scope, $interval, $rootScope) {

	$scope.isLoading = false;
	$scope.widthAnimation = 10;
	$scope.marginAnimation = 10;

	function intervalEvent() {
		$scope.marginAnimation = ($scope.marginAnimation * 1.02) % 100;
		$scope.widthAnimation = ($scope.widthAnimation * 1.06) % 100;
	}

	var interval = $interval(intervalEvent, 20);

	$rootScope.$on('showAjaxLoad', function() {
        $scope.isLoading = true;
        interval = $interval(intervalEvent, 20);
    });
    $rootScope.$on('hideAjaxLoad', function() {
        $scope.isLoading = false;
        $interval.cancel(interval);
    });

    $scope.$on('$destroy', function() {
		if($scope.isLoading) {
			$interval.cancel(interval);
		}
    });
});