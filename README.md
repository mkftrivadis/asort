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
- you have two headers which allows you to sort persons by name or age
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
Notice that despite the *ng-repeat* directive, you still need to define the model the plugins should work on with `sort="persons"`.

#### Sort order
Order is achieved through *sort-order*. Allowed values are `asc` and `desc`.
By default, the sort order is ascending if not specified otherwise. Also note that clicking on a header always reverses the sorting. And yes you can use *sort-order* and *sort-default* altogether.

```html
<div sort-property="name" sort-default="true" sort-order="desc"></div>
```

#### Sorting date

#### Setting a preset

#### Custom sorting function

#### Custom asynchronous sort function

### Future work

### License

Licensed under MIT.
