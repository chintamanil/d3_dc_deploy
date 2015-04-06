# Angular Charts ztesting with D3, DCjs & C3js

This projects aims at testing vairios d3 chartin libraries like c3js [along with some directives for c3], and dcjs with crossfilter.

Generator Used:
* [generator-angular](https://github.com/yeoman/generator-angular)
* http://jeff.konowit.ch/posts/yeoman-rails-angular/

## Technologies

* AngularJS
* Bootstrap
* d3
* c3js
* dc
* coffeescript
* haml
* Grunt

## Assumptions

* brew
* nodejs
* chrome
* ruby -- uses the haml gem at compile time, and also compass

## Installation


Install haml  & sass gem:

    gem install haml
    gem install compass

Install dependencies:

    cd angular_c3_nvd3_crossfilter
    npm install
    bower install

## Test (Karma)

    grunt test

## Run

Launch the server:
```
    grunt server
```

Edit app/view/main.html.haml and watch the LiveReload goodness!




