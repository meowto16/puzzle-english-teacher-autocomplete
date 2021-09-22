import * as $ from "jquery";
import { PuzzleEnglishPage } from "../puzzle-english.page";
import PuzzleEnglishBaseHelper from './puzzle-english-base.helper'

/**
 * Хелпер для упражнения "Соберите паззл"
 * Добавляет управление с клавиатуры
 */

class PuzzlesTestHelper extends PuzzleEnglishBaseHelper {
  keydownListener = this.onKeyDown.bind(this)
  $variants: JQuery<HTMLElement> = $([])
  $answerChars: JQuery<HTMLElement> = $([])
  $answerFields: JQuery<HTMLElement> = $([])

  insertAnswer(char) {
    const $possibleVariants = this.$variants.filter(function () {
      return $(this).data('key').toLowerCase() === char.toLowerCase()
    })

    const $foundVariant = $possibleVariants.first()

    if ($foundVariant) {
      $foundVariant.trigger("click")
      this.updateValues()
    }

    return this
  }

  clearAnswer() {
    this.$answerChars.reverse().each(function () {
      $(this).trigger("click")
    })
    this.updateValues()
    this.$answerFields.first().trigger("click")
    this.updateValues()

    return this
  }

  updateValues() {
    this.$variants = PuzzleEnglishPage.$currentItem.find('.puzzles_source .puzzle-figure__wrapper[data-key]')
    this.$answerChars = PuzzleEnglishPage.$currentItem.find('.puzzle_task_puzzles .puzzle-figure__wrapper[data-key]')
    this.$answerFields = PuzzleEnglishPage.$currentItem.find('.puzzle_task_puzzles .puzzle-dashed')

    return this
  }

  onKeyDown(e) {
    if (e.code === 'Backspace') {
      this.clearAnswer()
      return this
    }

    const char = String.fromCharCode(e.keyCode)
    this.insertAnswer(char)

    return this
  }

  init() {
    if (!PuzzleEnglishPage.$currentItem?.length) return
    this.updateValues()

    window.addEventListener('keydown', this.keydownListener)
  }

  destroy() {
    window.removeEventListener('keydown', this.keydownListener)
  }
}

export default PuzzlesTestHelper
