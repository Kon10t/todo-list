class Todo {
  constructor({
    title = "Todo App",
    data = [],
    onAdded = () => {},
    onDeleted = () => {}
  } = {}) {
    this.nodes = {};
    this.isFull = true;
    this.data = data;
    this.handleLike = this.handleLike.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.addTask = this.addTask.bind(this);
    // Обычные настройки создаваемого элемента
    this.elementDefaults = {
      type: "div",
      markup: "",
      container: document.body,
      attributes: {},
      events: {}
    };
  }

  handleLike(e) {
    console.log('sdsd');
    this.isFull = !this.isFull;
    e.target.classList.toggle('like-icon');
    e.target.classList.toggle('like-icon-full');
    // if (e.target.classList.contains('like-icon')) {
    //   e.target.classList.remove('like-icon');
    //   e.target.classList.add('like-icon-full');
    // } else if (e.target.classList.contains('like-icon-full')) {
    //   e.target.classList.remove('like-icon-full');
    //   e.target.classList.add('like-icon');
    // }
  }

  handleDelete(e) {
    console.time();
    // const id = Number(e.target.getAttribute("data-id"));
    // const elemmm = document.querySelector(`[data-id="${id}"]`);
    // console.dir(id);
    // const newData = this.data.filter(task => task.id !== id);
    e.target.parentNode.remove(e.targets);
    console.timeEnd();
    // this.taskUI(newData);
    // this.data = newData;
  }

  addTask() {
    const id = new Date().getUTCMilliseconds() * Math.random();
    const inputValue = this.nodes.input.value.trim();
    const taskName = inputValue != "" && typeof(inputValue) === 'string' ? inputValue : false;
    const newTask = { id, taskName} 

    this.data.push(newTask);
    this.taskUI(newTask);
  }

  emptyTaskUI() {
    this.nodes.emptyTask = this.elementCreator({
      type: "div",
      text: "Not found a task",
      attributes: {
        class: "taskEmpty"
      },
      container: this.nodes.taskLists
    });
  }

  // Создаем элемент с надстройками
  elementCreator(options) {
    // Обхект с параметрами для дальнейшей сборки элемента, на основе этиъ параметров
    const config = { ...this.elementDefaults, ...options};
 
    // Создание элемента в соответствии с наименованием указанным в type
    const elementNode = document.createElement(config.type);

    // Получаем массив ключей
    Object.keys(config.attributes).forEach(a => {
      config.attributes[a] !== null && // Проводим проверку, существуют они или нет.
        elementNode.setAttribute(a, config.attributes[a]); // К ранее созданному элементу добавляем атрибуты.
    });

    elementNode.textContent = config.text;
    // Добавляем внутрь контейнера/родительский элемент наш чуть выше созданый элемент
    config.container.appendChild(elementNode);

    Object.keys(config.events).forEach(e => {
      console.log(e);
      this.eventBinder(
        elementNode,
        e,
        config.events[e].action
      );
    });

    return elementNode;
  }

  eventBinder(elementNode, event, action, api = false) {
    console.log(action);
    elementNode.addEventListener(event, e => {
      console.log(e.target);
      action(e);
    });
  }

  mainUI() {
    this.nodes.wrapper = this.elementCreator({
      type: "div",
      attributes: {
        class: "Absolute-Center is-Fixed"
      }
    });

    this.nodes.innerWrapper = this.elementCreator({
      type: "div",
      attributes: {
        class: "inner-wrapper"
      },
      container: this.nodes.wrapper
    });

    this.nodes.header = this.elementCreator({
      type: "header",
      attributes: {
        class: "header"
      },
      container: this.nodes.innerWrapper
    });

    this.nodes.taskLists = this.elementCreator({
      type: "div",
      attributes: {
        class: "taskLists"
      },
      container: this.nodes.innerWrapper
    });

    this.nodes.footer = this.elementCreator({
      type: "footer",
      attributes: {
        class: "footer"
      },
      container: this.nodes.innerWrapper
    })
  }

  inputUI() {
    this.nodes.input = this.elementCreator({
      type: "input",
      attributes: {
        class: "header-input",
        placeholder: "Add a new task...",
        name: "taskInput",
        maxlength: "50"
      },
      container: this.nodes.header
    });

    this.nodes.button = this.elementCreator({
      type: "button",
      text: "Add Task",
      attributes: {
        class: "header-btn-addTask"
      },
      container: this.nodes.header,
      events: {
        click: { action: this.addTask } 
      }
    })
  }

  filterUI() {

  }

  taskUI(data = newTask) {
    const fragment = document.createDocumentFragment();

    // if (data.length === 0) {
    //   this.emptyTaskUI();
    // }

      const task = this.elementCreator({
        type: "div",
        attributes: {
          class: "task",
          "data-id": data.id
        },
        container: this.nodes.taskLists
      });
  
      const taskInput = this.elementCreator({
        type: "input",
        attributes: {
          class: `task-status`,
          type: "checkbox",
        },
        container: task
      });

      const taskText = this.elementCreator({
        type: "label",
        attributes: {
          class: "task-name"
        },
        container: task
      })
  
      const buttonLike = this.elementCreator({
        type: "span",
        attributes: {
          class: "like-icon",
          type: "button"
        },
        container: task,
        events: {
          click: {action: this.handleLike}
        }
      });
  
      const buttonDel = this.elementCreator({
        type: "button",
        attributes: {
          class: "btn-delete",
          "data-id": data.id
        },
        container: task,
        events: {
          click: { action: this.handleDelete}
        }
      });

      fragment.appendChild(task);

    // Очищаем контейнер
    // this.nodes.taskLists.innerHTML = '';

    // Добавляем фрагмент в контейнер одной операцией
    this.nodes.taskLists.appendChild(fragment);
  }
  
}

const TodoApp = new Todo();

TodoApp.mainUI();
TodoApp.inputUI();
