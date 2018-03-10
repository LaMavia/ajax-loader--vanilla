const AsyncLoader = ({
	baseURL = window.location.origin,
	pages = [],
	prefix,
	output,
	errorURL
}) => {
	const fetchHTML = async url => {
		let data
		await fetch(url)
			.then(d => d.text())
			.then(d => (data = d))
		return data
	}
	const _Loader = {
		baseURL: baseURL[baseURL.length - 1].match(/\//)
			? baseURL.substr(0, baseURL.length - 1)
			: baseURL,
		pages,
		prefix,
		output,
		errorURL,

		async load(page, replace = true) {
			let loadedPage, error
			await fetchHTML(`${this.baseURL}/${this.prefix}/${page}`)
				.then(data => (loadedPage = data))
				.catch(err => (error = err))

			if (error) { // Something went wrong -> printing error page

				try {
					await fetchHTML(this.errorURL).then(
						d => (this.output.innerHTML = d.text())
					)
				} catch (err) { // no error page
					throw new Error(err)
				}

			} else { // Everything is fine -> output
				if(replace) this.output.innerHTML = loadedPage
				return loadedPage
			}
		},

		async loadMultiple(...pages) {
			const loadedPages = []
			for(let page of pages) {
				await this.load(page, false).then(d => {
					console.log(d)
					return loadedPages.push(d)
				})
			}
			console.log(loadedPages)
			this.output.innerHTML = loadedPages.join(' ')
		}
	}
	
	const links = [...document.querySelectorAll('.async-link')]
	links.forEach(link => {
		link.addEventListener('click', (e) => {
			e.preventDefault()
			const page = e.currentTarget.href.replace(`${_Loader.baseURL}/`, '')
			const bHash = page.match(/\/(.*)\./)[1]
			location.hash = bHash
			_Loader.load(page)
		})
	})
	// links.map(page => page.setAttribute('onclick', `(function(e){e.preventDefault();})()`))
	window.addEventListener('DOMContentLoaded', e => {
		const hash = location.hash.substr(1, location.hash.length)
		const page = _Loader.pages.find(p => p.match(new RegExp(`${hash}/${hash}(\.html)?`)))
		page ? _Loader.load.call(_Loader, page) : null
	})
	return _Loader
}
