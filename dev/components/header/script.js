$('.burger').on('click', function() {
	$(this).toggleClass('active')
	$('.header__content').toggleClass('active')
})

$('.dropdown>a').on('click', function() {
	$(this).addClass('active')

	$(this).next().addClass('active')

	return false
})

$('.menu__mobile--back').on('click', function() {
	$('.dropdown').removeClass('active')
	$('.menu__mobile').removeClass('active')
})

$('.header__loop svg').on('click', function() {
	$(this).prev().toggleClass('active')
})
