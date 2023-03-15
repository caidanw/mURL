const shortUrlElem = document.getElementById("shortUrl");
shortUrlElem.innerText = `${location.href}r/...`;

function shorten() {
  // Get the input URL and custom short URL (if any)
  var longUrl = document.getElementById("urlInput").value;
  var customUrl = document.getElementById("customInput").value;

  // Make a POST request to the server to create a short URL
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "/api/shorten", true);
  xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhr.onreadystatechange = function () {
    if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
      // Update the UI with the shortened URL
      var shortUrl = JSON.parse(xhr.responseText).shortUrl;
      shortUrlElem.innerText = shortUrl;
    }
  };

  var payload = { longUrl: longUrl };
  if (customUrl) {
    payload.customUrl = customUrl;
  }
  xhr.send(JSON.stringify(payload));
}

function copy() {
  var text = shortUrlElem.innerText;
  navigator.clipboard.writeText(text);

  document.getElementById("copy").innerText = "Copied";
  setTimeout(() => (document.getElementById("copy").innerText = "Copy"), 5000);
}
