// динамическая дата
function date() {
   return moment().format(`MMMM-D.YYYY hh:mm:ss`)
}

//состояние элемента(в каком блоке будет находиться) Она вызывается в Application при отрисовках update
function elementStatus(element) {
   const elem = element
   elem.date = date()
   elem.notCompleted = false
   elem.inDone = false
   elem.done = false
   elem.delete = false
   elem.deleteForewer = false
   // app.update()
   return elem
}
export { date, elementStatus }