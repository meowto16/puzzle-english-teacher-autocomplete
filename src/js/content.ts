import * as $ from 'jquery'

import './extends/history'
import PuzzleEnglishCore from './puzzle-english.core'

$(function () {
  const core = new PuzzleEnglishCore()
  core.init()
})
