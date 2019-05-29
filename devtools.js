chrome.devtools.panels.elements.onSelectionChanged.addListener(function() {
	var js = 'if (typeof DOMAnalyzerData != \'undefined\' && DOMAnalyzerData.active == true) {' +
		 '  console.log(\'--------------------------- DOM-ANALYZER ---------------------------\');' +
		 '  console.log(\'+ Instructions: Unfold the object below and navigate through it (via \');' +
		 '  console.log(\'                its children) to find what you are looking for. The \');' +
		 '  console.log(\'                attribute "element" takes you to the concrete element \');' +
		 '  console.log(\'                of the DOM if you click or hover over it. Good luck!\');' +
		 '  console.log(\'+ Ordered by:   \' + DOMAnalyzerData.filter.toUpperCase() + DOMAnalyzerData.filterExp);' +
		 '  console.log(analyzeDOM(DOMAnalyzerData.filter, $0));' +
		 '  console.log(\'--------------------------------------------------------------------\');' +
		 '}'; 

	chrome.devtools.inspectedWindow.eval(js);
});

