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
