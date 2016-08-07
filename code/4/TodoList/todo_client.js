window.onload = init;

function init() {
	var btn = document.getElementById("addbtn");
	btn.onclick = handleBtnClick;
	showList("todolist");
}

function handleBtnClick() {
	var item = document.getElementById("item");
	var itemtext = item.value;
	if ("" == itemtext) {
		alert("Please enter a task!");
		return;
	}
	addItem(itemtext);
}

function addItem(itemtext) {
	var url = "http://localhost:3000/";
	var addreq = new XMLHttpRequest();

	if (!itemtext) {
		return;
	}
	addreq.open("POST", url, true);
	addreq.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	addreq.send(itemtext);
	addreq.onreadystatechange = function () {
		if ( 4 == addreq.readyState ){
			var todoArray = addreq.responseText.split(',');
			console.log('"' + itemtext + '"' + " is added on the server!");
			localStorage.setItem("todolist", JSON.stringify(todoArray));
		}	
	};
}

function delItem(item) {
	var url = "http://localhost:3000/";
	var delReq = new XMLHttpRequest();

	delReq.open("DELETE", url, true);
	delReq.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	delReq.send(item);
	console.log('"' + item + '"' + " is sent!");
	delReq.onreadystatechange = function() {
		if ( 4 == delReq.readyState ) {
			var todoArray = delReq.responseText.split(',');
			console.log( '"' + item + '"' + " is deleted on the server!");
			if ("" == todoArray) {
				localStorage.removeItem("todolist");
				return;
			}
			localStorage.setItem("todolist", JSON.stringify(todoArray));
		}
	}
}	

function showList(list) {
	// var items = JSON.parse(responseText);
	var todos = getList(list);
	if (!todos.length || "" == todos) {
		return;
	}

	var ul = document.getElementsByTagName("ul");
	for ( var index in todos){
		var btn = document.createElement("button");
		var delSign = document.createTextNode("X");
		btn.appendChild(delSign);
		btn.setAttribute("id", index);
		btn.setAttribute("class", "rmBtn");
		btn.onclick = function () {
			var that = this;			
			var delIndex = that.getAttribute("id");
			var delText = todos[delIndex];
			var isDel = confirm("Are you sure delete " + delText);
			if (!isDel) {
				return;
			}

			// ul[0].removeChild(that);
			delItem(todos[delIndex]);
			todos.splice(delIndex, 1);
			console.log('"' + delText + '"' + " is deleted on the localStorage!");
			location.reload(false);
		};

		var li = document.createElement("li");
		var txt = document.createTextNode(todos[index]);
		li.appendChild(txt);
		li.appendChild(btn);
		ul[0].appendChild(li);
		console.log('"' + li.outerHTML + '"' + " is added!");
	}
}

function getList(list) {
	var todolist = localStorage.getItem(list);

	if (todolist == null) {
		todolist = new Array();
	}
	if (!todolist.length) {
		var url = "http://localhost:3000/getAll";
		var getReq = new XMLHttpRequest();

		getReq.open("GET", url);
		getReq.setRequestHeader("Content-type", "text/plain");
		getReq.send();
		console.log("Loading the todolist from server!");
		getReq.onreadystatechange = function () {
			if (4 == getReq.readyState) {
				var todoArray = getReq.responseText.split(",");
				console.log('"' + todoArray + "'" + " is loaded!");
				if ("" == todoArray) {
				 return;
				}
				localStorage.setItem(list, JSON.stringify(todoArray));
				todolist = localStorage.getItem(list);
				todolist = JSON.parse(todolist);
			}
		}
	}
	else {
		todolist = JSON.parse(todolist);
	}
	
	return todolist;
}