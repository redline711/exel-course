import { $ } from '@core/dom'

export default function Loader() {
	return $.create('div', 'loader').html(`
		<div class="lds-heart">
			<div></div>
		</div>
	`)
}
