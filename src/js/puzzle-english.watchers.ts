import * as $ from 'jquery'
import { PuzzleEnglishPage } from './puzzle-english.page'
import PuzzleEnglishHelper from './helpers/puzzle-english.helper'
import PuzzlesTestHelper from './helpers/puzzles-test.helper'

class PuzzleEnglishWatchers {
  static watchChangeCurrentItem() {
    // Additional method from: src/js/extends/history.ts
    $(window).on('locationchange', () => {
      const currentItem = PuzzleEnglishPage.defineCurrentItem()
      PuzzleEnglishPage.setCurrentItem(currentItem)

      const helperClass = PuzzleEnglishHelper.defineHelperClass(PuzzleEnglishPage.$currentItem)
      const helper = PuzzleEnglishHelper.defineCurrentHelper(helperClass)
      PuzzlesTestHelper.setCurrentHelper(helper)
    })
  }

  static watchPressEnter() {
    window.addEventListener('keydown', (e) => {
      if (!PuzzleEnglishPage.$currentItem) return
      const $teacherContinueButton = PuzzleEnglishPage.$currentItem.find(".puzzle-button")
      if (e.code === 'Enter') $teacherContinueButton.trigger("click")
    })
  }

  static init() {
    this.watchChangeCurrentItem()
    this.watchPressEnter()
  }
}

export default PuzzleEnglishWatchers
