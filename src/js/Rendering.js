export default class Rendering {
  constructor() {
    this.container = null;
    this.columns = [];
  }

  bindToDOM(container) {
    if (!(container instanceof HTMLElement)) throw new Error('Container is not HTMLElement');

    this.container = container;
  }

  checkBinding() {
    if (this.container === null) throw new Error('Board not bind to DOM');
  }

  draw() {
    this.checkBinding();

    const names = ['TODO', 'IN PROGRESS', 'DONE'];

    this.addColumn(this.container, names);
  }

  addColumn(elementParent, names) {
    for (let i = 0; i < names.length; i += 1) {
      const divColumn = document.createElement('div');
      divColumn.classList.add('column');
      divColumn.dataset.id = `${names[i]}`;
      elementParent.appendChild(divColumn);
      this.columns.push(divColumn);

      const title = document.createElement('span');
      title.classList.add('title');
      title.textContent = `${names[i]}`;
      divColumn.appendChild(title);

      const tasks = document.createElement('div');
      tasks.classList.add('tasks-container');
      divColumn.appendChild(tasks);

      const btn = document.createElement('a');
      btn.classList.add('button-new-task');
      btn.href = '#';
      btn.textContent = '+ Add another card';
      divColumn.appendChild(btn);
    }
  }
}
