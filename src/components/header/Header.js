import { ExcelComponent } from '@core/ExcelComponent'
import { changeTitle } from '@/redux/actions'
import { defaultTitle } from '@/constants'
import ActiveRoute from '@core/routes/ActiveRoute'
import { $ } from '@core/dom'

export class Header extends ExcelComponent {
	static className = 'excel__header'

	constructor($root, options) {
		super($root, { name: 'Header', listeners: ['input', 'click'], ...options })
	}

	toHTML() {
		const title = this.store.getState().title || defaultTitle

		return `
			<input class="input" type="text" value="${title}">
			
			<div>

				<div class="button" data-button="remove">
					<i class="material-icons" data-button="remove">delete</i>
				</div>

				<div class="button" data-button="exit">
					<i class="material-icons" data-button="exit">exit_to_app</i>
				</div>

			</div>

		`
	}

	onClick(event) {
		const $target = $(event.target)
		if ($target.data.button === 'remove') {
			const decision = confirm('Are you sure?')
			if (decision) {
				localStorage.removeItem('excel:' + ActiveRoute.param)
				ActiveRoute.navigate('#dashboard')
			}
		} else if ($target.data.button === 'exit') {
			ActiveRoute.navigate('#dashboard')
		}
	}

	onInput(event) {
		const $target = $(event.target)
		this.$dispatch(changeTitle($target.text()))
	}
}
