/**
 * Автодополнение для упражнений Puzzle-english.com в методе тичера
 * MVP для расширения Chrome
 * Пока на данный момент запускается через расширение "Custom Javascript for Websites 2"
 * 1. В будущем выпилить jQuery (пока нужен чтобы быстро протестировать идею)
 * 2. Сделать через chrome-extension
 * 3. Сделать панель управления для расширения
 * 4. Отрефакторить и привести в нормальный вид, сделать расширяемым и легко-изменяемым (если поменяется что-то в puzzle-english)
 * 5. Залить в Chrome Web Store
 */

$( `
  <style>
    .pz-teacher-loader { 
      position: fixed;
      bottom: 8%;
      right: 8%;
      width: 80px;
      height: 80px;
      border: 10px solid #54bb53;
      border-top-color: transparent;
      border-radius: 50%;
      background-color: transparent;
      animation: pz-rotate linear infinite 0.75s;
      z-index: 1000;
    }
    
    @keyframes pz-rotate {
      0% { transform: rotate(0deg) }
      100% { transform: rotate(360deg) }
    }
  </style>
`).appendTo( "head" )
$('body').append('<div class="pz-teacher-loader"></div>');

$(function () {
  const $teacherPage = $('.teacher-second')

  const $teacherContent = $('.teacher-second-exercise')
  const $teacherContentItems = $teacherContent.find('.teacher-second-one-test[data-url]')

  let $currentTeacherItem = null
  let CurrentTeacherHelper = null

  //** HELPERS **//

  class PuzzleEnglishHelper {
    init () {
      console.error('PuzzleEnglishHelper class error. You must initialize "init" method in your helper')
    }
    destroy () {
      console.error('PuzzleEnglishHelper class error. You must initialize "destroy" method in your helper')
    }
  }

  /**
   * Хелпер для упражнения "Соберите паззл"
   * Добавляет управление с клавиатуры
   */
  class PuzzlesTestHelper extends PuzzleEnglishHelper {
    keydownListener = this.onKeyDown.bind(this)

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
      this.$variants = $currentTeacherItem.find('.puzzles_source .puzzle-figure__wrapper[data-key]')
      this.$answerChars = $currentTeacherItem.find('.puzzle_task_puzzles .puzzle-figure__wrapper[data-key]')
      this.$answerFields = $currentTeacherItem.find('.puzzle_task_puzzles .puzzle-dashed')

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
      if (!$currentTeacherItem) return
      this.updateValues()

      window.addEventListener('keydown', this.keydownListener)
    }

    destroy() {
      window.removeEventListener('keydown', this.keydownListener)
    }
  }

  //** LOGIC **/

  const modidyJS = () => {
    // Adds new event 'locationchange'
    // https://stackoverflow.com/questions/6390341/how-to-detect-if-url-has-changed-after-hash-in-javascript
    history.pushState = ( f => function pushState(){
      const ret = f.apply(this, arguments);
      window.dispatchEvent(new Event('pushstate'));
      window.dispatchEvent(new Event('locationchange'));
      return ret;
    })(history.pushState);

    history.replaceState = ( f => function replaceState(){
      const ret = f.apply(this, arguments);
      window.dispatchEvent(new Event('replacestate'));
      window.dispatchEvent(new Event('locationchange'));
      return ret;
    })(history.replaceState);

    window.addEventListener('popstate',()=>{
      window.dispatchEvent(new Event('locationchange'))
    });

    // Adds .reverse() to jQuery
    jQuery.fn.reverse = function() {
      return this.pushStack(this.get().reverse(), arguments);
    };
  }

  const checkIfTeacherPageLoaded = () => {
    const isTeacherTestPage = $teacherPage.length

    if (!isTeacherTestPage) return
  }

  const defineAndChangeCurrentTeacherItem = () => {
    const $teacherContentCurrentItem = $teacherContentItems.filter(function () {
      return $(this).css('display') !== 'none' && !$(this).hasClass('.finished')
    })

    if (!$teacherContentCurrentItem.length) return

    const $newCurrentTeacherItem = $teacherContentCurrentItem.first() ?? null

    $(window).trigger('PZ_CHANGE_CURRENT_TEACHER_ITEM', { prev: $currentTeacherItem, current: $newCurrentTeacherItem })
    $currentTeacherItem = $newCurrentTeacherItem
  }

  const defineAndChangeCurrentHelper = () => {
    if (CurrentTeacherHelper) CurrentTeacherHelper.destroy()

    let NewTeacherHelper = null

    if ($currentTeacherItem.hasClass('puzzles_test')) {
      NewTeacherHelper = new PuzzlesTestHelper()
    }

    $(window).trigger('PZ_CHANGE_CURRENT_TEACHER_HELPER', { prev: CurrentTeacherHelper, current: NewTeacherHelper })
    CurrentTeacherHelper = NewTeacherHelper

    if (NewTeacherHelper) NewTeacherHelper.init()
  }

  const extensionLoaded = () => {
    $('.pz-teacher-loader').fadeOut(500, function () {
      $(this).remove()
    })
  }

  const watchChangeCurrentItem = () => {
    $(window).on('locationchange', () => {
      defineAndChangeCurrentTeacherItem()
      defineAndChangeCurrentHelper()
    })
  }

  const watchPressEnter = () => {
    window.addEventListener('keydown', (e) => {
      if (!$currentTeacherItem) return
      const $teacherContinueButton = $currentTeacherItem.find(".puzzle-button")
      if (e.code === 'Enter') $teacherContinueButton.trigger("click")
    })
  }



  const bootstrap = () => {
    checkIfTeacherPageLoaded()
    modidyJS()
    defineAndChangeCurrentTeacherItem()
    defineAndChangeCurrentHelper()
    extensionLoaded()

    watchChangeCurrentItem()
    watchPressEnter()
  }

  bootstrap()
})
