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
