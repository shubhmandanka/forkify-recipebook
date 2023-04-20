import icons from 'url:../../img/icons.svg';


export default class View {
    _data;

    /**
     * render the recieved object to DOM
     * @param {Object | Object[]} data  to be rendered
     * @param {boolean} [render = true] if false  create markup 
     * @returns  {undefined | string} string is returned if false
     * @this { Object} view instance
     * @author Shubham
     * @todo finish implementation
     */
    render(data, render = true) {
        if (!data || (Array.isArray(data) && data.length === 0)) return this.renderError();
        this._data = data;
        const markUp = this._generateMarkup();

        if(!render) return markUp

        this._clear();
        this._parentElement.insertAdjacentHTML('afterbegin', markUp)
    }

  update(data) {
    this._data = data;
    const newMarkUp = this._generateMarkup();

    const newDOM = document.createRange().createContextualFragment(newMarkUp);
    const newElements = Array.from( newDOM.querySelectorAll('*'));
    const curElements = Array.from(this._parentElement.querySelectorAll('*'))

    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];
      
      //change text
      if(!newEl.isEqualNode(curEl) && newEl.firstChild?.nodeValue.trim() !==''){
        curEl.textContent = newEl.textContent;
      };

      //change attributes
      if(!newEl.isEqualNode(curEl)){
        Array.from(newEl.attributes).forEach(att => curEl.setAttribute(att.name, att.value))
      }

    });
  }

    _clear() {
        this._parentElement.innerHTML = '';
    }

    renderSpinner() {
        const markUp = `
              <div class="spinner">
              <svg>
                <use href="${icons}#icon-loader"></use>
              </svg>
            </div>
          `;

        this._clear();
        this._parentElement.insertAdjacentHTML('afterbegin', markUp)
    }

    renderError(message = this._errorMessage) {
        const markUp = `
          <div class="error">
          <div>
            <svg>
              <use href="${icons}#icon-alert-triangle"></use>
            </svg>
          </div>
          <p>${message}</p>
        </div>
      `
        this._clear();
        this._parentElement.insertAdjacentHTML('afterbegin', markUp);
    }

    renderMessage(message = this._message) {
        const markUp = `
          <div class="message">
          <div>
            <svg>
              <use href="${icons}#icon-smile"></use>
            </svg>
          </div>
          <p>${message}</p>
        </div>
      `
        this._clear();
        this._parentElement.insertAdjacentHTML('afterbegin', markUp);
    }

}