const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;
/**
 * ClassBuilderApp - A Foundry VTT application for creating and modifying OSR character classes
 * @extends {HandlebarsApplicationMixin(ApplicationV2)}
 */
export class OSRCBApplication extends HandlebarsApplicationMixin(ApplicationV2) {

    static DEFAULT_OPTIONS = {
        id: "osr-character-builder-app",
        classes: ["osrcb-app"],
        position: {
          width: 500,
          height: 500,
        },
        tag: "div",
        window: {
          title: "OSR Character Builder",
          icon: "fas fa-book-open",
          resizable: false,
        },
        tabs: [
          {
            navSelector: ".tabs",
            contentSelector: ".tab-content",
            initial: "basic",
          },
        ],
        dragDrop: [{ dragSelector: "[data-drag]", dropSelector: ".drop" }],
        // Enable automatic scroll position preservation
        preserveScrollPositions: true,
      };
      constructor(options = {}) {
        super(options);
        this.dragDrop = this._createDragDropHandlers();
        this.isEditable = game.user.isGM;
    }
      /**
   * Render the party sheet
   * @param {Object} context - The context for the party sheet
   * @param {Object} options - The options for the party sheet
   * @static
   */
  _onRender(context, options) {
    this.dragDrop.forEach((d) => d.bind(this.element));
    this._forceTabInit(context.tabs);
  }
     /**
   * Create drag-and-drop workflow handlers for this Application
   * @returns {DragDrop[]}     An array of DragDrop handlers
   * @private
   */
  _createDragDropHandlers() {
    return this.options.dragDrop.map((d) => {
      d.permissions = {
        dragstart: this._canDragStart.bind(this),
        drop: this._canDragDrop.bind(this),
      };
      d.callbacks = {
        dragstart: this._onDragStart.bind(this),
        dragover: this._onDragOver.bind(this),
        drop: this._onDrop.bind(this),
      };
      return new foundry.applications.ux.DragDrop.implementation(d);
    });
  }

  /**
   * Define whether a user is able to begin a dragstart workflow for a given drag selector
   * @param {string} selector       The candidate HTML selector for dragging
   * @returns {boolean}             Can the current user drag this selector?
   * @protected
   */
  _canDragStart(selector) {
    // game.user fetches the current user
    return this.isEditable;
  }

  /**
   * Define whether a user is able to conclude a drag-and-drop workflow for a given drop selector
   * @param {string} selector       The candidate HTML selector for the drop target
   * @returns {boolean}             Can the current user drop on this selector?
   * @protected
   */
  _canDragDrop(selector) {
    // game.user fetches the current user
    return this.isEditable;
  }

  /**
   * Callback actions which occur at the beginning of a drag start workflow.
   * @param {DragEvent} event       The originating DragEvent
   * @protected
   */
  _onDragStart(event) {
    const el = event.currentTarget;
    if ("link" in event.target.dataset || !game.user.isGM) return;
    // Extract the data you need
    let dragData = null;

    if (!dragData) return;

    // Set data transfer
    event.dataTransfer.setData("text/plain", JSON.stringify(dragData));
  }

  /**
   * Callback actions which occur when a dragged element is over a drop target.
   * @param {DragEvent} event       The originating DragEvent
   * @protected
   */
  _onDragOver(event) {}
  _onDrop(event) {
    const data = event.dataTransfer.getData("text/plain");
  }
}