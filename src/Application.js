import { date, elementStatus } from "./secondaryFunction";
import { userEmail } from "./auth";


class Application {
   constructor(param) {
      this.el = param.el
      const app = this
      document
         .querySelector('input')
         .addEventListener('keydown', function (event) {
            if (event.key !== 'Enter' || !this.value.trim()) {
               return
            }
            const id = Math.max(0, ...app.list.map(x => x.id)) + 1
            app.list.push({
               id: id,
               content: this.value.trim(),
               notCompleted: true,
               inDone: false,
               done: false,
               delete: false,
               deleteForewer: false,
               comments: 'Пока нет комментариев',
               date: date(),
               userEmail,
            })
            // app.list = app.list.sort((a, b) => b.id - a.id)// менять последовательность добавления
            this.value = ""
            app.update()
         })
      document
         .querySelector('.add__btn')
         .addEventListener('click', function (event) {
            if (!document.querySelector('input').value.trim()) return
            const id = Math.max(0, ...app.list.map(x => x.id)) + 1
            app.list.push({
               id: id,
               content: document.querySelector('input').value.trim(),
               notCompleted: true,
               inDone: false,
               done: false,
               delete: false,
               deleteForewer: false,
               comments: 'Пока нет комментариев',
               date: date(),
               userEmail,
            })
            // app.list = app.list.sort((a, b) => b.id - a.id)// менять последовательность добавления
            document.querySelector('input').value = ""
            app.update()
         })

      localStorage.getItem('__Todo_Application_') ? this.list = JSON.parse(localStorage.getItem('__Todo_Application_')) : this.list = [].filter(item => !item.deleteForewer)
      this.update()
   }

   //DragAndDrop
   dragendAnd() {
      const app = this
      let items = document.querySelectorAll('.item')
      const lists = document.querySelectorAll('.itemsList')

      items.forEach(dragItem => {
         dragItem.addEventListener('dragstart', handlerDragstart, false)
         dragItem.addEventListener('dragend', handlerDragend, false)
         dragItem.addEventListener('drag', handlerDrag, false)
      });

      lists.forEach(dragLists => {
         dragLists.addEventListener('dragenter', handlerdragEnter)
         dragLists.addEventListener('dragleave', handlerdragLeave)
         dragLists.addEventListener('dragover', handlerdragOver)
         dragLists.addEventListener('drop', handlerDrop)
      })

      let draggedItem = null
      let droppedList = null

      function handlerDragstart(event) {

         draggedItem = this
         this.classList.add('item__active')
      }

      function handlerDragend(event) {
         draggedItem = null
      }

      function handlerDrag(event) {

      }

      function handlerdragEnter(event) {
         event.preventDefault()
         droppedList = this
         if (this.classList.contains('delete__forewer')) {
            this.querySelector('i').classList.add('special')
         }
         this.classList.add('processBlock__active')
      }

      function handlerdragLeave(event) {
         if (this.classList.contains('delete__forewer')) {
            this.querySelector('i').classList.remove('special')
         }
         this.classList.remove('processBlock__active')
      }

      function handlerdragOver(event) {
         event.preventDefault()
      }

      function handlerDrop(event) {
         // this.querySelector('i').classList.remove('special')

         if (this.classList.contains('delete__forewer')) {
            this.classList.remove('special')
         }
         this.classList.remove('processBlock__active')

         if (droppedList.classList.contains('inDone') && draggedItem) {
            const changedListItem = app.list.filter(item => { return item.id == draggedItem.id })
            elementStatus(changedListItem[0])
            changedListItem[0].inDone = true
            this.classList.remove('processBlock__active')
            this.append(draggedItem)
            app.update()
         }
         if (droppedList.classList.contains('notCompleted') && draggedItem) {
            const changedListItem = app.list.filter(item => { return item.id == draggedItem.id })
            elementStatus(changedListItem[0])
            changedListItem[0].notCompleted = true
            this.classList.remove('processBlock__active')
            this.append(draggedItem)
            app.update()
         }
         if (droppedList.classList.contains('completed') && draggedItem) {
            const changedListItem = app.list.filter(item => { return item.id == draggedItem.id })
            elementStatus(changedListItem[0])
            changedListItem[0].done = true
            this.classList.remove('processBlock__active')
            this.append(draggedItem)
            app.update()
         }
         if (droppedList.classList.contains('deleted') && draggedItem) {
            const changedListItem = app.list.filter(item => { return item.id == draggedItem.id })
            elementStatus(changedListItem[0])
            changedListItem[0].delete = true
            this.classList.remove('processBlock__active')
            this.append(draggedItem)
            app.update()
         }
         if (droppedList.classList.contains('delete__forewer') && draggedItem) {
            const changedListItem = app.list.filter(item => { return item.id == draggedItem.id })
            elementStatus(changedListItem[0])
            changedListItem[0].deleteForewer = true
            app.list = app.list.filter(item => { return item.id != draggedItem.id })
            this.querySelector('i').classList.remove('special')
            app.update()
         }
      }
   }

