Ext.ns('Ext.ux');

/**
 * @class Ext.ux.AlertBox
 * @extends Ext.util.Observable
 * A message box diplayed in the browser. Can be used by the alias name 'AlertBox'.
 * @author aR Talat
 * @version 1.0
 * @singleton
 *
 */

Ext.ux.AlertBox = Ext.extend(Ext.util.Observable, {

    /**
     * Adds a close button in the AlertBox if true. Set to true by default.
     *
     * @type {String}
     */
    closable: true,

    /**
     *The CSS class of the close button div. Set to 'closeBox' by default.
     *
     * @type {String}
     */
    closeCls: 'closeBox',

    /**
     * The text of the close button. Set to 'X' by default.
     *
     * @type {String}
     */
    closeText: 'X',

    /**
     * Location of the sceen where AlertBox will be docked to.
     * There are 4 possible values:
     *
     * <ul>
     *  <li>top</li>
     *  <li>bottom</li>
     *  <li>left</li>
     *  <li>right</li>
     * </ul>
     *
     * @type {String}
     */
    dock: 'top',

    /**
     * The CSS class for the icon of the AlertBox.
     * There are 8 icons that are shipped with AlertBox:
     *
     * <ul>
     *  <li>error</li>
     *  <li>happy</li>
     *  <li>loading</li>
     *  <li>sad</li>
     *  <li>security</li>
     *  <li>smile</li>
     *  <li>success</li>
     *  <li>warning</li>
     * </ul>
     *
     * Use 'none' to remove the icon image. Set to 'warning' by default.
     *
     * @type {String}
     */
    iconCls: 'warning',

    /**
     * The message text of the AlertBox. Set to 'Hello World!' by default.
     *
     * @type {String}
     */
    message: 'Hello World!',

    /**
     * Time in seconds to wait before closing (and removing) AlertBox.
     * Does nothing if set to 0. Set to 0 by default.
     *
     * @type {String}
     */
    timeout: 0,

    /**
     * The title text of the AlertBox. Set to 'AlertBox' by default.
     *
     * @type {String} 
     */
    title: 'AlertBox',

    /**
     * @constructor
     */
    constructor: function(config)
    {
        config = config || {};
        Ext.apply(this, config);
        Ext.ux.AlertBox.superclass.constructor.call(this, config);
    },

    /**
     * To manually set default properties.
     * 
     * @param {Object} config Object containing all config options.
     */
    configure: function(config)
    {
        config = config || {};
        Ext.apply(this, config, config);
    },

    /**
     * @private
     * @param {Object} o Object containing all options.
     *
     * Initializes the box by inserting into DOM.
     */
    init: function(o)
    {
        var dh = Ext.DomHelper;
        
        this.el = dh.insertFirst(document.body, {
            id: 'AlertBox',
            tag: 'div',
            cls: this.currentDock,
            html: this.createBoxHTML(o.title, o.message, o.icon)
        });

        if(this.closable)
        {
            var close = dh.insertFirst(this.el, {
                tag: 'div',
                cls: this.closeCls,
                html: this.closeText
            });

            Ext.fly(close).on('click', function(){
                this.hide();
            }, this);
        }
        
        if(this.currentDock=='top' || this.currentDock=='bottom')
        {
            var left = (Ext.getBody().getWidth()/2) - (Ext.fly(this.el).getWidth()/2);            
            Ext.fly(this.el).setLeft(left);

            if (this.currentDock=='top')
                Ext.fly(this.el).setTop(0);
            else
                Ext.fly(this.el).setBottom(0);
        }
        else if(this.currentDock=='left' || this.currentDock=='right')
        {
            var top = ((window.innerHeight/2) - (Ext.fly(this.el).getHeight()/2));
            Ext.fly(this.el).setTop(top);

            if (this.currentDock=='left')
                Ext.fly(this.el).setLeft(0);
            else
                Ext.fly(this.el).setRight(0);
        }
        
        Ext.fly(this.el).slideIn(this.currentDock[0]);
        
        if(o.timeout > 0)
            this.timedRemove(o.timeout);
    },

    /**
     * @private
     * @param {String} title The title of the message box.
     * @param {String} message The description of the message box.
     * @param {String} icon The icon of the message box.
     * @return {String} HTML markup to be inserted inside the ALertBox div.
     *
     * Creates the HTML markup to be inserted inside the ALertBox div.
     */
    createBoxHTML: function(title, message, icon)
    {
        var iconCls = (icon=='none') ? '' : 'class="icon ' + icon + '-alertbox_icon"';

        return String.format("<p {2}><b>{0}</b>{1}</p>", title, message, iconCls);
    },

    /**
     * Displays the AlertBox with a given message.
     * If any parameter is not given, then it uses predefined values.
     *
     * @param {String} title (optional) The title of the message box.
     * @param {String} message (optional) The description of the message box.
     * @param {String} icon (optional) The icon of the message box.
     * @param {Object} options (optional) Other options (dock, timeout).
     */
    show: function(title, message, icon, options)
    {
        options = options || {};

        var o = {
            title: title || this.title,
            message: message || this.message,
            icon: icon || this.iconCls,
            timeout: options.timeout || this.timeout
        }        

        this.currentDock = options.dock || this.dock;

        if(Ext.fly('AlertBox'))
        {
            Ext.fly('AlertBox').remove();
        }

        this.init(o);
    },

    /**
     * Hides AlertBox and removes the element from DOM.
     */
    hide: function()
    {       
        Ext.fly(this.el).slideOut(this.currentDock[0], {
            remove: true
        });
    },

    /**
     * @private
     * @param {number} time The number of seconds to wait before removing.
     *
     * Removes the element after a specified number of seconds.
     */
    timedRemove: function(time)
    {
        var me = this;
        
        var task = new Ext.util.DelayedTask(function(){
            me.hide();
        });

        task.delay(time*1000);
    }

});

var AlertBox = new Ext.ux.AlertBox();