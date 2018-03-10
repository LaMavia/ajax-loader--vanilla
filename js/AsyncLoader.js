// @ts-check
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
		errorCache: null,

		async load(page, replace = true) {
			let loadedPage, error
			const pageObj = _Loader.pages.filter(p => {
				const regexp = new RegExp(p.href)
				const res = regexp.test(page)
				return res
			} )[0]
			if(pageObj) {
				if(!pageObj.cache && pageObj) {
					await fetchHTML(`${this.baseURL}/${this.prefix}/${page}`)
					.then(data => (loadedPage = data))
					.catch(err => (error = err))
					pageObj.cache = loadedPage
				} else {
					loadedPage = pageObj.cache
				}
			} else {
				error = "No such site"
			}

			if (error) { // Something went wrong -> printing error page
				if(this.errorCache) {
					this.output.innerHTML = this.errorCache
				} else {
					try {
						await fetchHTML(this.errorURL)
						.then(
							d => {
								this.errorCache = d
								this.output.innerHTML = d
							}
						)
						.catch(err => err)
					} catch (err) { // no error page
						alert(`${err}\n${error}`)
						throw new Error(err)
					}
				}
			} 
			else { // Everything is fine -> output
				if(replace) this.output.innerHTML = loadedPage
				return loadedPage
			}
		},

		async loadMultiple(...pages) {
			const loadedPages = []
			for(let page of pages) {
				if(!page.cache) {
					await this.load(page.href, false).then(d => {
						page.cache = d
						return loadedPages.push(d)
					})
				} else {
					loadedPages.push(page.cache)
				}
			}
			// console.log(loadedPages)
			this.output.innerHTML = loadedPages.join(' ')
		},

		clearCache() {
			this.pages.forEach(page => page.cache = null)
		},

		async fetchHTML(url) {
			return await fetchHTML(url)
		} 
	};
	
	[...document.querySelectorAll('.async-link')].forEach(link => {
		link.addEventListener('click', (e) => {
			e.preventDefault()
			const page = e.currentTarget.href.replace(`${_Loader.baseURL}/`, '')
			const bHash = page.match(/\/(.*)\./) ? page.match(/\/(.*)\./)[1] : ""
			location.hash = bHash
			_Loader.load(page)
		})
	});

	[...document.querySelectorAll('.async-link--all')].forEach(link => {
		link.addEventListener('click', e => {
			e.preventDefault()
			location.hash = ""
			_Loader.loadMultiple(..._Loader.pages)
		})
	});

	[...document.querySelectorAll('.async-clear')].forEach(btn => {
		btn.addEventListener('click', e => {
			e.preventDefault()
			_Loader.clearCache()
		})
	})
	// links.map(page => page.setAttribute('onclick', `(function(e){e.preventDefault();})()`))
	window.addEventListener('DOMContentLoaded', e => {
		const hash = location.hash.substr(1, location.hash.length)
		const page = _Loader.pages.find(p => p.href.match(new RegExp(`${hash}/${hash}(\.html)?`)))
		page ? _Loader.load.call(_Loader, page.href) : null
	})
	return _Loader
}
