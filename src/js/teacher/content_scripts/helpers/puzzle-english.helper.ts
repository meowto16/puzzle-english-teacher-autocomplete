import PuzzlesTestHelper from './puzzles-test.helper'
import PuzzleEnglishBaseHelper from './puzzle-english-base.helper'
import SelectTextTestHelper from './Select-Text-Test.helper'

export type PuzzleEnglishHelperSelector = 'puzzles_test' | 'select_text_test'

class PuzzleEnglishHelper {
  public static currentHelper: PuzzleEnglishBaseHelper
  private static selectorToHelperMap: Record<PuzzleEnglishHelperSelector, typeof PuzzleEnglishBaseHelper> = {
    'puzzles_test': PuzzlesTestHelper,
    'select_text_test': SelectTextTestHelper,
  }

  static defineHelperClass($item: JQuery): PuzzleEnglishHelperSelector {
    if ($item.hasClass('puzzles_test')) return 'puzzles_test'
    if ($item.hasClass('select_text_test')) return 'select_text_test'
  }

  static defineCurrentHelper(selector: string) {
    const Helper = this.selectorToHelperMap[selector]

    if (!Helper) throw new Error(`Puzzle english error: helper with selector ${selector} not found!`)
    else return new Helper()
  }

  static setCurrentHelper(helper: PuzzleEnglishBaseHelper) {
    PuzzleEnglishHelper.currentHelper = helper
  }
}

export default PuzzleEnglishHelper
