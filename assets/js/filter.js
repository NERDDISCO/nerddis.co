const filters = document.querySelectorAll('.filter-option')

const setQueryParameter = (params) => {
  const { type } = params;
  const url = new URL(window.location);
  url.searchParams.set('filter', type);
  window.history.pushState({}, '', url);
}

const changeActiveFilter = (params) => {
  let { type } = params
  let matchesToHide;
  let matchesToShow;

  // Block away wrong requests
  if (type === null) {
    type = 'all'
  }

  // Show all
  if (type === 'all') {
    matchesToShow = document.querySelectorAll(`.show[data-type]:not([data-type="all"])`)
  } else {
    matchesToHide = document.querySelectorAll(`.show[data-type]:not([data-type="${type}"])`)
    matchesToShow = document.querySelectorAll(`.show[data-type="${type}"]`)

    matchesToHide.forEach(match => {
      match.classList.add('hidden')
    })
  }

  // Valid for all types
  matchesToShow.forEach(match => {
    match.classList.remove('hidden')
  })

  // Highlight the current filter
  filters.forEach((filter) => {
    const _type = filter.dataset.type

    if (type === _type) {
      filter.classList.add('active')
    } else {
      filter.classList.remove('active')
    }
  })
}

const loadFromUrl = (params) => {
  const url = new URL(window.location);
  const type = url.searchParams.get('filter')

  changeActiveFilter({ type })
}

// When the page is loaded, set the correct filter
loadFromUrl()

// Overwrite the behavior of the filter links
filters.forEach((filter) => {
  const type = filter.dataset.type

  filter.addEventListener("click", (e) => {
    e.preventDefault()
    changeActiveFilter({ type })
    setQueryParameter({ type })
  })
})