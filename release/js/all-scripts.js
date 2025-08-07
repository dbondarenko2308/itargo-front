$(document).ready(function () {
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

const duration = 1500
const intervalDelay = 15

function animateCounter($counter) {
	const original = $counter.data('number').toString().trim()
	const numberOnly = parseInt(original.replace(/\D/g, ''))
	const suffix = original.replace(/[0-9]/g, '')

	let count = 0
	const steps = Math.ceil(duration / intervalDelay)
	const increment = numberOnly / steps

	const interval = setInterval(function() {
		count += increment

		if (count >= numberOnly) {
			$counter.text(original)
			clearInterval(interval)
		} else {
			$counter.text(Math.floor(count) + suffix)
		}
	}, intervalDelay)
}

const observer = new IntersectionObserver(
	function(entries, observer) {
		entries.forEach(entry => {
			if (entry.isIntersecting) {
				const $el = $(entry.target)
				if (!$el.data('animated')) {
					$el.data('animated', true)
					animateCounter($el)
				}
				observer.unobserve(entry.target)
			}
		})
	},
	{
		threshold: 0.5
	}
)

$('.comp-main__number').each(function() {
	observer.observe(this)
})

var sliderThumbnail = new Swiper('.product__container', {
	slidesPerView: 3,
	watchSlidesVisibility: true,
	watchSlidesProgress: true,
	spaceBetween: 20,


  breakpoints: {
    991: {
      slidesPerView: 6
    }
  }
})

var slider = new Swiper('.product__top', {
	thumbs: {
		swiper: sliderThumbnail
	},

	pagination: {
		clickable: true,
		el: '.swiper-pagination'
	},

	navigation: {
		prevEl: '.swiper-button__prev',
		nextEl: '.swiper-button__next'
	}
})

var init1 = false
var swiper1
function swiperHow() {
	if (window.innerWidth < 992) {
		if (!init1) {
			init1 = true
			swiper1 = new Swiper('.detal-stat__slider', {
				slidesPerView: 1,
				spaceBetween: 20,
				loop: true,
				pagination: {
					clickable: true,
					el: '.swiper-pagination'
				}
			})
		}
	} else if (init1) {
		swiper1.destroy()
		init1 = false
	}
}

swiperHow()
window.addEventListener('resize', swiperHow)

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

const collectionS = new Swiper('.product-more__container', {
	slidesPerView: 1,
	spaceBetween: 20,
	pagination: {
		el: '.swiper-pagination',
		clickable: true
	},
	navigation: {
		nextEl: '.product-more__next.swiper-button__next',
		prevEl: '.product-more__prev.swiper-button__prev'
	},

	breakpoints: {
		540: {
			slidesPerView: 2
		},
		991: {
			slidesPerView: 4
		}
	}
})

//------------------- map contants -----------------------------

callMap('map', 16);
});