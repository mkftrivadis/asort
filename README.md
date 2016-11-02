# sort
**Another AngularJS sort plugin**

This plugin allows you to sort tabular data in a simple way. Sorting can be done automatically for the primitives types and dates. You can also provide a custom (provide) sort function.

### Dependencies
AngularJS 1.3.1+
### Installation
Include **sort.js** and **sort.css** in your scripts. Feel free to customize sort.css as the classes are actually very simple.
### Usage
Although the most common usage would be to used a *ng-repeat* to display tabular data, this plugin doesn't require a *ng-repeat*. In fact, the data are not copied by the plugin but rather sorted directly at the source. 
#### Simplest form
```html
  <div sort="data">
		<div sort-property="test1">HEADER 1</div>
		<div sort-property="test2" sort-default="true">HEADER 2</div>
	</div>
```
#### Sort order

#### Sorting date

#### Setting a preset

#### Custom sorting function

#### Custom asynchronous sort function

### Future work

### License

Licensed under MIT.
