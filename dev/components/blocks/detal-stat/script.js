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
