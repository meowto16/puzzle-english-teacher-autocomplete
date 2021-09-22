import { PuzzleEnglishPage } from './puzzle-english.page'
import PuzzleEnglishWatchers from './puzzle-english.watchers'
import PuzzleEnglishHelper from './helpers/puzzle-english.helper'

class PuzzleEnglishCore {
  private PuzzleEnglishPage = PuzzleEnglishPage
  private PuzzleEnglishWatchers = PuzzleEnglishWatchers
  private PuzzleEnglishHelper = PuzzleEnglishHelper

  /**
   * Инициализация расширения на странице
   */
  public init() {
    if (!this.PuzzleEnglishPage.isTeacherPageLoaded) return

    this.PuzzleEnglishWatchers.init()
  }
}

export default PuzzleEnglishCore
