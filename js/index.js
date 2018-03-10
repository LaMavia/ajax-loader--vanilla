const loader = AsyncLoader({
	baseURL: location.origin + location.pathname,
	pages: [
		{
			href: "about/about",
			cache: null
		},
		{
			href: "cats/cats",
			cache: null
		}
	],
	prefix: "sections",
	output: document.getElementById("pages"),
	errorURL: "./error.html"
})
