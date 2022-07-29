# SQL MACHINE - A UI Concept

---
## Description
### This is a demo SQL editor which can be used to query data easily from a given table(only one pre-existing table is there) and display it's result(only few SQL queries are working since it's a demo).

## Features
* The whole SQL experience has been abstracted in the form of a session. Session exists to manage the overall state of the app easily.
![ql4](https://user-images.githubusercontent.com/61937872/145217684-c03ac467-e1bd-475c-8f5e-f60734771990.gif)
<br />

* SQL queries can easily be run via the query cell, like so...
![ql2](https://user-images.githubusercontent.com/61937872/145217771-7719ea73-c24d-4939-a3cd-bed5fd0f6ebf.gif)
<br />

* The results of the SQL queries can be downloaded easily for reference in the form of CSV or in the form of JSON.
![ql5](https://user-images.githubusercontent.com/61937872/145217852-44a0fd63-bcdd-4c26-b3bb-d37fe94a7f9b.gif)
<br />

* The results can also be shared easily via the share link(& will be copied to the clipboard!)[Also, it will only work locally!].
![ql6](https://user-images.githubusercontent.com/61937872/145217909-099737ae-cfed-4b6e-9713-c2b16b304b00.gif)
<br />

* The total database schema can be viewed easily by the DB Info box, like so...
![ql3](https://user-images.githubusercontent.com/61937872/145217938-8a9c310e-12e6-4d1c-b570-b73808c01e2d.gif)
<br />

### NOTE: Since, there's no backend support currently to this app, the session will automatically expire once the user goes back to home or exits the app.

## Pre-Defined Queries
### The pre-defined queries that can be used to test the app are(case-insensitive):-
* **SELECT * FROM customers**
* **SELECT * FROM customers WHERE contactName**
* **SELECT * FROM customers WHERE companyName**
* **SELECT * FROM customers WHERE city**
* **SELECT * FROM customers WHERE name**
* **SELECT * FROM customers WHERE customerId**

## Page Load Time(the values provided are approximated)
* The page load time of the home page is coming out to be - 2160ms(on first open) & 1148ms(after first open).
* The page load time of the editor page is coming out to be - 879ms(on first open) &  876ms(after first open).
* The page load time of the sql-share page is coming out to be - 4187ms(on first open) & 3733ms(after first open).

### The above time has been calculated via Chrome Dev Tools and is composed of all the factors such as:
* Loading
* Scripting 
* Rendering 
* Painting 
* System
* Idle

## Thanks for checking it out!
