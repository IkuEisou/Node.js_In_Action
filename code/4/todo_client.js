window.onload = init;

function init() {
	var btn = document.getElementById("addbtn");
	btn.onclick = handleBtnClick;
	showList();
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
	var url = "http://localhost:3000/"
	var addreq = new XMLHttpRequest();
	addreq.open("POST", url, true);
	addreq.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	addreq.send(itemtext);
	addreq.onreadystatechange = function () {
		if ( 4 == addreq.readyState ){
			var todoArray = addreq.responseText.split(',');
			alert("Adding successful: " + todoArray);
			localStorage.setItem("todolist", JSON.stringify(todoArray));
			// showList();
		}	
	};
}

function showList() {
	// var items = JSON.parse(responseText);
	var todos = getTodoList("todolist");
	var ul = document.getElementsByTagName("ul");
	for ( var item in todos){
		var li = document.createElement("li");
		var txt = document.createTextNode(todos[item]);
		li.appendChild(txt);
		ul[0].appendChild(li);
	}
}

function getTodoList(key) {
	// body...
	var playlistArray = localStorage.getItem(key);
	if (playlistArray == null || playlistArray == "") {
		playlistArray = new Array();
	}
	else{
		playlistArray = JSON.parse(playlistArray);
	}
	return playlistArray;
}