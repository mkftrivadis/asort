/*
 * Sort AngularJS Library v1.0.0 - Tests
 * https://jquery.com/
 *
 * Copyright Maurice Kenmeue Fonwe
 * Released under the MIT license
 *
 * Date: 2016-10-24
 */

describe('sort: ', function () {
	var element;
	var $compile;
	var $rootScope;
	var sortHeaderConsts;

	beforeEach(module('sortHeader'));
	beforeEach(inject(function (_$compile_, _$rootScope_, _sortHeaderConsts_) {
		$compile = _$compile_;
		$rootScope = _$rootScope_;
		sortHeaderConsts = _sortHeaderConsts_;
	}));

	it('directive element should have css', function () {
		var element = $compile('<div sort></div>')($rootScope);

		$rootScope.$digest();
		expect(element.hasClass(sortHeaderConsts.cssHeader)).toBe(true);
	});

	it('directive scope.query should be false', function () {
		var element = $compile('<div sort></div>')($rootScope);

		$rootScope.$digest();
		expect(element.isolateScope().query).toBe(false);
	});

	it('directive scope.query should be true', function () {
		var element = $compile('<div sort sort-refresh="refresh()"></div>')($rootScope);

		$rootScope.$digest();
		expect(element.isolateScope().query).toBe(true);
	});
});

