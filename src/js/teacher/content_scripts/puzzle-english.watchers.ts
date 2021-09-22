import * as $ from 'jquery'
import { PuzzleEnglishPage } from './puzzle-english.page'
import PuzzleEnglishHelper from './helpers/puzzle-english.helper'

class PuzzleEnglishWatchers {
  static handleLocationChange() {
    const currentItem = PuzzleEnglishPage.defineCurrentItem()
    PuzzleEnglishPage.setCurrentItem(currentItem)

    if (PuzzleEnglishHelper.currentHelper) PuzzleEnglishHelper.currentHelper.destroy()

    const helperClass = PuzzleEnglishHelper.defineHelperClass(PuzzleEnglishPage.$currentItem)
    const helper = PuzzleEnglishHelper.defineCurrentHelper(helperClass)
    PuzzleEnglishHelper.setCurrentHelper(helper)

    PuzzleEnglishHelper.currentHelper?.init()
  }

  static watch() {
    chrome.runtime.onMessage.addListener(({ action }) => {
      switch (action) {
        case 'locationchange':
          PuzzleEnglishWatchers.handleLocationChange()
          break;
      }
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
    this.watch()
    this.watchPressEnter()

    this.handleLocationChange()
  }
}

export default PuzzleEnglishWatchers
