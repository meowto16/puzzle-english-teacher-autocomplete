import * as $ from 'jquery'

import PuzzleEnglishBaseHelper from './puzzle-english-base.helper'
import { PuzzleEnglishPage } from '../puzzle-english.page'

class SelectTextTestHelper extends PuzzleEnglishBaseHelper {
  keyDownListener = this.handleKeyDown.bind(this)
  answer: string
  isAnswerChoosing: boolean
  $variants: JQuery

  init() {
    this.isAnswerChoosing = false
    this.resetVariants()
    this.resetAnswer()
    window.addEventListener('keydown', this.keyDownListener)
  }

  destroy() {
    window.removeEventListener('keydown', this.keyDownListener)
  }

  private handleKeyDown(e) {
    if (this.isAnswerChoosing) return

    if (e.code === 'Backspace') {
      return this.resetAnswer()
    }

    if (e.code === 'Space') {
      e.preventDefault()
    }

    if (e.code === 'Enter') {
      return this.chooseShortestAnswer()
    }

    const char = String.fromCharCode(e.keyCode)
    this.answer += `${char.toLowerCase()}`

    this.checkAnswer()
    this.renderAnswer()
  }

  private checkAnswer() {
    const $filteredVariants = this.filterVariants()

    if ($filteredVariants.length === 0) this.resetAnswer()
    if ($filteredVariants.length === 1) this.chooseAnswer($filteredVariants.first())
  }

  private renderAnswer() {
    // PuzzleEnglishPage.$currentItem.remo
    // PuzzleEnglishPage.$currentItem.append()
  }

  private chooseAnswer($element: JQuery) {
    const t = this
    t.isAnswerChoosing = true

    $element.addClass('zoom-in').delay(300).queue(
      function() {
        t.removeHighlightVariants()
        $(this).removeClass('zoom-in').dequeue().trigger('click')
        t.isAnswerChoosing = false
        t.resetVariants()
        t.resetAnswer()
      }
    )
  }

  private chooseShortestAnswer() {
    const $filteredVariants = this.filterVariants()
    if ($filteredVariants.length >= 2) {
      const keys = $filteredVariants.toArray().map((el) => el.dataset.key)
      const [shortestKey] = keys.sort((a, b) => a.length - b.length)

      const $answerElement = $filteredVariants
        .filter(function () {
          return $(this).data('key') === shortestKey
        })
        .first()
      return this.chooseAnswer($answerElement)
    }

    return
  }

  private filterVariants(): JQuery {
    const answer = this.answer
    this.$variants.removeClass('pz-puzzle--active')
    const $filteredVariants = this.$variants.filter(function () {
      if (answer === '') return false
      if (answer === ' ') return $(this).data('key') === ''
      return $(this).data('key').startsWith(answer)
    })

    $filteredVariants.addClass('pz-puzzle--active')

    this.highlightVariants($filteredVariants)

    return $filteredVariants
  }

  private highlightVariants($variants) {
    const answer = this.answer

    $variants.each(function () {
      const $text = $(this).find('.puzzle-text').first()
      const tail = $(this).data('key').slice(answer.length)
      $text.html(`<b>${answer}</b>${tail}`)
    })
  }

  private removeHighlightVariants() {
    this.$variants.each(function () {
      const $text = $(this).find('.puzzle-text').first()
      const key = $(this).data('key')
      $text.html(key === '' ? '&nbsp;' : key)
    })
  }

  private resetVariants() {
    const $currentSource = PuzzleEnglishPage.$currentItem
      .find('.puzzles_source')
      .filter(function () {
        return $(this).css('display') !== 'none'
      })
      .first()

    this.$variants = $currentSource.find('[data-key]')
    this.$variants.removeClass('pz-puzzle--active')
  }

  private resetAnswer() {
    this.answer = ''
    this.filterVariants()
  }
}

export default SelectTextTestHelper