describe('sortProperty: ', function () {
	var element;
	var $compile;
	var $rootScope;
	var sortHeaderConsts;

	beforeEach(module('sortHeader'));
	beforeEach(inject(function (_$compile_, _$rootScope_, _sortHeaderConsts_) {
		$compile = _$compile_;
		$rootScope = _$rootScope_;
		sortHeaderConsts = _sortHeaderConsts_;
	}));

	it('directive element should have css', function () {
		var element = $compile('<div sort><div sort-property="test"></div></div>')($rootScope);

		$rootScope.$digest();
		expect(element.find('div').hasClass(sortHeaderConsts.cssProp)).toBe(true);
	});

	it('directive scope.sortOrder should be asc', function () {
		var element = $compile('<div sort><div sort-property="test"></div></div>')($rootScope);

		$rootScope.$digest();
		expect(element.find('div').isolateScope().sortOrder).toBe(sortHeaderConsts.asc);
	});

	it('directive scope.sortOrder should be set', function () {
		var order = sortHeaderConsts.desc;
		var element = $compile('<div sort><div sort-property="test" sort-order="' + order + '"></div></div>')($rootScope);

		$rootScope.$digest();
		expect(element.find('div').isolateScope().sortOrder).toBe(order);
	});

	it('directive element has either asc or desc css', function (done) {
		var element = $compile('<div sort="data"><div sort-property="value"></div></div>')($rootScope);

		$rootScope.data = [{ value: 1 }, { value: 4 }, { value: 2 }, { value: 3 }, { value: 5 }];
		$rootScope.$digest();
		
		element.find('div').triggerHandler('click');
		element.find('div').triggerHandler('click');
		$rootScope.$apply();

		setTimeout(function () {
			expect(element.find('div').hasClass(sortHeaderConsts.descClass)).toBe(true);
			expect(element.find('div').hasClass(sortHeaderConsts.ascClass)).toBe(false);
			done(); // because order is switched async
		}, 500);
	});

	it('directive scope.sortOrder, asc -> desc + css after sorting', function (done) {
		var element = $compile('<div sort="data"><div sort-property="value"></div></div>')($rootScope);

		$rootScope.data = [{ value: 1 }, { value: 4 }, { value: 2 }, { value: 3 }, { value: 5 }];
		$rootScope.$digest();

		element.find('div').triggerHandler('click');
		$rootScope.$apply();

		setTimeout(function () {
			expect(element.find('div').isolateScope().sortOrder).toBe(sortHeaderConsts.desc);
			expect(element.find('div').hasClass(sortHeaderConsts.ascClass)).toBe(true);
			done(); // because order is switched async
		}, 300);
	});

	it('directive scope.sortOrder, asc -> desc + css after sorting', function (done) {
		var order = sortHeaderConsts.desc;
		var element = $compile('<div sort="data"><div sort-property="value" sort-order="desc"></div></div>')($rootScope);

		$rootScope.data = [{ value: 1 }, { value: 4 }, { value: 2 }, { value: 3 }, { value: 5 }];
		$rootScope.$digest();

		element.find('div').triggerHandler('click');
		$rootScope.$apply();

		setTimeout(function () {
			expect(element.find('div').isolateScope().sortOrder).toBe(sortHeaderConsts.asc);
			expect(element.find('div').hasClass(sortHeaderConsts.descClass)).toBe(true);
			done(); // because order is switched async
		}, 300);
	});

	it('directive with query, parameters should be passed', function () {
		var element = $compile('<div sort="data" sort-refresh="refresh"><div sort-property="value | date" sort-preset="testSorter"></div></div>')($rootScope);

		$rootScope.parameters = '';
		$rootScope.testSorter = [1, 3, 5, 2, 4];
		$rootScope.refresh = function (a, b, c, d) {
			$rootScope.parameters = a + b + c + d;
		};
		$rootScope.data = [{ value: 1 }, { value: 4 }, { value: 2 }, { value: 3 }, { value: 5 }];
		$rootScope.$digest();

		element.find('div').triggerHandler('click');
		expect($rootScope.parameters).toBe('valueascdate1,3,5,2,4');
	});

	it('directive with query, scope.sortOrder asc should be set to desc after sorting', function (done) {
		var element = $compile('<div sort="data" sort-refresh="refresh"><div sort-property="value"></div></div>')($rootScope);

		$rootScope.refresh = function (a, b, c, d) {
			return 0;
		};
		$rootScope.data = [{ value: 1 }, { value: 4 }, { value: 2 }, { value: 3 }, { value: 5 }];
		$rootScope.$digest();

		element.find('div').triggerHandler('click');
		$rootScope.$apply();

		setTimeout(function () {
			expect(element.find('div').isolateScope().sortOrder).toBe(sortHeaderConsts.desc);
			done(); // because order is switched async
		}, 300);
	});

	it('directive with async query, asc -> desc + list updated + css', function (done) {
		inject(function ($httpBackend, $http) {
			var element = $compile('<div sort="data" sort-refresh="refresh"><div sort-property="value"></div></div>')($rootScope);
			var url = 'test/data/asc';

			$httpBackend.expectGET(url).respond([{ value: 1 }, { value: 2 }, { value: 3 }, { value: 4 }, { value: 5 }]);
			$rootScope.refresh = function (a, b, c, d) {
				return $http.get(url).then(function (response) {
					$rootScope.data = response.data;
				});
			};
			$rootScope.data = [{ value: 1 }, { value: 4 }, { value: 2 }, { value: 3 }, { value: 5 }];
			$rootScope.$digest();

			element.find('div').triggerHandler('click');
			$rootScope.$apply();

			setTimeout(function () {
				$httpBackend.flush();
				expect(element.find('div').isolateScope().sortOrder).toBe(sortHeaderConsts.desc);
				expect($rootScope.data).toEqual([{ value: 1 }, { value: 2 }, { value: 3 }, { value: 4 }, { value: 5 }]);
				expect(element.find('div').hasClass(sortHeaderConsts.ascClass)).toBe(true);
				done(); // because order is switched async
			}, 2000);
		});
	});

	it('directive, sort-default should trigger sorting', function () {
		$rootScope.data = [{ value: 1 }, { value: 4 }, { value: 2 }, { value: 3 }, { value: 5 }];
		var element = $compile('<div sort="data"><div sort-property="value" sort-default="true"></div></div>')($rootScope);

		expect($rootScope.data).toEqual([{ value: 1 }, { value: 2 }, { value: 3 }, { value: 4 }, { value: 5 }]);
	});

	it('directive, sort-default and specific ordering', function () {
	  $rootScope.data = [{ value1: 1, value2: 'a' }, { value1: 4, value2: 'd' },
     { value1: 2, value2: 'y' }, { value1: 3, value2: 'l' }, { value1: 5, value2: 'c' }];

	  var element = $compile('<div sort="data"><div sort-property="value1" sort-default="true" sort-order="desc"><div sort-property="value2"></div></div>')($rootScope);

	  expect($rootScope.data).toEqual([{ value1: 5, value2: 'c' }, { value1: 4, value2: 'd' }, { value1: 3, value2: 'l' },
      { value1: 2, value2: 'y' }, { value1: 1, value2: 'a' }]);
	});

	it('directive only one element has ordering css', function (done) {
		var element = $compile('<div sort="data"><div sort-property="value1"><div sort-property="value2"></div></div>')($rootScope);

		$rootScope.data = [{ value1: 1, value2: 'a' }, { value1: 4, value2: 'd' },
			{ value1: 2, value2: 'y' }, { value1: 3, value2: 'l' }, { value1: 5, value2: 'c' }];
		$rootScope.$digest();

		element.find('div').eq(0).triggerHandler('click');
		element.find('div').eq(1).triggerHandler('click');
		$rootScope.$apply();

		setTimeout(function () {
			expect(element.find('div').eq(0).hasClass(sortHeaderConsts.descClass)).toBe(false);
			expect(element.find('div').eq(0).hasClass(sortHeaderConsts.ascClass)).toBe(false);
			expect(element.find('div').eq(1).hasClass(sortHeaderConsts.ascClass)).toBe(true);
			done(); // because order is switched async
		}, 500);
	});

	it('data should be ascending ordered', function () {
		var element = $compile('<div sort="data"><div sort-property="value"></div></div>')($rootScope);

		$rootScope.data = [{ value: 1 }, { value: 4 }, { value: 2 }, { value: 3 }, { value: 5 }];
		$rootScope.$digest();

		element.find('div').triggerHandler('click');
		expect($rootScope.data).toEqual([{ value: 1 }, { value: 2 }, { value: 3 }, { value: 4 }, { value: 5 }]);
	});

	it('data should be descending ordered', function () {
		var element = $compile('<div sort="data"><div sort-property="value" sort-order="desc"></div></div>')($rootScope);

		$rootScope.data = [{ value: 1 }, { value: 4 }, { value: 2 }, { value: 3 }, { value: 5 }];
		$rootScope.$digest();

		element.find('div').triggerHandler('click');
		expect($rootScope.data).toEqual([{ value: 5 }, { value: 4 }, { value: 3 }, { value: 2 }, { value: 1 }]);
	});

	it('date should be ascending ordered', function () {
		var element = $compile('<div sort="data"><div sort-property="value | date" sort-order="asc"></div></div>')($rootScope);

		$rootScope.data = [{ value: '2016-03-19T04:22:14' }, { value: '2015-03-17T14:22:14' },
				{ value: '2015-03-19T04:22:14' }, { value: '2016-07-19T07:12:14' }];
		$rootScope.$digest();

		element.find('div').triggerHandler('click');
		expect($rootScope.data).toEqual([{ value: '2015-03-17T14:22:14' }, { value: '2015-03-19T04:22:14' },
				{ value: '2016-03-19T04:22:14' }, { value: '2016-07-19T07:12:14' }]);
	});

	it('date should be descending ordered', function () {
		var element = $compile('<div sort="data"><div sort-property="value | date" sort-order="desc"></div></div>')($rootScope);

		$rootScope.data = [{ value: '2016-03-19T04:22:14' }, { value: '2015-03-17T14:22:14' },
				{ value: '2015-03-19T04:22:14' }, { value: '2016-07-19T07:12:14' }];
		$rootScope.$digest();

		element.find('div').triggerHandler('click');
		expect($rootScope.data).toEqual([{ value: '2016-07-19T07:12:14' }, { value: '2016-03-19T04:22:14' },
				{ value: '2015-03-19T04:22:14' }, { value: '2015-03-17T14:22:14' }]);
	});

	it('directive scope.preset should be set', function () {
		var element = $compile('<div sort><div sort-property="test" sort-preset="testSorter"></div></div>')($rootScope);

		$rootScope.testSorter = [1, 3, 5, 2, 4];
		$rootScope.$digest();
		expect(element.find('div').isolateScope().sortPreset).toBe($rootScope.testSorter);
	});

	it('directive scope.preset should set the ascending order', function () {
		var element = $compile('<div sort="data"><div sort-property="value" sort-preset="testSorter"></div></div>')($rootScope);

		$rootScope.data = [{ value: 1 }, { value: 4 }, { value: 2 }, { value: 3 }, { value: 5 }, { value: 4 }];
		$rootScope.testSorter = [1, 3, 5, 2, 4];
		$rootScope.$digest();

		element.find('div').triggerHandler('click');
		expect($rootScope.data).toEqual([{ value: 1 }, { value: 3 }, { value: 5 }, { value: 2 }, { value: 4 }, { value: 4 }]);
	});

	it('directive scope.preset should set the descending order', function () {
		var element = $compile('<div sort="data"><div sort-property="value" sort-preset="testSorter" sort-order="desc"></div></div>')($rootScope);

		$rootScope.data = [{ value: 1 }, { value: 4 }, { value: 2 }, { value: 3 }, { value: 5 }, { value: 4 }];
		$rootScope.testSorter = [1, 3, 5, 2, 4];
		$rootScope.$digest();

		element.find('div').triggerHandler('click');
		expect($rootScope.data).toEqual([{ value: 4 }, { value: 4 }, { value: 2 }, { value: 5 }, { value: 3 }, { value: 1 }]);
	});
});