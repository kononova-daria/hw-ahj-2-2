export default class Action {
  constructor(page, storage) {
    this.page = page;
    this.draggedEl = null;
    this.ghostEl = null;
    this.x = null;
    this.y = null;
    this.newPlace = null;
    this.storage = storage;
  }

  init() {
    if (this.storage.load()) {
      this.previouslySaved();
    }

    this.page.container.addEventListener('click', (event) => {
      this.newTask(event);
      this.close(event);
      this.add(event);
    });

    this.page.container.addEventListener('mouseover', (event) => {
      this.showClose(event);
    });

    this.page.container.addEventListener('mouseout', (event) => {
      this.hiddenClose(event);
    });

    this.page.container.addEventListener('mousedown', (event) => {
      this.grab(event);
    });

    this.page.container.addEventListener('mousemove', (event) => {
      this.moveTask(event);
    });

    this.page.container.addEventListener('mouseup', () => {
      this.putTask();
    });
  }

  // eslint-disable-next-line class-methods-use-this
  newTask(event) {
    event.preventDefault();
    if (event.target.classList.contains('button-new-task')) {
      const parent = event.target.parentElement;

      const divNewTask = document.createElement('div');
      divNewTask.classList.add('new-task');
      parent.appendChild(divNewTask);

      const textNewTask = document.createElement('textarea');
      textNewTask.classList.add('text-new-task');
      textNewTask.placeholder = 'Enter a text...';
      divNewTask.appendChild(textNewTask);

      const btnContainer = document.createElement('div');
      btnContainer.classList.add('btn-new-task');
      divNewTask.appendChild(btnContainer);

      const btnAdd = document.createElement('button');
      btnAdd.classList.add('btn-add');
      btnAdd.type = 'button';
      btnAdd.textContent = 'Add Card';
      btnContainer.appendChild(btnAdd);

      const btnClose = document.createElement('a');
      btnClose.classList.add('close');
      btnClose.href = '#';
      btnClose.textContent = '✖';
      btnContainer.appendChild(btnClose);

      event.target.classList.add('hidden');
    }
  }

  // eslint-disable-next-line class-methods-use-this
  close(event) {
    event.preventDefault();
    if (event.target.classList.contains('close')) {
      if (!event.target.parentElement.classList.contains('task')) {
        const container = event.target.closest('.new-task');
        const parent = container.parentElement;

        parent.querySelector('.button-new-task').classList.remove('hidden');
        container.remove();
      } else {
        event.target.parentElement.remove();
        this.storage.save(this.page.columns);
      }
    }
  }

  // eslint-disable-next-line class-methods-use-this
  add(event) {
    event.preventDefault();
    if (event.target.classList.contains('btn-add')) {
      const container = event.target.closest('.new-task');
      const parent = container.parentElement;
      const tasksList = parent.querySelector('.tasks-container');

      const divTask = document.createElement('div');
      divTask.classList.add('task');
      divTask.textContent = container.querySelector('.text-new-task').value;
      tasksList.appendChild(divTask);

      const removeTask = document.createElement('a');
      removeTask.classList.add('close', 'removeTask', 'hidden');
      removeTask.href = '#';
      removeTask.textContent = '✖';
      divTask.appendChild(removeTask);

      parent.querySelector('.button-new-task').classList.remove('hidden');
      container.remove();

      this.storage.save(this.page.columns);
    }
  }

  // eslint-disable-next-line class-methods-use-this
  showClose(event) {
    event.preventDefault();
    if (event.target.classList.contains('task')) {
      event.target.querySelector('.close').classList.remove('hidden');
    }
    if (event.target.classList.contains('close') && event.target.parentElement.classList.contains('task')) {
      event.target.classList.remove('hidden');
    }
  }

  // eslint-disable-next-line class-methods-use-this
  hiddenClose(event) {
    event.preventDefault();
    if (event.target.classList.contains('task')) {
      event.target.querySelector('.close').classList.add('hidden');
    }
  }

  grab(event) {
    if (event.target.classList.contains('task')) {
      this.draggedEl = event.target;

      this.ghostEl = event.target.cloneNode(true);
      this.ghostEl.classList.add('dragged');
      document.body.appendChild(this.ghostEl);

      document.querySelector('body').style.cursor = 'grabbing';

      this.ghostEl.style.left = `${this.draggedEl.getBoundingClientRect().x}px`;
      this.ghostEl.style.top = `${this.draggedEl.getBoundingClientRect().y - this.draggedEl.offsetHeight / 2}px`;

      this.x = event.pageX - parseInt(this.ghostEl.style.left, 10);
      this.y = event.pageY - parseInt(this.ghostEl.style.top, 10);

      const newPlace = document.createElement('div');
      newPlace.classList.add('new-place');
      newPlace.style.height = `${this.draggedEl.offsetHeight}px`;
      this.newPlace = newPlace;

      this.draggedEl.parentElement.insertBefore(this.newPlace, this.draggedEl);
      this.draggedEl.remove();
    }
  }

  moveTask(event) {
    if (this.draggedEl) {
      event.preventDefault();
      this.ghostEl.style.left = `${event.pageX - this.x}px`;
      this.ghostEl.style.top = `${event.pageY - this.y}px`;

      const closest = document.elementFromPoint(event.clientX, event.clientY);

      if (closest.classList.contains('task')) {
        closest.parentElement.insertBefore(this.newPlace, closest);
      }

      if (closest.classList.contains('tasks-container')) {
        const children = Array.from(closest.childNodes);
        if (!children.length
             || children[children.length - 1].getBoundingClientRect().y < event.pageY) {
          closest.append(this.newPlace);
        } else {
          for (let i = 0; i < children.length; i += 1) {
            if (children[i].getBoundingClientRect().y > event.pageY) {
              closest.insertBefore(this.newPlace, children[i]);
              break;
            }
          }
        }
      }
    }
  }

  putTask() {
    if (this.draggedEl) {
      document.querySelector('body').style.cursor = 'default';

      this.newPlace.parentElement.insertBefore(this.draggedEl, this.newPlace);

      document.body.removeChild(this.ghostEl);
      this.ghostEl = null;

      this.draggedEl.classList.remove('task-move');
      this.draggedEl = null;

      this.newPlace.parentElement.removeChild(this.newPlace);
      this.newPlace = null;

      this.storage.save(this.page.columns);
    }
  }

  previouslySaved() {
    const data = this.storage.load();

    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        const column = document.querySelector(`[data-id="${key}"]`);
        const tasksList = column.querySelector('.tasks-container');

        for (let i = 0; i < data[key].length; i += 1) {
          const divTask = document.createElement('div');
          divTask.classList.add('task');
          divTask.textContent = data[key][i];
          tasksList.appendChild(divTask);

          const removeTask = document.createElement('a');
          removeTask.classList.add('close', 'removeTask', 'hidden');
          removeTask.href = '#';
          removeTask.textContent = '✖';
          divTask.appendChild(removeTask);
        }
      }
    }
  }
}
