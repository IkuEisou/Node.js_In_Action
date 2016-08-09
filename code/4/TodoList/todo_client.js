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

	var todoArray = JSON.parse(localStorage.getItem("todolist"));
	if (todoArray && todoArray.indexOf(itemtext) != -1) {
		alert('"'  + itemtext + '"' + " already exists!")
		return;
	}
	
	addItem(itemtext);
	
	var isAdd2Sv = confirm("Do you want to add the " + '"' + itemtext + '"' + " on the server?")
	if (!isAdd2Sv) {
		return;
	}

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
			switch (addreq.status){
				case 200 :
					var todoArray = addreq.responseText.split(',');
					console.log('"' + itemtext + '"' + " is added on the server!");
					break;
				case 302:
					alert('"' + itemtext + '"' + addreq.responseText);
			}
		}	
	};
}

function addItem(itemtext) {
	var div = document.getElementById("show");
	if (!div.childElementCount) {
		var ul = document.createElement("ul");
		ul.setAttribute("id", "lists");
		div.appendChild(ul);
	}

	var ul = document.getElementById("lists");
	var itemnode = document.createTextNode(itemtext);
	var btn = document.createElement("button");
	var delSign = document.createTextNode("X");
	var index = ul.childElementCount;

	btn.appendChild(delSign);
	btn.setAttribute("id", index);
	btn.setAttribute("class", "rmBtn");
	btn.onclick = function () {
		var that = this;			
		var delIndex = that.getAttribute("id");
		var delText = that.parentNode.textContent.replace("X", '');
		var delLi = document.getElementById(delIndex).parentNode;

		ul.removeChild(delLi);
		todoArray.splice(delIndex, 1);
		localStorage.setItem("todolist", JSON.stringify(todoArray));
		console.log('"' + delText + '"' + " is deleted on the localStorage!");

		delItem(delText);
	};

	var li = document.createElement("li");
	li.appendChild(itemnode);
	li.appendChild(btn);
	ul.appendChild(li);
	
	var todoArray = JSON.parse(localStorage.getItem("todolist"));
	if (null  == todoArray) {
		todoArray = new Array();
	}
	if (todoArray.indexOf(itemtext) != -1) {
		return;
	}	
	todoArray.push(itemtext);
	localStorage.setItem("todolist", JSON.stringify(todoArray));
	console.log('"' + itemtext + '"' + " is added on the localStorage!");
}

function delItem(item) {
	var isDel = confirm("Are you sure delete "  + '"' + item + '"' + " on the server?");
	if (!isDel) {
		return;
	}
	var url = "http://localhost:3000/";
	var delReq = new XMLHttpRequest();

	delReq.open("DELETE", url, true);
	delReq.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	delReq.send(item);
	console.log('"' + item + '"' + " is sent!");
	delReq.onreadystatechange = function() {
		if ( 4 == delReq.readyState ) {
			switch (delReq.status){
				case 200 :
					console.log('"' + item + '"' + " is deleted on the server!");
					break;
				case 404 :
					alert('"' + item + '"' + delReq.responseText);
					break;
			}
		}
	}
}	

function showList(list) {
	var todos = getList(list);
	
	if (!todos.length || "" == todos) {
		return;
	}

	for ( var index in todos){
		addItem(todos[index]);
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
		getReq.onreadystatechange = function () {
			if (4 == getReq.readyState) {
				var todoArray = getReq.responseText.split(",");
				if ("" == todoArray  ) {
					console.log("There is no task at the server!");
					return;
				}
		
				console.log('"' + todoArray + '"' + " is loaded from the server!");
				localStorage.setItem(list, JSON.stringify(todoArray));
				todolist = localStorage.getItem(list);
				todolist = JSON.parse(todolist);
				showList(list);
			}
		}
	}
	else {
		todolist = JSON.parse(todolist);
	}
	
	return todolist;
}