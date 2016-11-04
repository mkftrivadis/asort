angular.module('app', ['sortHeader'])

.controller('testController', ['$scope', function ($scope) {
	$scope.data = [{ test1: 'ab', test2: 2, test3: 3 }, { test1: 'ba', test2: 1, test3: 3 }, { test1: 'cab', test2: 3 }];
}]);
/*
 * Sort AngularJS Library v1.0.0
 * https://jquery.com/
 *
 * Copyright Maurice Kenmeue Fonwe
 * Released under the MIT license
 *
 * Date: 2016-10-24
 */

angular.module('sortHeader', [])

.constant('sortHeaderConsts', {
	cssHeader: 'sort-header',
	cssProp: 'sort-property',
	ascClass: 'sort-asc',
	descClass: 'sort-desc',
	asc: 'asc',
	desc: 'desc'
})

.factory('sortHeaderTools', ['sortHeaderConsts', function(sortHeaderConsts) {
	return {
		getOrderingClass: function (ordering) {
			switch (ordering) {
				case sortHeaderConsts.asc:
					return sortHeaderConsts.ascClass;
				case sortHeaderConsts.desc:
					return sortHeaderConsts.descClass;
				default:
					return '';
			}
		}
	};
}])

.directive('sort', ['$q', 'sortHeaderConsts', function ($q, sortHeaderConsts) {
	return {
		restrict: 'A',
		scope: {
			sort: '=',
			sortRefresh: '&',
			query: '@'
		},

		controller: ['$scope', function ($scope) {
			this.active = '';
			this.sort = function (property, order, type, preset) {
				if ($scope.query) {
					return $q.when($scope.sortRefresh().call(this, property, order, type ? type.replace(/\s/g, '') : type, preset));
				}
				else {
					if (type === null || type === undefined) {
						$scope.sort.sort(function (a, b) {
							if (preset) {
								return order === sortHeaderConsts.asc ? preset.indexOf(a[property]) - preset.indexOf(b[property])
										: preset.indexOf(b[property]) - preset.indexOf(a[property]);
							}

							if (a[property] > b[property]) {
								return order === sortHeaderConsts.asc ? 1 : -1;
							}
							else if (a[property] < b[property]) {
								return order === sortHeaderConsts.asc ? -1 : 1;
							} else {
								return 0;
							}
						});
					} else if (type.replace(/\s/g, '') === 'date') {
						$scope.sort.sort(function (a, b) {
							var comparison = new Date(b[property]).getTime() - new Date(a[property]).getTime();

							return order === sortHeaderConsts.asc ? -comparison : comparison;
						});
					}

					return $q.when(0);
				}
			};
		}],
		controllerAs: 'sortCtrl',

		link: function (scope, element, attrs) {
			angular.element(element).addClass(sortHeaderConsts.cssHeader);
			scope.query = attrs.sortRefresh ? true : false;
		}
	};
}])

.directive('sortProperty', ['sortHeaderConsts', 'sortHeaderTools', function (sortHeaderConsts, sortHeaderTools) {
	return {
		restrict: 'A',
		require: '^sort',
		scope: {
			sortOrder: '@',
			sortPreset: '=?'
		},

		link: function (scope, element, attrs, controller) {
			scope.sortOrder = scope.sortOrder || sortHeaderConsts.asc;

			var elt = angular.element(element);
			var property = attrs.sortProperty.split('|');
			
			scope.$watch(function () {
				return controller.active;
			}, function (active) {
				if (active != property[0]) {
					elt.removeClass(sortHeaderConsts.ascClass + ' ' + sortHeaderConsts.descClass);
				}
			});

			elt.addClass(sortHeaderConsts.cssProp);
			elt.on('click', function () {
				controller.active = property[0];
				controller.sort(property[0].replace(/\s/g, ''), scope.sortOrder, property[1], scope.sortPreset)
					.then(function () {
						elt.removeClass(sortHeaderConsts.ascClass + ' ' + sortHeaderConsts.descClass).addClass(sortHeaderTools.getOrderingClass(scope.sortOrder));
						scope.sortOrder = scope.sortOrder === sortHeaderConsts.asc ? sortHeaderConsts.desc : sortHeaderConsts.asc;
					});
			});

			if (attrs.sortDefault) {
				elt.triggerHandler('click');
			}
		}
	};
}]);