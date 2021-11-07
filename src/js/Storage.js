export default class Storage {
  constructor(storage) {
    this.storage = storage;
  }

  save(columns) {
    for (let i = 0; i < columns.length; i += 1) {
      const tasks = Array.from(columns[i].querySelector('.tasks-container').childNodes);
      const textTasks = tasks.map((item) => item.textContent.slice(0, item.textContent.length - 1));
      this.storage.setItem(`${columns[i].dataset.id}`, JSON.stringify(textTasks));
    }
  }

  load() {
    const data = {};
    for (let i = 0; i < this.storage.length; i += 1) {
      const column = localStorage.key(i);
      data[column] = JSON.parse(this.storage.getItem(`${column}`));
    }
    return data;
  }
}
