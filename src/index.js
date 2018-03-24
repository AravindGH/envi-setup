import age from './util';
import validator from 'validator';
import React from 'react';
import ReactDom from 'react-dom';

console.log("app is running");
 
console.log(age(2));
console.log(validator.isEmail('aravind@gmail.com'));


//const template = React.createElement('p',{},'testing 123'); before babel was installed..
const template = <p>This is because of babel</p>;
ReactDom.render(template,document.getElementById('app')); 

