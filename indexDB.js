const DBname = 'theDB';
var dsiDB;
const version = 23292;

initDB('dsi');

function initDB(relation){
    const request = window.indexedDB.open(DBname, version);
		// request: IDBOpenDBRequest

	request.onerror = function(event) {
		alert('Error loading database: ' + request.error.message);
	}; // onerror

	request.onsuccess = function(event) {
		console.log('Success loading database.');
		dsiDB = event.target.result;
		dsiDB.onerror = function(event) {
			alert('error: ' + event.target.error.message);
		};
	};

	request.onupgradeneeded = function(event) {
		console.log('Creating database.');
		dsiDB = this.result;
		dsiDB.onerror = function(event) {
			alert('error: ' + event.target.error.message);
		};
		const table = dsiDB.createObjectStore(relation, {keyPath: "key"});
		// the "dsiDB" table
		table.createIndex("username", "username", { unique: true });
		table.createIndex("password", "password", { unique: false });

	}; // onupgradeneeded
	return('initialized');
}

function addItem(relation, item) {
	const table = dsiDB.transaction([relation], "readwrite").objectStore(relation);
	const request = table.add(item);
	request.onsuccess = function() {
		console.log('successfully added item');
	};
	request.onerror = function(e){
		console.log('ERROR ADDING ITEM: ' + e.target.error.message);
	};
};

function addAllItems(relation, allEntries) { 
	allEntries.forEach(function(elt) {
		addItem(relation, elt);
	});
};

function clearDB(relation) {
	const transaction = dsiDB.transaction( [relation], "readwrite");
	const table = transaction.objectStore(relation);
	const request = table.clear();
	request.onsuccess = function (){
		console.log("table " + relation + " cleared.");
	};
	displayTable(relation);
};

function displayRow(item) { // entry should be a JSON object
	let answer = JSON.stringify(item,null, ' ');
    if(answer.length != 0){
        $("#error").html("That username is taken! Try Again!");
    }
	//$("#result").html($("#result").html() + '<br>' + answer);
}; // displayRow

function displayTable(relation) {
	const table = dsiDB.transaction( [relation], "readonly").objectStore(relation);
	//$("#fullMenu").html('');
	table.openCursor().onsuccess = function(event) {
		const cursor = event.target.result;
		if (cursor) {
			displayRow(cursor.value);
			cursor.continue();
		} else {
			console.log('end of table ' + relation);
		}
	};
};

function checkExistence(relation, column, item){
    const result = getRows(relation, column, item);
};

function verifyLogin(relation, column, item){
    const result = getRow(relation, column, item);
    location.href = 'upload.html';
}

// for retrieving only one row
function getRow(relation, column, columnValue) {
	//$("#fullMenu").html('');
	const transaction = dsiDB.transaction([relation], "readonly");
	const table = transaction.objectStore(relation);
	let index;
	try {
		index = table.index(column);
	} catch (error) {
		alert('failed to get index for ' + column);
		return;
	}
	index.get(columnValue).onsuccess = function(event) {
		displayRow(event.target.result || ['no result']);
		console.log("success");
	};
};

// retrieves multiple rows
function getRows(relation, column, columnValue) {
	//$("#fullMenu").html(''); // clear
	const transaction = dsiDB.transaction([relation], "readonly");
	const table = transaction.objectStore(relation);
	let index;
	try {
		index = table.index(column);
	} catch (error) {
		alert('failed to get index for ' + column);
		return;
	}
	const range = IDBKeyRange.only(columnValue);
	const answer = [];
	index.openCursor(range).onsuccess = function(event) {
		var cursor = event.target.result;
		if (cursor) {
			if (cursor.value[column] == columnValue) {
				displayRow(cursor.value);
				answer.push(cursor.value);
			}
			cursor.continue(); // re-invokes onsuccess
		} // cursor is not null
	}; // onsuccess
	console.log('end of results');
	return answer;
}; // getRows

// users accounts that are already made
const accounts = [
    {key: 0, username: 'curt', password: '123'},
    {key: 1, username: 'tonia', password: '123'},
    {key: 2, username: 'makenzey', password: 'abc'}
];