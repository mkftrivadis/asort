# sort - **another angularJS sorting plugin**

This plugin allows you to sort tabular data in a simple way. Sorting can be done automatically for the primitives types and dates. You can also provide a custom (provide) sort function.

### Dependencies
AngularJS 1.3.1+

### Installation
Include **sort.js** and **sort.css** in your scripts. Feel free to customize sort.css as the classes are actually very simple.

### Usage 
Been here already? then [jump to the summary table](#summary-of-usage)

Although the most common usage would be to used a *ng-repeat* to display tabular data, this plugin doesn't require a *ng-repeat*. In fact, the data are not copied by the plugin but rather sorted directly at the source. 
#### Simplest Form
Assuming you have the following configuration:

**Model**
```javascript
$scope.persons = [{ name: 'Maurice', age: '10' }, { name: 'Your name', age: 0 }, ...];
```

**View**

```html
<div sort="persons">
  <div sort-property="name">Name</div>
  <div sort-property="age" sort-default="true">Age</div>
<div>
```
As you probably figured out:
- you have two headers which allows you to sort persons by name or age.
- **sort** defines the data to be sorted
- **sort-property** declares the property to be used to sort the data upon click
- with **sort-default**, you can set the default initial sorting property. If it is not defined then the data will be initially displayed as they are in the model.

Note that in the example above, you'll basically have to take care of displaying the data. Using the plugin in a table with a *ng-repeat* should be something like:
```html
<table sort="persons">
  <tr>
    <th sort-property="name">Name</th>
    <th sort-property="age" sort-default="true">Age</th>
  </tr>
  <tr ng-repeat="person in persons">
    <td>{{person.name}}</td>
    <td>{{person.age}}</td>
  </tr>
</table>
```
Notice that despite the *ng-repeat* directive, you still need to define the model the plugins should work on with `sort="persons"`. In the remainder of this readme, `<div>...</div>` will be used.

#### Sort Order
Order is achieved through *sort-order*. Allowed values are `asc` and `desc`. By default, the sort order is ascending if not specified otherwise. 

Clicking on a header always reverses the sorting. For instance, if the data are not sorted, clicking on a header will sort it ascending; clicking again on the same header will sort the data descending and so on. A css class (`sort-asc` or `sort-desc`) is always appended to the header to reflect the current sort order. 

Note that you can combine *sort-order* and *sort-default*.
```html
<div sort-property="name" sort-default="true" sort-order="desc"></div>
```
#### Sorting Date
Out of the box, the plugin provides sorting for simple types like `int`, `string` and `bool`. The type `Date` is also suppported but needs to be enabled with `| date` through *sort-property*. Assuming that the property is called *myDateProperty* and that it is a date object or an international formatted date string like `2016-03-19T04:22:14` for instance, you shoud activate sorting with the following code:
```html
sort-property="myDateProperty | date"
```
Although the syntax above looks like a filter is being applied, it really isn't. Back in the code, the value of *sort-property* is parsed to and attempt to convert the string to a Date object is made.

#### Custom Sorting Function
You can bypass the out of the box sorting function by providing your own function through the **sort-refresh** attribute. The function provided there should expect 4 parameters:

1. The property to be sorted upon as a string

2. The sorting order as a string i.e. `asc` or `desc`
3. 'date' or null depending on whether date sorting is enabled as described in [Sorting Date](#sorting-date)
4. The preset array (see later in (#setting-a-preset-for-sorting) or null

The custom function is not given per property but rather global for all properties and should therefore be configured on the same level as the model. Assuming the following definitions in your model:

```javascript
$scope.persons = [...];
$scope.myCustomSort =  function(prop, order, date, preset) {
  ...
};
```
your view should be similar to the following:

```html
<div sort="persons" sort-refresh="myCustomSort">
  <div sort-property="name"></div>
  <div sort-property="age"></div>
</div>
```
So clicking on the name header for instance shall trigger a call of your custom function `myCustomSort` with the 4 parameters set as follow
```javascript
myCustomSort('name', 'asc', null, null)
```

#### Custom Asynchronous Sort Function
If you use an asynchronous custom sorting function, you'll want to return a promise. Internally, the returned promise is required in order to set the css classes accordingly when the promise is resolved or do nothing if it's rejected. For instance your custom sorting function should look like:
```javascript
$scope.myCustomSort = function(prop, order, date, preset) {
  return $http.get(url).then(..., ...);
};
```

#### Setting a Preset for Sorting 
As explained previously, the custom sorting function is global for all properties and receives the property name as the first parameter. Anyway, the plugin allows you to customize sorting on the property level only for a very special case. 

Assume that you have an array of persons with *name*, *age* and *status* which should signal their marital status through a `string` e.g. *married*, *divorced*, *single*, *widowed* just to name a few. Out of the box, you could only order people alphabetically according to their marital status. But if you needed the marital status to be sorted logically i.e. from *single* to *widowed* in the ascending case and reversely in the descending case, you could write a custom function. Good news: you actually don't need to :) 

Through the **sort-preset**, you could predefine an ascending order with which a property could be sorted. For instance doing this:
```javascript
$scope.myPresetForStatus = ['single', 'married', 'divorced', 'widowed'];
```

```html
...
<div sort-property="status" sort-preset="myPresetForStatus"></div>
...
```
will sort people by marital status according to the order given in the model *$scope.myPresetForStatus*.

### Summary of Usage
The html and table below show an extreme short summary of what has be explained earlier in this readme.

```html
<div sort="persons" sort-refresh="myCustomSortFunction"> <!-- parent -->
  <div sort-property="name">Name</div> <!-- header -->
  <div sort-property="age" sort-default="true">Age</div> <!-- header -->
  <div sort-property="born | date">Day of Birth</div> <!-- header -->
  <div sort-property="status" sort-preset="myPresetForStatusArray">Marital Status</div> <!-- header -->
<div>
```

Attribute | Usage | Level
------------------- | ------ | ---
  **sort** | model to be sorted | parent
  | *type:* array on the scope
  **sort-refresh** | custom sort function | parent
  | *type:* function(prop, order, date, preset) |
  | *info:* can be asynchronous, in which case the function should return a promise |
  **sort-property** | property to sort upon. Out of box sorting is only for simple type (int, string, bool) | header
  | *type:* string |
  | *info:* use " \| date" to enable sorting on type Date |
  **sort-order** | define the sorting order | header
  | *type:* string |
  | *info:* possible values are 'asc', 'desc'. 'asc' is set by default. Clicking on a header reverses the sorting order. Predefined css classes can be used to customize the view |
  **sort-default** | default sorting until a header is clicked | header
  | *type:* bool |
  **sort-preset** | predefine values upon sorting should be performed | header
  | *type:* array with values of the same type as the property |

### Future work
1. Implement the plugin for angularJS 2.x. 

Wanna help? Feel free or send me an email ;)

### License

Licensed under MIT.
