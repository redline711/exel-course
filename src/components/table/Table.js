import { ExcelComponent } from '@core/ExcelComponent'
import { $ } from '@/core/dom'
import { createTable } from '@/components/table/table.template'
import { resizeHandler } from '@/components/table/table.resize'
import {
	shouldResize,
	nextSelector,
	isCell,
	matrix
} from '@/components/table/table.functions'
import { TableSelection } from '@/components/table/TableSelection'

export class Table extends ExcelComponent {
	static className = 'excel__table'

	constructor($root, options) {
		super($root, {
			iname: 'Table',
			listeners: ['mousedown', 'keydown', 'input'],
			...options
		})
	}

	toHTML() {
		return createTable()
	}

	prepare() {
		this.selection = new TableSelection()
	}

	init() {
		super.init()

		this.selectCell(this.$root.find('[data-id="0:0"]'))

		this.$on('formula:done', () => {
			this.selection.current.focus()
		})

		this.$on('formula:input', text => {
			this.selection.current.text(text)
		})
	}

	selectCell($cell) {
		this.selection.select($cell)
		this.$emit('table:select', $cell)
	}

	onMousedown(event) {
		if (shouldResize(event)) {
			resizeHandler(this.$root, event)
		} else if (isCell(event)) {
			const $target = $(event.target)
			if (event.shiftKey) {
				const $cells = matrix($target, this.selection.current).map(id =>
					this.$root.find(`[data-id="${id}"]`)
				)

				this.selection.selectGroup($cells)
			} else {
				this.selection.select($target)
			}
		}
	}

	onKeydown(event) {
		const keys = [
			'Enter',
			'Tab',
			'ArrowLeft',
			'ArrowUp',
			'ArrowRight',
			'ArrowDown'
		]

		const { key } = event

		if (keys.includes(key) && !event.shiftKey) {
			event.preventDefault()
			const id = this.selection.current.id(true)

			this.selectCell(this.$root.find(nextSelector(key, id)))
		}
	}

	onInput(event) {
		this.$emit('table:input', $(event.target))
	}
}
