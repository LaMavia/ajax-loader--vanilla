const loader = AsyncLoader({
	baseURL: location.origin,
	pages: ["about/about", "cats/cats"],
  prefix: "sections",
  output: document.getElementById('pages'),
	errorURL: "./error.html"
})
