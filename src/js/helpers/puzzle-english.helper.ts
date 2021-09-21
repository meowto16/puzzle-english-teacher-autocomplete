import PuzzlesTestHelper from './puzzles-test.helper'

export type PuzzleEnglishHelperSelector = 'puzzles_test'

class PuzzleEnglishHelper {
  public static currentHelper: PuzzleEnglishHelper
  private static selectorToHelperMap: Record<PuzzleEnglishHelperSelector, typeof PuzzleEnglishHelper> = {
    'puzzles_test': PuzzlesTestHelper
  }

  init () {
    console.error('PuzzleEnglishHelper class error. You must initialize "init" method in your helper')
  }
  destroy () {
    console.error('PuzzleEnglishHelper class error. You must initialize "destroy" method in your helper')
  }

  static defineHelperClass($item: JQuery): PuzzleEnglishHelperSelector {
    if ($item.hasClass('.puzzles_test')) return 'puzzles_test'
  }

  static defineCurrentHelper(selector: string) {
    const Helper = this.selectorToHelperMap[selector]

    if (!Helper) throw new Error(`Puzzle english error: helper with selector ${selector} not found!`)
    else return new Helper()
  }

  static setCurrentHelper(helper: PuzzleEnglishHelper) {
    PuzzleEnglishHelper.currentHelper = helper
  }
}

export default PuzzleEnglishHelper
