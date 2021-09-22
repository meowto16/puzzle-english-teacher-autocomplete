import * as $ from 'jquery'

export class PuzzleEnglishPage {
  static $page = $('.teacher-second')
  static $content = $('.teacher-second-exercise')
  static $contentItems = PuzzleEnglishPage.$content.find('.teacher-second-one-test[data-url]')
  static $currentItem = PuzzleEnglishPage.defineCurrentItem()

  /**
   * Проверяет загружена ли на данный момент именно страница
   * упражнения метода Тичера
   */
  public static get isTeacherPageLoaded() {
    return PuzzleEnglishPage.$page.length
  }

  /**
   * Возвращает jQuery селектор текущего задания
   */
  public static defineCurrentItem(): JQuery | undefined {
    const $teacherContentCurrentItem = this.$contentItems.filter(function () {
      return $(this).css('display') !== 'none' && !$(this).hasClass('.finished')
    })

    if (!$teacherContentCurrentItem.length) return

    return $teacherContentCurrentItem.first() ?? null
  }

  /**
   * Устанавливает jQuery селектор текущего задания
   * @param currentItem
   */
  public static setCurrentItem(currentItem: JQuery) {
    PuzzleEnglishPage.$currentItem = currentItem
  }
}
