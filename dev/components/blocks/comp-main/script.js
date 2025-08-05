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
