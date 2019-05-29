var chromeError = function(error) {
	alert(
		'You can\'t use the DOM-Analyzer in this web due to Chrome Security policies, please try somewhere else.\n\n' +
		'Message: ' + error.message
	);

	window.close();
};

var updateDataInTab = function(data) {
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		data.filterExp = data.filter == 'length'
			? ' (count of chars without spaces)'
			: data.filter == 'depth'
			? ' (max. depth tree)'
			: ' (count of nodes under branch)';

		var jsCode = '' +
			'var s = document.getElementById(\'DOMAnalyzerData\');' +
			'if (!s) {' +
			'	s = document.createElement("script");' +
			'	s.type = "text/javascript";' +
			'   s.id = \'DOMAnalyzerData\';' +
			'	s.innerHTML = "var DOMAnalyzerData = {active: ' + data.active + ', filter: \'' + data.filter + '\', filterExp: \'' + data.filterExp + '\'};";' +
			'	document.head.appendChild(s);' +
			'} else {' +
			'	s = document.createElement("script");' +
			'	s.type = "text/javascript";' +
			'	s.innerHTML = "DOMAnalyzerData = {active: ' + data.active + ', filter: \'' + data.filter + '\', filterExp: \'' + data.filterExp + '\'};";' +
			'	document.head.appendChild(s);' +
			'}';

		chrome.tabs.executeScript(tabs[0].id, {code: jsCode}, function() {
			if (chrome.runtime.lastError) {
				chromeError(chrome.runtime.lastError);
			}
		});
	});
};

chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
	var tabId = tabs[0].id;

	chrome.tabs.executeScript(tabs[0].id, {file: 'inject.js'}, function() {
		if (chrome.runtime.lastError) {
			chromeError(chrome.runtime.lastError);
		}
	});

	var DOMAnalyzerTabsData;
	var DOMAnalyzerData = {'active': false, 'filter': 'nodes'};

	chrome.storage.sync.get(['DOMAnalyzerTabsData'], function(result) {
		var updateData = function() {
			updateDataInTab(DOMAnalyzerData);
			result.DOMAnalyzerTabsData[tabId] = DOMAnalyzerData;
			chrome.storage.sync.set(
				{'DOMAnalyzerTabsData': result.DOMAnalyzerTabsData},
				function(){}
			);
		};

		if (!result.DOMAnalyzerTabsData) {
			result.DOMAnalyzerTabsData = {};
		}

		if (result.DOMAnalyzerTabsData[tabId]) {
			DOMAnalyzerData = result.DOMAnalyzerTabsData[tabId];
		}


		if (DOMAnalyzerData.active) {
			document.getElementById('activeBtn').classList.add('active');
			DOMAnalyzerData.active = true;
		}

		if (DOMAnalyzerData.filter) {
			document.getElementById(DOMAnalyzerData.filter).checked = true;
		}

		updateData();

		document.getElementById('activeBtn').onclick = function(e) {
			e.preventDefault();
			this.classList.toggle('active');

			DOMAnalyzerData.active = !DOMAnalyzerData.active;
			updateData();

			return false;
		};

		var radioBtns = document.getElementsByName('filter');
		for (var i = 0; i < radioBtns.length; i++) {
			radioBtns[i].onchange = function() {
				var radioBtn = this;
				DOMAnalyzerData.filter = radioBtn.value;
				updateData();
			};
		}
	});
});



