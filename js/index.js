const loader = AsyncLoader({
	baseURL: "http://localhost:8080/",
	pages: ["about/about", "cats/cats"],
  prefix: "sections",
  output: document.getElementById('pages'),
	errorURL: "./error.html"
})