   //метод отрисовки элементов
   update() {
      localStorage.setItem('__Todo_Application_', JSON.stringify(this.list))

      const $ulElementInDone = document.querySelector('.inDone')
      const $ulElementcompleted = document.querySelector('.completed')
      const $ulElementNotCompleted = document.querySelector('.notCompleted')
      // $ulElementInDone.style.border = '1px solid'
      const $ulElementDeleted = document.querySelector('.deleted')
      $ulElementNotCompleted.innerHTML = ''
      $ulElementInDone.innerHTML = ''
      $ulElementcompleted.innerHTML = ''
      $ulElementDeleted.innerHTML = ''

      const modalDelete = document.querySelector('.delete')
      const modalDeleteForewer = document.querySelector('.deleteForewer')

      for (let i = 0; i < this.list.length; i++) {
         const app = this
         const element = this.list[i]
         const liElement = this.getElement(element)
         if (this.list[i].notCompleted) {
            $ulElementNotCompleted.append(liElement)
            if (element.notCompleted) {
               const checkBtn = liElement.querySelector('.fa-check')
               const returnBtn = liElement.querySelector('.fa-undo')
               checkBtn.classList.add('display__none')
               returnBtn.classList.add('display__none')
            }
            liElement.addEventListener('click', function (event) {
               if (event.target.className === 'fas fa-play') {
                  if ($ulElementInDone.childNodes.length > 5) {
                     $ulElementInDone.style.border = '2px solid red'
                     alert('Не берите на выполнение больше 6 задач')
                     $ulElementInDone.removeChild(liElement)
                     $ulElementNotCompleted.append(liElement)
                  }
                  elementStatus(element)
                  element.inDone = true
                  app.update()
               }
               if (event.target.className === 'fas fa-trash') {
                  modalDelete.classList.remove('hystmodal__hidden')
                  modalDelete.addEventListener('click', function (event) {
                     if (event.target.className === 'btn__modal save') {
                        elementStatus(element)
                        element.delete = true
                        modalDelete.classList.add('hystmodal__hidden')
                        app.update()
                     }
                     if (event.target.className === 'btn__modal close' || event.target.className === 'hystmodal delete') {
                        modalDelete.classList.add('hystmodal__hidden')
                     }
                  })
               }
               if (event.target.className === 'fas fa-question-circle') {
                  event.target.closest('li').querySelector('.commentItem').classList.toggle('commentItem__open')
               }
               if (event.target.className === 'fas fa-comment-medical') {
                  liElement.querySelector('textarea').value = element.comments
                  liElement.querySelector('.textarea').classList.toggle('textarea__block')

                  liElement.querySelector('.textarea').addEventListener('mouseover', function (event) {
                     if (event.target.tagName === 'TEXTAREA') {
                        liElement.draggable = false
                     }
                  })

                  liElement.querySelector('.textarea').addEventListener('click', function (event) {
                     if (event.target.tagName === 'BUTTON') {
                        element.comments = liElement.querySelector('textarea').value
                        liElement.querySelector('.textarea').classList.add('textarea__block')
                        app.update()
                     }

                  })
               }
            })
         }

         if (this.list[i].inDone) {
            liElement.querySelector('.btn').style.display = 'none'
            $ulElementInDone.append(liElement)
            if (element.inDone) {
               const runBtn = liElement.querySelector('.fa-play')
               runBtn.classList.add('display__none')
               liElement.addEventListener('click', function (event) {
                  if (event.target.className === 'fas fa-undo') {
                     elementStatus(element)
                     element.notCompleted = true
                     app.update()
                  }
                  if (event.target.className === 'fas fa-check') {
                     elementStatus(element)
                     element.done = true
                     app.update()
                  }
                  if (event.target.className === 'fas fa-trash') {
                     modalDelete.classList.remove('hystmodal__hidden')
                     modalDelete.addEventListener('click', function (event) {
                        if (event.target.className === 'btn__modal save') {
                           elementStatus(element)
                           element.delete = true
                           modalDelete.classList.add('hystmodal__hidden')
                           app.update()
                        }
                        if (event.target.className === 'btn__modal close' || event.target.className === 'hystmodal delete') {
                           modalDelete.classList.add('hystmodal__hidden')
                        }
                     })
                  }
                  if (event.target.className === 'fas fa-question-circle') {
                     event.target.closest('li').querySelector('.commentItem').classList.toggle('commentItem__open')
                  }
               })
            }
         }

         if (this.list[i].done) {
            liElement.querySelector('.group__comments').style.display = 'none'
            $ulElementcompleted.append(liElement)
            if (element.done) {
               const checkBtn = liElement.querySelector('.fa-check')
               const runBtn = liElement.querySelector('.fa-play')
               checkBtn.classList.add('display__none')
               runBtn.classList.add('display__none')
               liElement.addEventListener('click', function (event) {
                  if (event.target.className === 'fas fa-undo') {
                     elementStatus(element)
                     element.notCompleted = true
                     app.update()
                  }
                  if (event.target.className === 'fas fa-check') {
                     elementStatus(element)
                     element.done = true
                     app.update()
                  }
                  if (event.target.className === 'fas fa-trash') {
                     modalDelete.classList.remove('hystmodal__hidden')
                     modalDelete.addEventListener('click', function (event) {
                        if (event.target.className === 'btn__modal save') {
                           elementStatus(element)
                           element.delete = true
                           modalDelete.classList.add('hystmodal__hidden')
                           app.update()
                        }
                        if (event.target.className === 'btn__modal close' || event.target.className !== 'hystmodal delete') {
                           modalDelete.classList.add('hystmodal__hidden')
                        }
                     })
                  }
               })
            }
         }
         if (this.list[i].delete) {
            liElement.querySelector('.group__comments').style.display = 'none'
            $ulElementDeleted.append(liElement)
            if (element.delete) {
               const checkBtn = liElement.querySelector('.fa-check')
               const runBtn = liElement.querySelector('.fa-play')
               checkBtn.classList.add('display__none')
               runBtn.classList.add('display__none')
               liElement.addEventListener('click', function (event) {
                  if (event.target.className === 'fas fa-undo') {
                     elementStatus(element)
                     element.notCompleted = true
                     app.update()
                  }
                  if (event.target.className === 'fas fa-trash') {
                     const target = event.target.parentElement.closest('li').id
                     modalDeleteForewer.classList.remove('hystmodal__hidden')
                     modalDeleteForewer.addEventListener('click', function (event) {
                        if (event.target.className === 'btn__modal save') {
                           app.list = app.list.filter(item => { return item.id != element.id })
                           modalDeleteForewer.classList.add('hystmodal__hidden')
                           app.update()
                        }
                        if (event.target.className === 'btn__modal close' || event.target.className === 'hystmodal deleteForewer') {
                           modalDeleteForewer.classList.add('hystmodal__hidden')
                        }
                     })
                  }
               })
            }
         }
      }
      document.querySelector('.counter__notCompleted').innerText = document.querySelector('.notCompleted').childNodes.length
      document.querySelector('.counter__inDone').innerText = document.querySelector('.inDone').childNodes.length
      document.querySelector('.counter__completed').innerText = document.querySelector('.completed').childNodes.length
      document.querySelector('.counter__deleted').innerText = document.querySelector('.deleted').childNodes.length
      this.dragendAnd()
   }
   getElement(item) {
      const ulElement = document.createElement('ul')
      ulElement.innerHTML = `
      <li draggable='true' class="item" id="${item.id}">
         <div class="li__row">
            <div class="text">${item.content}</div>
            <div class="btn__group">
               <i class="fas fa-play"></i>
               <i class="fas fa-undo"></i>
               <i class="fas fa-check"></i>
               <i class="fas fa-trash"></i>
            </div>
         </div>
         <div class="li__row">
            <div class='group__comments ' href="#">
               <button><i class="fas fa-question-circle"></i></button>
               <button class = 'btn'><i class="fas fa-comment-medical"></i></button>
               <ul class="comments">
                  <li class='textarea textarea__block'>
                     <textarea></textarea>
                     <button class='btn__save'>save</button>
                  </li>
               <li class='commentItem'>${item.comments}</li>
               </ul>
            </div>
         </div>
            <div class="li__row">
            <div class="user">${item.userEmail}</div>
            <div class="date">${item.date}</div>
         </div>
       </li> `
      return ulElement.firstElementChild
   }
}
export { Application }