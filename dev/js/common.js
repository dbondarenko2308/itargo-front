$(document).ready(function() {
	$('.mask').each(function() {
		IMask(this, {
			mask: '000 00-00-00',
			lazy: true
		})
	})

	const $button = $('.down-up')
	const bottomOffset = 20

	$button.on('click', function() {
		$('html, body').animate({ scrollTop: 0 }, 600)
	})

	$(window).on('scroll resize', function() {
		const scrollTop = $(window).scrollTop()
		const windowHeight = $(window).height()
		const windowWidth = $(window).width()
		let footerTop

		if (windowWidth < 991) {
			footerTop = $('footer').offset().top - 210
		} else {
			footerTop = $('footer').offset().top - 220
		}

		const stopPoint = footerTop - windowHeight + bottomOffset + 300

		if (scrollTop > 200) {
			$button.addClass('show')
		} else {
			$button.removeClass('show')
		}

		if (scrollTop > stopPoint) {
			$button.addClass('active').css({
				top: footerTop + 190 + 'px',
				bottom: 'auto'
			})
		} else {
			$button.removeClass('active').css({
				top: 'auto',
				bottom: '55px'
			})
		}
	})

	$.fancybox.defaults.touch = false
	$.fancybox.defaults.closeExisting = true

	function initAnimations() {
		const animatedElems = $('[data-animate]')

		animatedElems.each(function() {
			const $elem = $(this)
			$elem.css('opacity', 0).addClass('animate__animated')
		})

		function animateVisibleElems() {
			animatedElems.each(function() {
				const $elem = $(this)
				if ($elem.hasClass('animate__done')) return

				const animation = $elem.data('animate')
				const offset = parseInt($elem.data('animate-offset')) || 0
				const delay = parseFloat($elem.data('animate-delay')) || 0
				const duration = parseFloat($elem.data('animate-duration')) || 0

				const elemTop = $elem.offset().top
				const scrollBottom = $(window).scrollTop() + $(window).height()

				if (scrollBottom > elemTop + offset) {
					setTimeout(function() {
						if (duration) {
							$elem.css('animation-duration', duration + 's')
						}
						$elem
							.css('opacity', 1)
							.addClass(animation)
							.addClass('animate__done')
					}, delay * 1000)
				}
			})
		}

		$(window).on('scroll', animateVisibleElems)
		animateVisibleElems()
	}

	setTimeout(function() {
		$('.loader').fadeOut(300, function() {
			$('.wrapper').fadeIn(0, function() {
				initAnimations()
			})
		})
	}, 2000)
})
