const navLinks = $('.product-card__top--item')
const offsetGap = 110

navLinks.on('click', function(e) {
	e.preventDefault()

	const targetId = $(this).attr('href')
	const targetOffset = $(targetId).offset().top - 120

	$('html, body').animate({ scrollTop: targetOffset - offsetGap }, 500)

	navLinks.removeClass('active')
	$(this).addClass('active')

	history.pushState(null, null, targetId)
})

const currentHash = window.location.hash
if (currentHash) {
	const currentTab = navLinks.filter('[href="' + currentHash + '"]')
	if (currentTab.length) {
		navLinks.removeClass('active')
		currentTab.addClass('active')

		setTimeout(() => {
			const targetOffset = $(currentHash).offset().top
			$('html, body').scrollTop(targetOffset - offsetGap)
		}, 100)
	}
}
