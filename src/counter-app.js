import { LitElement, html, css } from "lit";

export class CounterApp extends LitElement {
  static get tag() {
    return "counter-app";
  }

  constructor() {
    super();
    this.counter = 0;
    this.max = 5;
    this.min = -5;
  }

  static get styles() {
    return css`
      :host {
        --text-color: #feffff;
        color: var(--text-color);
        background: linear-gradient(#000551, #0172fc);
        margin: 8px;
        font-family: "Roboto", sans-serif;
        text-align: center;
        border-radius: 16px;
        display: inline-flex;
        transition: all 250ms 50ms ease-in-out;
        /*
        to mess around with later because text gradient looks so cool
        
        background: linear-gradient( red, blue);
        background-clip: text;
        -webkit-text-fill-color: transparent;
        -webkit-background-clip: text;

        */
      }

      /* Checks if the value of counter is 18, and changes the text and background color.*/
      :host([counter="18"]) {
        color: #ffe301;
        background: linear-gradient(#670097, #ffe301);
      }

      /* Checks if the value of counter is 21, and changes the text and background color.*/
      :host([counter="21"]) {
        color: #f4ac3b;
        background: linear-gradient(#000000, #0172fc);
      }

      .card {
        width: 240px;
        padding: 24px;
      }

      .counter {
        font-family: "Urbanist", sans-serif;
        font-size: 92px;
        padding-top: 16px;
      }

      .plus-button,
      .minus-button {
        background-color: rgba(0, 0, 0, 0.01);
        color: var(--text-color);
        width: 50px;
        height: 50px;
        border-radius: 50%;
        border-color: #5f86ca;
        font-size: 24px;
      }
      .minval,
      .maxval {
        /*specify to make sure the tags don't change when the counter's colors are changes*/
        color: var(--text-color);
        display: inline-flex;
        margin: 24px 4px 24px 4px;
      }

      .plus-button:hover,
      .plus-button:focus-within,
      .minus-button:hover,
      .minus-button:focus-within {
        /*changes alpha value (looks less transparent), when focused or hovered*/
        background-color: rgba(0, 0, 0, 0.8);
      }
    `;
  }

  render() {
    var textcolor;
    var bgcolor;
    if (this.counter === this.min || this.counter === this.max) {
      textcolor = "#ffe301";
      bgcolor= "#ff0000";

    }
    return html` <confetti-container id="confetti">
      <div class="card" style="background-color:${bgcolor}; border-radius: 16px;">
        <div class="counter-container">
          <h1 class="counter" style="color:${textcolor};">${this.counter}</h1>
        </div>
        <div>
          <!-- It does not look like the button is disabled when it hits min/max, but if you look closely the outline color doesn't change so it should be disabled -->
          <button
            class="minus-button"
            @click="${this.minus}"
            ?disabled="${this.min === this.counter}"
          >
            -
          </button>
          <button
            class="plus-button"
            @click="${this.plus}"
            ?disabled="${this.max === this.counter}"
          >
            +
          </button>
        </div>
        <div>
          <p class="minval">Min: ${this.min}</p>
          <p class="maxval">Max: ${this.max}</p>
        </div>
      </div>
    </confetti-container>`;
  }

  plus() {
    //increments the counter value if the .plus button is clicked
    if (this.counter < this.max && this.counter >= this.min) {
      this.counter++;
    }
  }

  minus() {
    //increments the counter value if the .plus button is clicked
    if (this.counter <= this.max && this.counter > this.min) {
      this.counter--;
    }
  }

  updated(changedProperties) {
    if (changedProperties.has("counter")) {
      // do your testing of the value and make it rain by calling makeItRain
      if (this.counter == 21) {
        this.makeItRain();
      }
    }
  }

  makeItRain() {
    // this is called a dynamic import. It means it won't import the code for confetti until this method is called
    // the .then() syntax after is because dynamic imports return a Promise object. Meaning the then() code
    // will only run AFTER the code is imported and available to us
    import("@lrnwebcomponents/multiple-choice/lib/confetti-container.js").then(
      (module) => {
        // This is a minor timing 'hack'. We know the code library above will import prior to this running
        // The "set timeout 0" means "wait 1 microtask and run it on the next cycle.
        // this "hack" ensures the element has had time to process in the DOM so that when we set popped
        // it's listening for changes so it can react
        setTimeout(() => {
          // forcibly set the poppped attribute on something with id confetti
          // while I've said in general NOT to do this, the confetti container element will reset this
          // after the animation runs so it's a simple way to generate the effect over and over again
          this.shadowRoot.querySelector("#confetti").setAttribute("popped", "");
        }, 0);
      }
    );
  }

  static get properties() {
    return {
      counter: { type: Number, reflect: true },
      max: { type: Number, reflect: true },
      min: { type: Number, reflect: true },
    };
  }
}

globalThis.customElements.define(CounterApp.tag, CounterApp);
