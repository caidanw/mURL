function shorten() {
	// Get the input URL and custom short URL (if any)
	var longUrl = document.getElementById("urlInput").value;
	var customUrl = document.getElementById("customInput").value;

	// Make a POST request to the server to create a short URL
	var xhr = new XMLHttpRequest();
	xhr.open("POST", "/api/shorten", true);
	xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
	xhr.onreadystatechange = function() {
		if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
			// Update the UI with the shortened URL
			var shortUrl = JSON.parse(xhr.responseText).shortUrl;
			document.getElementById("shortUrl").value = shortUrl;
		}
	};
	var payload = {longUrl: longUrl};
	if (customUrl) {
		payload.customUrl = customUrl;
	}
	xhr.send(JSON.stringify(payload));
}
