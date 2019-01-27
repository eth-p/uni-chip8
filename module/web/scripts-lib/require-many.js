// Multiple data-mains for require.js.
// Copyright (C) 2019 Ethan Pini
(function () {
	function errorfn() {
		alert("Failed to load scripts.\nPlease use a different browser.");
	}

	// Find scripts.
	let scripttags = document.getElementsByTagName("SCRIPT");
	let scripts = [];
	for (let i = 0; i < scripttags.length; i++) {
		let script = scripttags[i];
		if (script.getAttribute('data-many') != null) {
			scripts.push(script.getAttribute('data-main'));
		}
	}

	// Load scripts.
	window.onerror = errorfn;
	requirejs(scripts, function() {
		if (window.onerror === errorfn) {
			window.onerror = null;
		}
	});
})();
